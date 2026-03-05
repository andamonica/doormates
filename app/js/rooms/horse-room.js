window.addEventListener("load", function () {
  const room = document.querySelector(".room-page-body");
  if (room) {
    room.style.opacity = "1";
  }
});

// 创建一个数组，每项对应一对图片和音频的 ID
document.querySelectorAll(".overlay-img").forEach((img) => {
  const audioId = img.getAttribute("data-audio");
  const audio = document.getElementById(audioId);

  img.addEventListener("mouseenter", () => {
    if (audio) {
      try { audio.currentTime = 0; } catch (e) { }
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => console.log("Audio play interrupted:", error));
      }
    }
  });

  img.addEventListener("mouseleave", () => {
    if (audio) {
      audio.pause();
      try { audio.currentTime = 0; } catch (e) { }
    }
  });
});

function openDoor() {
  const door = document.getElementById("door-image3");

  // 顺时针绕Y轴旋转90度（正数表示顺时针）
  door.style.transform = "rotateY(-90deg)";

  // 1秒动画后 + 等0.5秒再跳转
  setTimeout(() => {
    window.location.href = "./game-world/";
  }, 1500);
}
