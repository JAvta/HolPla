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
      const ref = headers[c + x] + (r + y);
      fill[ref] = [cell];
      if (cell['class']) fill[ref]['class'] = cell['class'];
    }));
}

function three_upper(string) {
  return string.slice(0, 3).toUpperCase();
}

function find_banks(year, banks = []) {
  `
  2020
  1 January	Wednesday	New Year’s Day
  10 April	Friday	Good Friday
  13 April	Monday	Easter Monday
  8 May	Friday	Early May bank holiday (VE day)
  25 May	Monday	Spring bank holiday
  31 August	Monday	Summer bank holiday
  25 December	Friday	Christmas Day
  28 December	Monday	Boxing Day (substitute day)
  `.split('\n').forEach(line => {
    line = line.split('	');
    const [date, name] = [line[0].trim().split(' '), line[2]];
    if (name) banks[date[0] + three_upper(date[1])] = name;
  });
  banks[0] = [[[], [], year + ' Bank Holidays']];
  return banks;
}

function find_class(day) {
  return day > 4 ? 'weekend' : 'weekday';
}

function get_days(locale) {
  const days = [];
  for (let day = 7; day--;) {
    days.unshift([three_upper(new Date(2020, 0, 6 + day)
      .toLocaleDateString(locale, {weekday: 'short'}))]);
    days[0]['class'] = ['week-days', find_class(day)];
  }
  return days;
}

function find_day(date) {
  return (date.getDay() + 6) % 7;
}

function fill_calendar(year, banks, target = 'a2', locale = 'en-GB') {
  const plans = {
    '17FEB': {},
    '9MAR': {end: '11MAR'},
    '20AUG': {end: '25AUG', desc: 'IS'},
    '18SEP': {},
    '1OCT': {end: '23OCT'},
    '2DEC': {end: '4DEC'},
    '31DEC': {desc: 'LV'}
  };
  let end, planned = false;
  const today = new Date();
  if (!year) year = today.getFullYear();
  if (!banks) banks = find_banks(year);
  const date = new Date(year, 0, 1),
        days = get_days(locale),
        [x, y] = find_xy(target);
  while (year === date.getFullYear()) {
    const name = date.toLocaleDateString(locale, {month: 'long'}),
          abbr = three_upper(name),
          w = find_day(date),
          m = date.getMonth(),
          row = m + y;
    fill[headers[x] + row] = [name];
    while (m === date.getMonth()) {
      const d = date.getDate(),
            ref = headers[d + w + x] + row,
            key = d + abbr,
            day = find_day(date),
            classes = [find_class(day), abbr];
      fill[ref] = [d];
      if (key in banks) {
        classes.unshift('bank');
        banks[0].push([[days[day][0]], [d + ' ' + abbr], [banks[key]]]);
        ['banklist-days', 'banklist-dates', 'banklist-names'].forEach(
          (item, i) => banks[0][banks[0].length - 1][i]['class'] = [item]);
      }
      if (end || key in plans) {
        planned ? classes.unshift('planned') : classes.unshift('passed');
        if (key in plans && 'end' in plans[key]) {
          end = plans[key]['end'];
        } else if (key === end) {
          end = 0;
        }
      }
      if (date.toDateString() === today.toDateString()) {
        classes.unshift('today');
        planned = true;
      }
      fill[ref]['class'] = [...classes];
      date.setDate(d + 1);
    }
  }
  return [year, days, banks[0]];
}

function get_data(r) {
  const [year, days, banks] = fill_calendar(), da = {};
  da._1 = [...r.keys()].map(i => [r[i]]);
  da.a0 = [...headers].slice(1);
  da.a1 = [year, ...days];
  da.ai1 = year.toString().split('');
  da.at18 = banks;
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
        if (fill[ref]['class']) classes.push(...fill[ref]['class']);
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
DRAFT:
document.addEventListener("DOMContentLoaded", () => console.log(
  document.getElementsByClassName('r0').length));
$0.classList[$0.classList.length - 1];
$0.innerText;
holidays = {Dateobj: 'Good Friday' etc.}
*/
