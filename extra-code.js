(function () {
  var KEY = 'qa3da-limit', OPTS = [0, 5, 10, 15, 20, 30];
  var lim = parseInt(localStorage.getItem(KEY) || '0', 10) || 0, qn = 0;
  var row = document.createElement('div');
  row.className = 'row';
  row.id = 'limitRow';
  row.style.cssText = 'align-items:center;gap:8px;flex-wrap:wrap';
  var lab = document.createElement('span');
  lab.textContent = '🎯 عدد الأسئلة في اللعبة:';
  var sel = document.createElement('select');
  sel.style.cssText = 'padding:8px;border-radius:10px;font:inherit';
  OPTS.forEach(function (n) {
    var o = document.createElement('option');
    o.value = n;
    o.textContent = n ? arNum(n) + ' سؤال' : 'مفتوحة (من غير حد)';
    if (n === lim) o.selected = true;
    sel.appendChild(o);
  });
  var prog = document.createElement('b');
  row.append(lab, sel, prog);
  var rr = document.getElementById('resetRow');
  rr.parentNode.insertBefore(row, rr);
  function upd() { prog.textContent = lim ? '(' + arNum(Math.min(qn, lim)) + '/' + arNum(lim) + ')' : ''; }
  sel.onchange = function () { lim = parseInt(sel.value, 10) || 0; localStorage.setItem(KEY, String(lim)); upd(); };
  var d0 = draw;
  draw = function (cat) {
    if (!drawnCount) qn = 0;
    var q = cat !== PUNISH;
    if (q && lim && qn >= lim && players.length) {
      qn = lim;
      upd();
      showEndScreen();
      sfx('answer');
      return;
    }
    var r = d0.apply(this, arguments);
    if (q) { qn++; upd(); }
    return r;
  };
  setInterval(function () { if (!drawnCount) qn = 0; upd(); }, 600);
  upd();
})();
