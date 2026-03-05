console.log("%cubahn-scene-setup.js loaded ✓", "color: gold; font-weight: bold;");

const scrollContainer = document.getElementById("game-world-scroll-container");
const sceneWrapper = document.getElementById("scene-wrapper");
const bgImg = document.getElementById("bg-img");

// Set width and height on scene wrapper to prevent overflow
// caused by other elements moving inside the scene

function update_sceneWrapperSize() {
  if (sceneWrapper && bgImg) {
    const rect_img = bgImg.getBoundingClientRect();
    sceneWrapper.style.width = `${rect_img.width}px`;
    sceneWrapper.style.height = `${rect_img.height}px`;
  }
}

// Initial size update + size update on window resize
update_sceneWrapperSize();
window.addEventListener("resize", update_sceneWrapperSize);

// Suppress native scrolling with trackpad or mousewheel + with touch gestures on mobile
document.addEventListener("wheel", (e) => e.preventDefault(), { passive: false });
document.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });

console.log("%cubahn-scene-setup.js setup complete ✓", "color: green; font-weight: bold;");
