window.addEventListener("load", function () {
  const room = document.querySelector(".room-page-body");
  if (room) {
    room.style.opacity = "1";
  }
});
// Tur4的输入数字互动
document.getElementById("check-answer").addEventListener("click", function () {
  const input = document.getElementById("answer-input").value.trim();

  const successImage = document.getElementById("success-image");
  const correctAudio = document.getElementById("correct-audio");
  const wrongAudio = document.getElementById("wrong-audio");
  const rotateImage = document.getElementById("rotate-image");

  if (input === "6") {
    successImage.style.display = "block";
    correctAudio.currentTime = 0;
    correctAudio.play();

    // 旋转 90 度
    rotateImage.style.transform = "rotate(-90deg)";
  } else {
    successImage.style.display = "none";
    wrongAudio.currentTime = 0;
    wrongAudio.play();

    // 回答错误时不改变（或你也可以重置角度）
    rotateImage.style.transform = "rotate(0deg)";
  }
});

function openDoor() {
  const door = document.getElementById("door-image4");

  // 顺时针绕Y轴旋转90度（正数表示顺时针）
  door.style.transform = "rotateY(-90deg)";

  // 1秒动画后 + 等0.5秒再跳转
  setTimeout(() => {
    window.location.href = "./game-world/";
  }, 1500);
}
