///////// Tooltip element //////////
////////////////////////////////////

const tooltip = document.createElement("div");
tooltip.className = "tooltip";
tooltip.innerText = "Go there";
document.body.appendChild(tooltip);

//////////// Functions /////////////
////////////////////////////////////

function showTooltip(text, x, y) {
  tooltip.innerText = text;
  tooltip.style.left = x + "px";
  tooltip.style.top = y + "px";
  tooltip.style.opacity = "1";
}

function hideTooltip() {
  tooltip.style.opacity = "0";
}

// Tooltip show/hide interactions //
////////////////////////////////////

const outlines = [outline_ubahn, outline_apartments, outline_door_apartments];
outlines.forEach((outline) => {
  outline.addEventListener("mousemove", (e) => {
    const tooltipText = outline.getAttribute("data-tooltip-text") || "Go there";
    showTooltip(tooltipText, e.pageX + 15, e.pageY + 15);
  });

  outline.addEventListener("mouseleave", () => {
    hideTooltip();
  });
});
