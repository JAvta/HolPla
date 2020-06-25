let xy;
function combine_xy(x, y, l, f) {
  const [xl, yl] = [x.length, y.length];
  if (!l) l = xl * yl;
  if (!f) {
    xy = [];
    f = (a, b) => xy.push(a + b);
  } else {
    xy = document.createDocumentFragment();
  }
  let i = 0;
  for (let a = 0; a < xl; a++) {
    for (let b = 0; b < yl; b++) {
      i++;
      f(x[a], y[b]);
      if (i === l) return xy;
    }
  }
}

function get_headers(cc = 50) {
  let headers;
  const al = 26,
        abc = [...Array(al)].map((_, i) => String.fromCharCode(i + 65));
  if (cc > al) {
    const c = {}, alP2 = al * al, sumA = al + alP2;
    [headers, c.h0] = [...Array(2)].map(() => [...abc]);
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
  return headers;
}

function helper(a, b) {
  xy.appendChild(document.createElement('p'));// TEMP:
}

function build_cells(cols, rr = 25) {
  cols = get_headers(cols);
  const rows = [...Array(++rr).keys()].splice(1);

  return combine_xy(cols, rows, NaN, helper);
}
console.log(build_cells());// TEMP:
