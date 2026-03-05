//pupu audio//
const image = document.getElementById("hover-image");
const audio = document.getElementById("hover-audio");

image.addEventListener("mouseenter", () => {
  audio.currentTime = 0; // 从头播放
  audio.play();
});

image.addEventListener("mouseleave", () => {
  audio.pause(); // 停止播放
  audio.currentTime = 0; // 重置时间
});

//擦除
const scratchCanvas = document.getElementById("scratch-canvas");
const drawctx = scratchCanvas.getContext("2d");
scratchCanvas.width = scratchCanvas.offsetWidth;
scratchCanvas.height = scratchCanvas.offsetHeight;

// 加载上层图像（遮盖层）
const overlayImg = new Image();
overlayImg.src = "gray.png"; // 你想擦除的那一张
overlayImg.onload = () => {
  drawctx.drawImage(
    overlayImg,
    0,
    0,
    scratchCanvas.width,
    scratchCanvas.height
  );
};

let erasing = false;

scratchCanvas.addEventListener("mousedown", () => {
  erasing = true;
});
scratchCanvas.addEventListener("mouseup", () => {
  erasing = false;
  drawctx.beginPath();
});
scratchCanvas.addEventListener("mousemove", erase);

function erase(e) {
  if (!erasing) return;
  const rect = scratchCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  drawctx.globalCompositeOperation = "destination-out"; // 擦除模式
  drawctx.beginPath();
  drawctx.arc(x, y, 20, 0, Math.PI * 2);
  drawctx.fill();
}
