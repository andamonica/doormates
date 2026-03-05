console.log("%coverlay-ui.js loaded ✓", logStyle_loaded);

const overlayUi = document.getElementById("overlay-ui");

// Stop, if overlay UI element is not found
if (typeof overlayUi === "undefined") {
  console.error("%coverlay-ui.js: Overlay UI element not found! ✗", logStyle_error);
} else {
  // Buttons //
  ////////////////////////

  const btn_backToMap = overlayUi.querySelector("#btn-back-to-map");
  const btn_restartGame = overlayUi.querySelector("#btn-restart-game");
  const btns = [btn_backToMap, btn_restartGame];

  btns.forEach((btn) => {
    if (!btn) return;
    btn.addEventListener("click", () => {
      console.log(`%coverlay-ui.js: ${btn.id} clicked ✓`, logStyle_loaded);
      const target = btn.dataset.target;
      if (target) goToPage(target);
      else console.warn(`%coverlay-ui.js: No target URL defined for ${btn.id}! ✗`, logStyle_warning);
    });
  });

  // if (btn_backToMap) {
  //   btn_backToMap.addEventListener("click", () => {
  //     console.log("%coverlay-ui.js: Back to map button clicked ✓", logStyle_loaded);
  //     goToPage("/map");
  //   });
  // } else {
  //   console.warn("%coverlay-ui.js: Back to map button not found! ✗", logStyle_warning);
  // }

  console.log("%coverlay-ui.js: Overlay UI initialized ✓", logStyle_setupComplete);
}
