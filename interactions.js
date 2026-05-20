/* T-Gain — Custom cursor only */
(function () {
  'use strict';

  // Skip on touch devices
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const cursorDot  = document.createElement('div');
  const cursorRing = document.createElement('div');
  cursorDot.className  = 'c-dot';
  cursorRing.className = 'c-ring';
  document.body.appendChild(cursorDot);
  document.body.appendChild(cursorRing);

  let mx = -200, my = -200, rx = -200, ry = -200;
  let isPointer = false;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursorDot.style.transform = `translate(${mx}px,${my}px)`;
  });

  document.addEventListener('mouseover', e => {
    const t = e.target.closest('a,button,.pillar,.feature,.quote,.store,.faq summary,.btn');
    isPointer = !!t;
  });

  (function ringLoop() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    cursorRing.style.transform = `translate(${rx}px,${ry}px) scale(${isPointer ? 1.65 : 1})`;
    requestAnimationFrame(ringLoop);
  })();
})();
