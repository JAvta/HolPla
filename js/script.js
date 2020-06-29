function combine_abx(a, b, x) {
  const ab = [];
  for (let o = 0; o < a.length; o++) {
    for (let i = 0; i < b.length; i++) {
      ab.push(a[o] + b[i]);
      if (ab.length === x) return ab;// NOTE: Array
    }
  }
}

function get_headers(c = 50) {
  const abc = 26, z = {}, headers = [];
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
  return headers;// NOTE: Array
}

function build_table(c, r = 25) {
  c = get_headers(c);
  r = [...Array(++r).keys()].slice(1);
  const table = document.createElement('table');
  for (let a = 0; a < r.length; a++) {
    const tr = document.createElement('tr');
    for (let b = 0; b < c.length; b++) {
      const td = document.createElement('td');
      td.innerHTML = c[b] + r[a];// TEMP:
      td.classList.add('[', 'js', c[b], r[a], ']');
      td.id = c[b] + r[a];
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  return table;// NOTE: HTML
}

document.body.appendChild(build_table());// TEMP:
