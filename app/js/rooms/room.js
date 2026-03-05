window.addEventListener("load", function () {
  const room = document.querySelector(".room-page-body");
  if (room) {
    room.style.opacity = "1";
  }
});
// Tur6的输入数字互动
const audioMap = {};

document.querySelectorAll(".overlay-image img").forEach((img) => {
  const audioSrc = img.getAttribute("data-audio");
  const audio = new Audio(audioSrc);
  audioMap[audioSrc] = audio;

  img.addEventListener("mouseenter", () => {
    // 停止所有其他音频
    Object.values(audioMap).forEach((a) => {
      a.pause();
      a.currentTime = 0;
    });

    // 播放当前音频
    audio.play();
  });

  img.addEventListener("mouseleave", () => {
    audio.pause();
    audio.currentTime = 0;
  });
});

// script.js
window.addEventListener("DOMContentLoaded", function () {
  const audio = document.getElementById("bg-audio");

  // 延迟 1 秒再尝试播放
  if (audio) {
    setTimeout(() => {
      audio.play().catch(() => {
        // 如果自动播放被阻止，等待用户首次点击再播放
        const resumeAudio = () => {
          audio.play();
          document.removeEventListener("click", resumeAudio);
        };
        document.addEventListener("click", resumeAudio);
      });
    }, 700); // 1000ms = 1秒
  }
});

function openDoor() {
  const door = document.getElementById("door-image1");

  // 顺时针绕Y轴旋转90度（正数表示顺时针）
  door.style.transform = "rotateY(-90deg)";

  // 1秒动画后 + 等0.5秒再跳转
  setTimeout(() => {
    window.location.href = "/game-world";
  }, 1500);
}
