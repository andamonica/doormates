document.querySelectorAll(".hover-audio-trigger").forEach((img) => {
  const audioId = img.getAttribute("data-audio");
  const audio = document.getElementById(audioId);

  if (audio) {
    img.addEventListener("mouseenter", () => {
      audio.currentTime = 0;
      audio.play();
    });

    img.addEventListener("mouseleave", () => {
      audio.pause();
      audio.currentTime = 0;
    });
  }
});

const img = document.getElementById("hover-door");
if (img) {
  img.addEventListener("mouseenter", () => {
    img.classList.add("opening");

    // 动画结束后跳转（确保与 transition 时间一致）
    setTimeout(() => {
      window.location.href = "/character-creator"; // 修改为目标地址
    }, 1000);
  });
}
