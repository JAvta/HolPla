function combine_xy(x, y, l) {
  const xy = [];
  for (let a = 0; a < x.length; a++) {
    for (let b = 0; b < y.length; b++) {
      xy.push(x[a] + y[b]);
      if (xy.length === l) return xy;// NOTE: Array
    }
  }
}

function get_headers(cc = 50) {
  let headers;
  const al = 26,
        abc = [...Array(al)].map((_, i) => String.fromCharCode(i + 65));
  if (cc > al) {
    const c = {}, alP2 = al * al, sumA = al + alP2;
    [headers, c.h0].forEach(() => [...abc]);
    if (cc > sumA) {
      c.h1 = alP2;
      const alP3 = alP2 * al;
      if (cc > sumA + alP3) {
        c.h2 = alP3;
      } else {
        c.h2 = cc - sumA;
      }
    } else {
      c.h1 = cc - al;
    }
    Object.keys(c).slice(1).forEach((h, i) => {
      c[h] = combine_xy(abc, c['h' + i], c[h]);
      headers.push(...c[h]);
    });
  } else {
    headers = abc.slice(0, cc);
  }
  return headers;// NOTE: Array
}

function build_cells(c, r = 25) {
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

document.body.appendChild(build_cells(9,9));// TEMP:
