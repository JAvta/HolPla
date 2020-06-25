function combine_ar(x, y, l) {
  const ar = [], [xl, yl] = [x.length, y.length];
  if (!l) l = xl * yl;
  const last_col = "XFD", last_row = 1048576;
  let limit = last_col;
  if (!isNaN(y[0])) limit += last_row;
  for (let a = 0; a < xl; a++) {
    for (let b = 0; b < yl; b++) {
      const xy = x[a] + y[b];
      ar.push(xy);
      if (ar.length === l || xy === limit) return ar;
    }
  }
}

function build_colHeads(cc = 16384) {
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
console.log(build_colHeads());// TEMP:
