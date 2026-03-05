////////////// Utility Functions for Interactive Elements //////////////
////////////////////////////////////////////////////////////////////////

/**
 * Create hover interaction for elements with visual + audio feedback
 * @param {string} areaId - ID of the clickable area element
 * @param {string} visualId - ID of the visual element (GIF/image)
 * @param {string} audioId - ID of the audio element
 * @param {boolean} resetGif - Whether to reset GIF source on hover (default: false)
 */
function create_hoverInteraction(areaId, visualId, audioId, resetGif = false) {
  const area = document.getElementById(areaId);
  const visual = document.getElementById(visualId);
  const audio = document.getElementById(audioId);
  if (!area || !visual || !audio) return;

  area.addEventListener("mouseenter", () => {
    // Reset GIF if needed
    if (resetGif && visual.src) visual.src = visual.src;

    // Show visual and play audio
    visual.style.opacity = "1";
    audio.currentTime = 0;
    audio.play();
  });

  area.addEventListener("mouseleave", () => {
    visual.style.opacity = "0";
    audio.pause();
    audio.currentTime = 0;
  });
}

/**
 * Create simple audio-only interaction
 * @param {string} areaId - ID of the clickable area element
 * @param {string} audioId - ID of the audio element
 */
function create_audioInteraction(areaId, audioId) {
  const area = document.getElementById(areaId);
  const audio = document.getElementById(audioId);
  if (!area || !audio) return;

  area.addEventListener("mouseenter", () => {
    audio.currentTime = 0;
    audio.playbackRate = 1;
    audio.play();
  });

  area.addEventListener("mouseleave", () => {
    audio.pause();
    audio.currentTime = 0;
  });
}

/**
 * Create animation + audio interaction
 * @param {string} areaId - ID of the clickable area element
 * @param {string} animatedElementId - ID of the animated element
 * @param {string} audioId - ID of the audio element
 * @param {string} animationName - CSS animation name
 * @param {string} duration - Animation duration (e.g., "1.8s")
 */
function create_animationInteraction(areaId, animatedElementId, audioId, animationName, duration) {
  const area = document.getElementById(areaId);
  const animatedElement = document.getElementById(animatedElementId);
  const audio = document.getElementById(audioId);
  if (!area || !animatedElement || !audio) return;

  area.addEventListener("mouseenter", () => {
    animatedElement.style.opacity = 1;

    // Reset animation
    animatedElement.style.animation = "none";
    void animatedElement.offsetWidth; // Force reflow

    // Start animation
    animatedElement.style.animation = `${animationName} ${duration} ease-out forwards`;

    // Play audio
    audio.currentTime = 0;
    audio.play();

    // Hide after animation ends
    animatedElement.addEventListener("animationend", () => (animatedElement.style.opacity = 0), { once: true });
  });
}

//////// auto1 /////////
////////////////////////

create_audioInteraction("outline-auto1", "autoSound1");

//////// pigeon ////////
////////////////////////

create_animationInteraction("outline-yellow-tree1", "pigeon", "pigeonSound", "pigeonFly", "1.8s");

/////// fountain ///////
////////////////////////

create_hoverInteraction("outline-fountain", "fountainGif", "fountainSound");

//////// leaves ////////
////////////////////////

create_hoverInteraction("outline-leaves", "leavesGif", "leavesSound");

///////// boat /////////
////////////////////////

create_hoverInteraction("outline-boat", "fishGif", "fishSound");

//////// light /////////
////////////////////////

create_hoverInteraction("outline-light", "light", "lightSound");

/////// PINGPONG ///////
////////////////////////

const pingpongArea = document.getElementById("outline-pingpong");
const ball = document.getElementById("pingpong-ball");
const pingpongballSound = document.getElementById("pingpong-ballSound");

let pingpongLoop = null; // 动画循环器
let playing = false; // 防止重复触发

// 依次执行动画
function playPingpongAnimation() {
  if (!playing) return;

  // 1. 向右抛弧线
  ball.style.animation = "arc-right 0.7s ease-out forwards";

  setTimeout(() => {
    if (!playing) return;

    // 2. 右边弹跳
    ball.style.animation = "bounce-right 0.4s ease-out forwards";

    setTimeout(() => {
      if (!playing) return;

      // 3. 向左抛弧线
      ball.style.animation = "arc-left 0.7s ease-out forwards";

      setTimeout(() => {
        if (!playing) return;

        // 4. 左边弹跳
        ball.style.animation = "bounce-left 0.4s ease-out forwards";

        // 结束后再次循环
        setTimeout(() => {
          if (playing) playPingpongAnimation();
        }, 400);
      }, 700);
    }, 400);
  }, 700);
}

// ——— 进入区域：开始动画 ———
pingpongArea.addEventListener("mouseenter", () => {
  playing = true;
  ball.style.opacity = 1;

  // 设置球初始位置（可调整）
  ball.style.top = "70vh";
  ball.style.left = "4vh";

  playPingpongAnimation();

  // 播放音频（每次从头）
  pingpongballSound.currentTime = 0;
  pingpongballSound.play();
});

// ——— 离开区域：停止动画 ———
pingpongArea.addEventListener("mouseleave", () => {
  playing = false;

  // 停止动画
  ball.style.animation = "none";
  void ball.offsetWidth; // 强制重绘（清除动画）

  // 隐藏球
  ball.style.opacity = 0;

  // 停止音频 + 回到开头
  pingpongballSound.pause();
  pingpongballSound.currentTime = 0;
});

///// construction /////
////////////////////////

create_audioInteraction("outline-construction", "stopSound");

//////// bench /////////
////////////////////////

create_animationInteraction("outline-bench", "mouse", "mouseSound", "runMouse", "1.3s");

//////// swing /////////
////////////////////////

create_hoverInteraction("outline-swing", "swingGif", "swingSound");

//////// slide /////////
////////////////////////

create_animationInteraction("outline-slide", "duck", "duckSound", "duckSlideDown", "1.3s");

//////// apple /////////
////////////////////////

create_hoverInteraction("outline-apple", "appleGif", "appleSound", true);

/////// leaves1 ////////
////////////////////////

create_hoverInteraction("outline-leaves1", "leaves1Gif", "leavesSound", true);

//////// apple1 ////////
////////////////////////

create_hoverInteraction("outline-apple1", "apple1Gif", "appleSound", true);

/////// leaves2 ////////
////////////////////////

create_hoverInteraction("outline-leaves2", "leaves2Gif", "leavesSound", true);

//////// apple2 ////////
////////////////////////

create_hoverInteraction("outline-apple2", "apple2Gif", "appleSound", true);

/////// pigeon1 ////////
////////////////////////

create_animationInteraction("outline-yellow-tree2", "pigeon1", "pigeonSound", "pigeon1Fly", "1.8s");

////// swim ring ///////
////////////////////////

create_hoverInteraction("outline-lake", "swimringGif", "swimringSound", true);

//////// apple3 ////////
////////////////////////

create_hoverInteraction("outline-big-tree", "apple3Gif", "appleSound", true);
