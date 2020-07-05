function combine_abx(a, b, x) {
  const ab = [];
  for (let o = 0; o < a.length; o++) {
    for (let i = 0; i < b.length; i++) {
      ab.push(a[o] + b[i]);
      if (ab.length === x) return ab;
    }
  }
}

const headers = ['_']
function get_headers(c = 50) {
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

function get_xy(target) {
  let [x, y] = target.match(/[_A-Z]+|[0-9]+/gi);
  x = headers.indexOf(x.toUpperCase());
  y = Number(y);
  return [x, y];
}

const fill = {};
function fill_data(data, target) {
  if (!Array.isArray(data[0])) data = [data];
  const [x, y] = get_xy(target);
  data.forEach((row, r) => row.forEach(
    (cell, c) => {
      const ref = headers[c + x] + (r + y);
      fill[ref] = [cell];
      if (cell['class']) fill[ref]['class'] = cell['class'];
    }));
}

function get_days(locale) {
  const days = [];
  for (let i = 7; i--;) {
    days.unshift([new Date(2020, 0, 6 + i).toLocaleDateString(
      locale, {weekday: 'short'}).slice(0, 2).toUpperCase()]);
    if (i > 4) days[0]['class'] = 'weekend';
  }
  return days;
}

function get_day(date) {
  return (date.getDay() + 6) % 7;
}

function fill_calendar(year, target = 'a2', locale = 'en-GB') {
  if (!year) year = new Date().getFullYear();
  const date = new Date(year, 0, 1), [x, y] = get_xy(target);
  while (year === date.getFullYear()) {
    const name = date.toLocaleDateString(locale, {month: 'long'}),
          w = get_day(date),
          m = date.getMonth(),
          row = m + y;
    while (m === date.getMonth()) {
      const d = date.getDate(), ref = headers[d + w + x] + row;
      fill[ref] = [d];
      if (get_day(date) > 4) fill[ref]['class'] = 'weekend';
      date.setDate(d + 1);
    }
    fill[headers[x] + row] = [name];
  }
  return [year, get_days(locale)];
}

function get_data(r) {
  const [year, days] = fill_calendar(), da = {};
  da._1 = [...r.keys()].map(i => [r[i]]);
  da.a0 = [...headers].slice(1);
  da.a1 = [year, ...days];
  da.ai1 = year.toString().split('');
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
        if (fill[ref]['class']) classes.push(fill[ref]['class']);
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
Count days off per month
Different calendar views
Multiple year view
Bucket List (car, nights, kids options)
Years view with planned holiday count per year
DRAFT:
document.addEventListener("DOMContentLoaded", () => console.log(
  document.getElementsByClassName('r0').length));
holidays = {Dateobj: 'Good Friday' etc.}
*/
