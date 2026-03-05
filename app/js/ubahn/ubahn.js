console.log("%cubahn.js loaded ✓", "color: green; font-weight: bold;");

//////////////////////////////// Setup /////////////////////////////////
////////////////////////////////////////////////////////////////////////

// Player character insert
get_playerCharacter();
console.log("%cCharacter loaded ✓", "color: green; font-weight: bold;");

///////////////////////////// U-Bahn train /////////////////////////////
////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

// 点击 cell 切换图片
document.querySelectorAll(".cell").forEach((cell) => {
  cell.addEventListener("click", () => {
    // 播放点击音效
    cellClickSound.currentTime = 0; // 每次从头
    cellClickSound.play();

    const images = cell.querySelectorAll("img");
    let index = [...images].findIndex((img) => img.classList.contains("active"));
    images[index].classList.remove("active");
    images[(index + 1) % images.length].classList.add("active");
  });
});

let laufenX = 0;
let laufenSpeed = 1;
let laufenDirection = -1; // 👈 -1 = 向左，1 = 向右
let laufenIsMoving = false;
let laufenRAF = null;

function startLaufen() {
  if (laufenIsMoving) return;
  laufenIsMoving = true;

  const laufen = document.getElementById("laufen");

  function step() {
    laufenX += laufenSpeed * laufenDirection;
    laufen.style.transform = `translateX(${laufenX}px)`;

    // 👉 向右跑出屏幕后停止
    if (laufenDirection === 1 && laufen.getBoundingClientRect().left > window.innerWidth) {
      cancelAnimationFrame(laufenRAF);
      return;
    }

    laufenRAF = requestAnimationFrame(step);
  }

  laufenRAF = requestAnimationFrame(step);
}

// spray canvas

const canvas = document.getElementById("spray");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let canSpray = false; // 是否允许喷漆

  // 增加压力感
  let sprayStartTime = 0;
  let pressure = 0; // 0 ~ 1

  canvas.style.cursor = canSpray ? "crosshair" : "not-allowed"; // 不允许喷漆

  // 基础参数
  let spraying = false;
  let mouseX = 0;
  let mouseY = 0;

  // 喷漆设置（你可以大胆改这些数）
  const sprayRadius = 8; // 喷漆范围
  const particleCount = 30; // 每一帧喷多少颗粒
  let sprayColor = "255,255,255"; // 默认白色
  const sprayAlpha = 0.65;
  // spray audio
  const spraySound = document.getElementById("spraySound");
  spraySound.volume = 0.4; // 建议 0.2–0.5

  // 点击换颜色
  document.querySelectorAll(".color").forEach((el) => {
    el.addEventListener("click", () => {
      sprayColor = el.dataset.color;
    });
  });

  // 监听鼠标mousedown
  canvas.addEventListener("mousedown", () => {
    if (!canSpray) return; // 车在开，直接忽略
    spraying = true;
    sprayStartTime = performance.now();

    // 🎧 播放喷漆声
    spraySound.currentTime = 0;
    spraySound.play();
  });
  // 监听鼠标mouseup&leave
  canvas.addEventListener("mouseup", stopSpray);
  canvas.addEventListener("mouseleave", stopSpray);

  function stopSpray() {
    spraying = false;
    pressure = 0;

    // 🎧 平滑停音（推荐）
    fadeOutSound(spraySound);
  }

  // 监听鼠标mousemove
  canvas.addEventListener("mousemove", (e) => {
    if (canSpray) {
      // 使用自定义图片作为光标
      canvas.style.cursor = "url('spray-cursor.png') 16 16, crosshair";
    } else {
      // 不允许喷漆时显示禁止或默认
      canvas.style.cursor = "not-allowed";
    }
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });
}

//渐弱
function fadeOutSound(audio) {
  const fadeInterval = setInterval(() => {
    if (audio.volume > 0.05) {
      audio.volume -= 0.05;
    } else {
      audio.pause();
      audio.volume = 0.4; // 恢复默认
      clearInterval(fadeInterval);
    }
  }, 30);
}
// // 喷漆函数
// function spray() {
//   if (!spraying || !canSpray) return;

//   const now = performance.now();
//   const sprayDuration = now - sprayStartTime;

//   const basePressure = 0.25; // 👈 初始压力
//   pressure = Math.min(basePressure + sprayDuration / 2500, 1);

//   // 🎛️ 用压力控制参数
//   const dynamicAlpha = 0.2 + pressure * 0.5; // 透明度
//   const dynamicParticles = 30 + pressure * 15; // 颗粒数
//   const dynamicRadius = sprayRadius + pressure * 3; // 扩散范围

//   ctx.fillStyle = `rgba(${sprayColor}, ${dynamicAlpha})`;

//   for (let i = 0; i < dynamicParticles; i++) {
//     const angle = Math.random() * Math.PI * 2;
//     const radius = Math.random() * dynamicRadius;

//     const x = mouseX + Math.cos(angle) * radius;
//     const y = mouseY + Math.sin(angle) * radius;

//     ctx.beginPath();
//     ctx.arc(x, y, Math.random() * (1.5 + pressure * 2), 0, Math.PI * 2);
//     ctx.fill();
//   }
//   spraySound.volume = 0.2 + pressure * 0.4;
// }

// 动画循环
function animate() {
  // spray();
  requestAnimationFrame(animate);
}

animate();

// 窗口 resize 适配
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
// 按C就可以清空画布
window.addEventListener("keydown", (e) => {
  if (e.key === "c") {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
});

// 每两分钟触发一次滑动
// setInterval(slideUbahn, 120000);

// 页面加载后 2 分钟开始第一次滑动
// setTimeout(slideUbahn, 1000);

// 🔸 倒计时系统
let countdown = 120; // 120 秒 = 2min
let timerText = document.getElementById("time-text");
let jetztTimeout = null;

function updateTimeDisplay() {
  if (countdown > 60) {
    timerText.textContent = "2min";
  } else if (countdown > 10) {
    timerText.textContent = "1min";
  } else if (countdown > 0) {
    timerText.textContent = "jetzt";

    // 停留40秒后重置
    if (!jetztTimeout) {
      jetztTimeout = setTimeout(() => {
        countdown = 120; // 重置2分钟
        jetztTimeout = null;
      }, 50000); // 40秒
    }
  }
}

// 每秒减少1
if (timerText) {
  setInterval(() => {
    if (!jetztTimeout) {
      // 如果不是jetzt停留阶段才减少
      countdown--;
    }
    updateTimeDisplay();
  }, 1000);
}

function updateClock() {
  const now = new Date();

  //update clock
  const jan = new Date(now.getFullYear(), 0, 1);
  const jul = new Date(now.getFullYear(), 6, 1);
  const stdTimezoneOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
  const isDST = now.getTimezoneOffset() < stdTimezoneOffset; // 夏令时判断

  const germanyOffset = isDST ? 2 : 1; // 夏令时+2小时，否则+1小时
  const germanyHour = (now.getUTCHours() + germanyOffset) % 24;
  const minute = now.getUTCMinutes();

  const hour12 = germanyHour % 12;
  const hourDeg = hour12 * 30 + minute * 0.5;
  const minuteDeg = minute * 6;

  document.querySelector("#clock .hour").style.transform = `rotate(${hourDeg}deg)`;
  document.querySelector("#clock .minute").style.transform = `rotate(${minuteDeg}deg)`;
}

// 每秒更新
// updateClock();
// setInterval(updateClock, 1000);
