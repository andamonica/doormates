window.addEventListener("load", function () {
  const room = document.querySelector(".room-page-body");
  if (room) {
    room.style.opacity = "1";
  }
});

//pupu audio//
const image = document.getElementById("hover-image");
const audio = document.getElementById("hover-audio");

image.addEventListener("mouseenter", () => {
  try { audio.currentTime = 0; } catch (e) { } // 从头播放
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.catch(error => console.log("Audio playback interrupted:", error));
  }
});

image.addEventListener("mouseleave", () => {
  audio.pause(); // 停止播放
  try { audio.currentTime = 0; } catch (e) { } // 重置时间
});
function openDoor() {
  const door = document.getElementById("door-image0");

  // 顺时针绕Y轴旋转90度（正数表示顺时针）
  door.style.transform = "rotateY(-90deg)";

  // 1秒动画后 + 等0.5秒再跳转
  setTimeout(() => {
    window.location.href = "./game-world/";
  }, 1500);
}
