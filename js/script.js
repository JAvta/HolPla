let ar;
function combine_ar(x, y, l, f) {
  const [xl, yl] = [x.length, y.length];
  if (!l) l = xl * yl;
  if (!f) {
    ar = [];
    f = (a, b) => ar.push(a + b);
  } else {
    ar = document.createDocumentFragment();
  }
  let i = 0;
  for (let a = 0; a < xl; a++) {
    for (let b = 0; b < yl; b++) {
      i++;
      f(x[a], y[b]);
      if (i === l) return ar;
    }
  }
}

function build_colHeads(cc = 50) {
  let colHeads;
  const al = 26,
        abc = [...Array(al)].map((_, i) => String.fromCharCode(i + 65));
  if (cc > al) {
    const c = {}, alP2 = al * al, sumA = al + alP2;
    [colHeads, c.h0] = [...Array(2)].map(() => [...abc]);
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
      c[h] = combine_ar(abc, c['h' + i], c[h]);
      colHeads.push(...c[h]);
    });
  } else {
    colHeads = abc.slice(0, cc);
  }
  return colHeads;
}

function helper(a, b) {
  ar.appendChild(document.createElement('p'));// TEMP:
}

function build_cells(cols, rr = 25) {
  cols = build_colHeads(cols);
  const rows = [...Array(++rr).keys()].splice(1);

  return combine_ar(cols, rows, NaN, helper);
}
console.log(build_cells());// TEMP:
