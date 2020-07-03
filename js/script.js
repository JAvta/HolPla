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

const fill = {};
function fill_data(data, target) {
  if (!Array.isArray(data[0])) data = [data];
  let [h, n] = target.match(/[_A-Z]+|[0-9]+/gi);
  h = headers.indexOf(h.toUpperCase());
  n = Number(n);
  data.forEach((row, r) => row.forEach(
    (cell, c) => fill[headers[c + h] + (r + n)] = cell));
}

// let locale = 'en-GB';
// function get_months(l = locale) {
//   const months = [];
//   for (let i = 12; i--;)
//     months.unshift(new Date(2020, i, 1).toLocaleDateString(
//       l, {month: 'long'}));
//   return months;
// }
//
// function get_days(l = locale) {
//   const days = [];
//   for (let i = 7; i--;)
//     days.unshift(new Date(2020, 0, 6 + i).toLocaleDateString(
//       l, {weekday: 'short'}).slice(0, 2).toUpperCase());
//   return days;
// }

// get_names replaces the above two functions

function get_names(locale = 'en-GB') {
  const d = new Date(2020, 0, 6), names = [[], []];
  [[7, 'Date', {weekday: 'short'}],
  [12, 'Month', {month: 'long'}]].forEach((item, i) => {
    let [n, s, o] = item;
    for (; n--;) {
      let name = d.toLocaleDateString(locale, o);
      d['set' + s](d['get' + s]() + 1);
      if (i < 1) name = name.slice(0, 2).toUpperCase();
      names[i].push(name);
    }
  });
  return names;
}

function tu_da(data) {
  return [...data.keys()].map(i => [data[i]]);
}

function get_data(r) {
  const year = new Date().getFullYear(), [d, m] = get_names(), da = {};
  da._1 = tu_da(r);
  da.a0 = [...headers].slice(1);
  da.a1 = [year, ...d, "..."];
  da.ai1 = year.toString().split('');
  da.a2 = tu_da(m);
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
      const td = document.createElement('td'), cell = c[b] + r[a];
      if (cell in fill) td.innerHTML = fill[cell];
      td.classList.add(c[b], 'r' + r[a]);
      td.id = cell;
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
*/
