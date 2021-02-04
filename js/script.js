function combine_abx(a, b, x) {
  const ab = [];
  for (let o = 0; o < a.length; o++) {
    for (let i = 0; i < b.length; i++) {
      ab.push(a[o] + b[i]);
      if (ab.length === x) return ab;
    }
  }
}

const headers = ['_'];
function get_headers(c = 48) {
  const abc = 26, z = {};
  z.h0 = [...Array(abc).keys()].map(i => String.fromCharCode(i + 65));
  if (c > abc) {
    headers.push(...z.h0);
    const abcP2 = abc * abc, sumAbc = abc + abcP2;
    if (c > sumAbc) {
      z.h1 = abcP2;
      const abcP3 = abcP2 * abc;
      c > sumAbc + abcP3 ? z.h2 = abcP3 : z.h2 = c - sumAbc;
    } else {
      z.h1 = c - abc;
    }
    Object.keys(z).slice(1).forEach((k, i) => {
      z[k] = combine_abx(z.h0, z['h' + i], z[k]);
      headers.push(...z[k]);
    });
  } else {
    headers.push(z.h0.slice(0, c));
  }
  return headers;
}

function find_xy(target) {
  let [x, y] = target.match(/[_A-Z]+|[0-9]+/gi);
  x = headers.indexOf(x.toUpperCase());
  y = Number(y);
  return [x, y];
}

const fill = {};
function fill_data(data, target) {
  if (!Array.isArray(data[0])) data = [data];
  const [x, y] = find_xy(target);
  data.forEach((row, r) => row.forEach(
    (cell, c) => {
      const ref = headers[c + x] + (r + y), cn = cell.className;
      fill[ref] = [cell];
      if (cn) fill[ref].className = cn;
    }));
}

function three_upper(string) {
  return string.slice(0, 3).toUpperCase();
}

function find_banks(year, banks = {}) {
  `
  2021
  1 January	Wednesday	New Year’s Day
  2 April	Friday	Good Friday
  5 April	Monday	Easter Monday
  3 May	Monday	Early May bank holiday
  31 May	Monday	Spring bank holiday
  30 August	Monday	Summer bank holiday
  27 December	Monday	Christmas Day (substitute day)
  28 December	Tuesday	Boxing Day (substitute day)
  `.split('\n').forEach(line => {
    line = line.split('	');
    const [dateB, nameB] = [line[0].trim().split(' '), line[2]];
    if (nameB) banks[three_upper(dateB[1]) + dateB[0]] = nameB;
  });
  banks.list = [[[], [], [year + ' Bank Holidays']]];
  return banks;
}

function is_weekend(day) {
  return day > 4 ? true : false;
}

function find_class(weekend) {
  return weekend ? 'weekend' : 'weekday';
}

function get_days(locale) {
  const days = [];
  for (let day = 7; day--;) {
    days.unshift([three_upper(new Date(2020, 0, 6 + day)
      .toLocaleDateString(locale, {weekday: 'short'}))]);
    days[0].className = ['week-days', find_class(is_weekend(day))];
  }
  return days;
}

function find_day(date) {
  return (date.getDay() + 6) % 7;
}

function fill_calendar(year, banks, target = 'a2', locale = 'en-GB') {
  const plans = {
    JAN4: {end: 'JAN6'},
    JAN18: {},
    AUG20: {end: 'AUG25', desc: 'IS'},
    SEP18: {},
    OCT1: {end: 'OCT23'},
    DEC2: {end: 'DEC4'},
    DEC31: {desc: 'LV'}
  };
  let end, planned = 'past';
  const today = new Date();
  if (!year) year = today.getFullYear();
  if (!banks) banks = find_banks(year);
  const date = new Date(year, 0, 1),
        days = get_days(locale),
        [x, y] = find_xy(target);
  while (year === date.getFullYear()) {
    const nameM = date.toLocaleDateString(locale, {month: 'long'}),
          abbrM = three_upper(nameM),
          w = find_day(date),
          m = date.getMonth(),
          row = m + y;
    fill[headers[x] + row] = [nameM];
    while (m === date.getMonth()) {
      const d = date.getDate(),
            ref = headers[d + w + x] + row,
            key = abbrM + d,
            day = find_day(date),
            weekend = is_weekend(day),
            classes = [find_class(weekend), abbrM];
      fill[ref] = [d];
      if (key in banks) {
        classes.unshift('bank');
        banks.list.push([[days[day][0]], [d + ' ' + abbrM], [banks[key]]]);
        ['banklist-days', 'banklist-dates', 'banklist-names'].forEach(
          (item, i) => banks.list[banks.list.length - 1][i].className = [item]);
      }
      if (end || key in plans) {
        classes.unshift('holiday', planned);
        if (key in plans && 'end' in plans[key]) {
          end = plans[key]['end'];
        } else if (key === end) {
          end = 0;
        }
      }
      if (date.toDateString() === today.toDateString()) {
        classes.unshift('today');
        planned = 'plan';
      }
      fill[ref].className = [...classes];
      date.setDate(d + 1);
    }
  }
  return [year, days, banks.list];
}

function get_data(r) {
  const [year, days, banklist] = fill_calendar(), da = {};
  da._1 = [...r.keys()].map(i => [r[i]]);
  da.a0 = [...headers].slice(1);
  da.a1 = [year, ...days];
  da.ai1 = year.toString().split('');
  da.at18 = banklist;
  Object.keys(da).forEach(k => {
    fill_data(da[k], k);
  });
}

function build_table(c, r = 25) {
  c = get_headers(c);
  r = [...Array(++r).keys()];
  get_data(r.slice(1));
  const table = document.createElement('table');
  for (let a = 0; a < r.length; a++) {
    const tr = document.createElement('tr');
    for (let b = 0; b < c.length; b++) {
      const td = document.createElement('td'),
            ref = c[b] + r[a],
            classes = [c[b], 'r' + r[a]];
      if (ref in fill) {
        td.innerHTML = fill[ref][0];
        if (fill[ref].className) classes.push(...fill[ref].className);
      }
      td.id = ref;
      td.classList.add(...classes);
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  return table;
}

document.body.appendChild(build_table());

/*
NOTES OF POSSIBLE UPCOMING FEATURES:
Confirm before replacing data
Undo+redo
Highlight hover row
Highlight hover month's holidays
Highlight hover holidays/hide on click
Count days off per month
Different calendar views
Multiple year view
Bucket List (car, nights, kids options)
Years view with planned holiday count per year
Fetch bank holidays from url
Spray mode
Screenshot a planned holiday
Print holidays
Suggest holiday dates for ones picked from BL
Save on exit
Login
Export/import/share
Sync
Custom fonts
Dark mode
Weekend and banks depend on locale
DRAFT:
document.addEventListener("DOMContentLoaded", () => console.log(
  document.getElementsByClassName('r0').length));
$0.classList[$0.classList.length - 1];
$0.innerText;
holidays = {Dateobj: 'Good Friday' etc.}
*/
