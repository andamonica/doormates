window.addEventListener("load", function () {
  const room = document.querySelector(".room-page-body");
  if (room) {
    room.style.opacity = "1";
  }
});

//擦除
const scratchCanvas = document.getElementById("scratch-canvas");
const drawctx = scratchCanvas.getContext("2d");

function resizeCanvas() {
  scratchCanvas.width = scratchCanvas.offsetWidth;
  scratchCanvas.height = scratchCanvas.offsetHeight;

  // 重新绘制遮罩
  drawctx.drawImage(
    overlayImg,
    0,
    0,
    scratchCanvas.width,
    scratchCanvas.height,
  );
}

window.addEventListener("load", resizeCanvas);
window.addEventListener("resize", resizeCanvas);

// 加载上层图像（遮盖层）
const overlayImg = new Image();
overlayImg.src = "/app/assets/images/feuchtigkeit-room/gray.png"; // 你想擦除的那一张
overlayImg.onload = () => {
  drawctx.drawImage(
    overlayImg,
    0,
    0,
    scratchCanvas.width,
    scratchCanvas.height,
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

function openDoor() {
  const door = document.getElementById("door-image2");

  // 顺时针绕Y轴旋转90度（正数表示顺时针）
  door.style.transform = "rotateY(-90deg)";

  // 1秒动画后 + 等0.5秒再跳转
  setTimeout(() => {
    window.location.href = "./game-world/";
  }, 1500);
}
