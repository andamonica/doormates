console.log("game-world.js loaded");

//////////////////////////////// Setup /////////////////////////////////
////////////////////////////////////////////////////////////////////////

// Get character ID from cookie
const characterId = Cookies.get("characterId");
console.log("Character ID from cookie:", characterId);

// Get character data from API
const characterData = fetch("/api.character.get", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ characterId: characterId }),
})
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to fetch character data");
    }
    return response.json();
  })
  .then((data) => {
    console.log("Character data:", data);
    // Set character image and name
    const characterImg = document.querySelector("#character img");
    characterImg.src = data.characterImgUrl || "/app/assets/images/doormates/7.png"; // Fallback image
  })
  .catch((error) => {
    console.error("Error fetching character data:", error);
    const characterImg = document.querySelector("#character img");
    if (characterImg && !characterImg.src.includes('data:image')) {
      characterImg.src = "/app/assets/images/doormates/7.png";
    }
  });

const character = document.getElementById("character");
const bgPanel = document.getElementById("world-bg");
const doorElements = document.querySelectorAll(".bg-panel-door");
const speechBubble = document.getElementById("speech-bubble");

const speed = 5;
let scrollX = 0;
let movingLeft = false;
let movingRight = false;
let inDoor = false;

function updatePosition() {
  // 背景滚动模拟人物移动
  if (movingLeft) scrollX -= speed;
  if (movingRight) scrollX += speed;
  scrollX = Math.max(0, scrollX);
  bgPanel.scrollLeft = scrollX;

  if (!character) return;
  const characterRect = character.getBoundingClientRect();
  let isColliding = false;
  let targetDoor = null;

  // 检测与门的碰撞
  doorElements.forEach((door) => {
    const doorRect = door.getBoundingClientRect();
    if (
      characterRect.right > doorRect.left &&
      characterRect.left < doorRect.right &&
      characterRect.bottom > doorRect.top &&
      characterRect.top < doorRect.bottom
    ) {
      isColliding = true;
      targetDoor = door;
    }
  });
  // 设置气泡内文字+door探出人头

  if (isColliding && !inDoor && targetDoor) {
    currentActiveDoor = targetDoor; // 追踪当前激活的门

    // 获取 doorId
    const doorId = currentActiveDoor.getAttribute("data-door-id");

    // 显示对应的 why 按钮（每次都显示）
    document.querySelectorAll(".bubble-why").forEach((btn) => {
      btn.style.display = "none";
    });
    const whyBtn = document.querySelector(`.why-door-${doorId}`);
    if (whyBtn) {
      whyBtn.style.display = "block";
    }

    // 隐藏所有 answer 按钮（确保每次靠近门都只看到 why）
    document.querySelector(".bubble-answer").style.display = "none";

    const doorRect = targetDoor.getBoundingClientRect();
    const question =
      targetDoor.getAttribute("data-question") || "No question available";

    // Update the bubble text with the door's question
    document.getElementById("bubble-text").textContent = question;

    // 设置气泡位置为门的右上角
    speechBubble.style.left = `${doorRect.right - 170}px`;
    speechBubble.style.top = `${doorRect.top - 40}px`;
    speechBubble.style.display = "block";

    // 按钮元素
    const openBtn1 = document.querySelector(".open-door-button");
    const openBtn2 = document.querySelector(".open-door-button22");
    const openBtn3 = document.querySelector(".open-door-button33");
    const openBtn4 = document.querySelector(".open-door-button44");
    const openBtn5 = document.querySelector(".open-door-button55");

    // 根据当前门的id显示对应按钮，隐藏另一个
    if (targetDoor.id === "door-image") {
      // 只有在 why 按钮被隐藏时才显示 openBtn1
      if (whyBtn && whyBtn.style.display === "none") {
        openBtn1.style.display = "block";
      } else {
        openBtn1.style.display = "none";
      }
      openBtn2.style.display = "none";
      openBtn3.style.display = "none";
      openBtn4.style.display = "none";
      openBtn5.style.display = "none";
    } else if (targetDoor.id === "door-image-22") {
      if (whyBtn && whyBtn.style.display === "none") {
        openBtn2.style.display = "block";
      } else {
        openBtn2.style.display = "none";
      }
      openBtn1.style.display = "none";

      openBtn3.style.display = "none";
      openBtn4.style.display = "none";
      openBtn5.style.display = "none";
    } else if (targetDoor.id === "door-image-33") {
      if (whyBtn && whyBtn.style.display === "none") {
        openBtn3.style.display = "block";
      } else {
        openBtn3.style.display = "none";
      }
      openBtn1.style.display = "none";
      openBtn2.style.display = "none";

      openBtn4.style.display = "none";
      openBtn5.style.display = "none";
    } else if (targetDoor.id === "door-image-44") {
      if (whyBtn && whyBtn.style.display === "none") {
        openBtn4.style.display = "block";
      } else {
        openBtn4.style.display = "none";
      }
      openBtn1.style.display = "none";
      openBtn2.style.display = "none";
      openBtn3.style.display = "none";

      openBtn5.style.display = "none";
    } else if (targetDoor.id === "door-image-55") {
      if (whyBtn && whyBtn.style.display === "none") {
        openBtn5.style.display = "block";
      } else {
        openBtn4.style.display = "none";
      }
      openBtn1.style.display = "none";
      openBtn2.style.display = "none";
      openBtn3.style.display = "none";
      openBtn4.style.display = "none";
    } else {
      openBtn1.style.display = "none";
      openBtn2.style.display = "none";
      openBtn3.style.display = "none";
      openBtn4.style.display = "none";
      openBtn5.style.display = "none";
    }

    targetURL = targetDoor.getAttribute("data-url") || null;

    // 获取当前门的 overlay 图片（同在 .door-container 中）
    const overlayImage = targetDoor.parentElement.querySelector(
      ".door-overlay-image",
    );
    if (overlayImage) {
      overlayImage.style.opacity = 1;
      overlayImage.style.transform = "translateY(-20px)";
    }
    // 获取并播放当前门的音频
    const audio = targetDoor.parentElement.querySelector(".door-audio");
    if (audio) {
      audio.currentTime = 0; // 从头播放
      audio.play().catch(e => console.warn("Audio autoplay prevented by browser. User interaction needed:", e));
    }

    // // ✅ 如果是第六个门，就播放视频和音频
    if (question === "What superpower do you want to have?") {
      // stone 砸下来
      const stone0 = document.getElementById("falling-stone-0");
      const stone1 = document.getElementById("falling-stone-1");
      const stone2 = document.getElementById("falling-stone-2");
      if (stone0) {
        stone0.classList.remove("animate"); // 重置动画
        void stone0.offsetWidth; // 强制重绘
        stone0.classList.add("animate");

        // 播放音效
        const stoneSound = document.getElementById("stone-sound");
        if (stoneSound) {
          stoneSound.currentTime = 0;
          stoneSound.play();
        }
      }

      if (stone1) {
        stone1.classList.remove("animate"); // 重置动画
        void stone1.offsetWidth; // 强制重绘

        setTimeout(() => {
          stone1.classList.add("animate");
        }, 200); // 1000ms = 1秒后才添加 animate 类

        // 第二块石头的音效（也可以使用同一个音频）
        const stoneSound2 = document.getElementById("stone-sound2");
        if (stoneSound2) {
          stoneSound2.currentTime = 0;
          stoneSound2.play();
        }
      }

      if (stone2) {
        stone2.classList.remove("animate"); // 重置动画
        void stone1.offsetWidth; // 强制重绘

        setTimeout(() => {
          stone2.classList.add("animate");
        }, 500); // 1000ms = 1秒后才添加 animate 类

        // 第二块石头的音效（也可以使用同一个音频）
        const stoneSound3 = document.getElementById("stone-sound3");
        if (stoneSound3) {
          stoneSound3.currentTime = 0;
          stoneSound3.play();
        }
      }

      // （你的视频和音频播放逻辑保留不变）
      const section = targetDoor.closest(".bg-panel-section");
      if (section) {
        const video = section.querySelector(".photo-container6 video");
        const extraAudio = section.querySelector(".photo-container6 audio");
        if (video) {
          video.currentTime = 0;
          video.playbackRate = 1.1;
          setTimeout(() => video.play(), 0);
        }
        if (extraAudio) {
          extraAudio.currentTime = 0;
          extraAudio.loop = true;
          setTimeout(() => extraAudio.play(), 600);
        }
      }
    }

    inDoor = true;
  } else if (!isColliding && inDoor) {
    currentActiveDoor = null;
    speechBubble.style.display = "none";
    inDoor = false;

    // 隐藏两个按钮
    document.querySelector(".open-door-button").style.display = "none";
    document.querySelector(".open-door-button22").style.display = "none";
    document.querySelector(".open-door-button33").style.display = "none";
    document.querySelector(".open-door-button44").style.display = "none";
    document.querySelector(".open-door-button55").style.display = "none";

    // 隐藏所有 overlay 图片
    document.querySelectorAll(".door-overlay-image").forEach((img) => {
      img.style.opacity = 0;
      img.style.transform = "translateY(0)";
    });

    // 👉 新增：停止第六个门的 video 和 audio
    const section = document
      .querySelector(".photo-container6")
      ?.closest(".bg-panel-section");
    if (section) {
      const video = section.querySelector(".photo-container6 video");
      const extraAudio = section.querySelector(".photo-container6 audio");

      if (video) {
        video.pause();
        video.currentTime = 0;
      }
      if (extraAudio) {
        extraAudio.pause();
        extraAudio.currentTime = 0;
      }
    }
  }

  requestAnimationFrame(updatePosition);
}

//////////////////////////// Door dialogues ////////////////////////////
////////////////////////////////////////////////////////////////////////

let dialogueSteps = {
  1: 0, // 对应 door 1
  2: 0,
  3: 0,
  4: 0,
  5: 0, // 对应 door 2
  // 可继续添加 door 3、4、5...
};

function handleWhyClick(doorId) {
  const bubbleText = document.getElementById("bubble-text");
  const whyBtn = document.querySelector(`.why-door-${doorId}`);
  const answerBtn = document.querySelector(".bubble-answer");

  // 所有 open 按钮
  const openBtns = {
    1: document.querySelector(".open-door-button"),
    2: document.querySelector(".open-door-button22"),
    3: document.querySelector(".open-door-button33"),
    4: document.querySelector(".open-door-button44"),
    5: document.querySelector(".open-door-button55"),
  };

  if (doorId === 1) {
    if (dialogueSteps[1] === 0) {
      bubbleText.innerHTML = "My boyfriend forgot to<br>water my flowers.";
      whyBtn.textContent = "weiter";
      dialogueSteps[1] = 1;
    } else if (dialogueSteps[1] === 1) {
      bubbleText.textContent = "I need advice on how to punish my boyfriend.";
      whyBtn.style.display = "none";
      answerBtn.style.display = "block";
      openBtns[1].style.display = "block";
    }
  }

  if (doorId === 2) {
    if (dialogueSteps[2] === 0) {
      bubbleText.innerHTML =
        "I want to see how many<br>times he went to the bathroom in his life.";
      whyBtn.textContent = "weiter";
      dialogueSteps[2] = 1;
    } else if (dialogueSteps[2] === 1) {
      bubbleText.textContent =
        "what's one statistic you'd love to see in the afterlife?";
      whyBtn.style.display = "none";
      answerBtn.style.display = "block";
      openBtns[2].style.display = "block";
    }
  }

  if (doorId === 3) {
    if (dialogueSteps[3] === 0) {
      bubbleText.textContent = "I'm so hungry.";
      whyBtn.textContent = "weiter";
      dialogueSteps[3] = 1;
    } else if (dialogueSteps[3] === 1) {
      bubbleText.innerHTML =
        "But I really don't know<br>what should I eat tonight?";
      whyBtn.style.display = "none";
      answerBtn.style.display = "block";
      openBtns[3].style.display = "block";
    }
  }

  if (doorId === 4) {
    if (dialogueSteps[4] === 0) {
      bubbleText.innerHTML =
        "I guess I might have been<br>a horse in my past life.";
      whyBtn.textContent = "weiter";
      dialogueSteps[4] = 1;
    } else if (dialogueSteps[4] === 1) {
      bubbleText.innerHTML = "What do you think your<br>past life was?";
      whyBtn.style.display = "none";
      answerBtn.style.display = "block";
      openBtns[4].style.display = "block";
    }
  }

  if (doorId === 5) {
    if (dialogueSteps[5] === 0) {
      bubbleText.textContent = "I almost had a car accident just now.";
      whyBtn.textContent = "weiter";
      dialogueSteps[5] = 1;
    } else if (dialogueSteps[5] === 1) {
      bubbleText.innerHTML = "How do you think<br>you will die?";
      whyBtn.style.display = "none";
      answerBtn.style.display = "block";
      openBtns[5].style.display = "block";
    }
  }
}

// 键盘控制
document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowLeft") movingLeft = true;
  if (e.code === "ArrowRight") movingRight = true;

  if (
    (e.code === "ArrowLeft" || e.code === "ArrowRight") &&
    character && !character.classList.contains("walking")
  ) {
    character.classList.add("walking");
  }
});

document.addEventListener("keyup", (e) => {
  if (e.code === "ArrowLeft") movingLeft = false;
  if (e.code === "ArrowRight") movingRight = false;

  if (!movingLeft && !movingRight && character) {
    character.classList.remove("walking");
  }
});

// Focus on game bg to enable vertical scroll via walk anim. //
window.addEventListener("load", () => {
  const worldBg = document.getElementById("world-bg");
  if (worldBg) {
    worldBg.tabIndex = 0;
    worldBg.focus();
  }
});

// 启动循环
requestAnimationFrame(updatePosition);

//klick answer//
function togglePanel() {
  const panel = document.getElementById("right-panel");

  // 切换显示状态
  if (panel.style.display === "block") {
    panel.style.display = "none";
    document.removeEventListener("click", outsideClickListener);
  } else {
    panel.style.display = "block";
    // 添加监听点击外部事件
    setTimeout(() => {
      document.addEventListener("click", outsideClickListener);
    }, 0); // setTimeout 让事件绑定发生在当前点击之后
  }
}

function outsideClickListener(event) {
  const panel = document.getElementById("right-panel");
  const button = document.querySelector(".bubble-answer");

  // 如果点击的不是面板或按钮，则隐藏
  if (!panel.contains(event.target) && !button.contains(event.target)) {
    panel.style.display = "none";
    document.removeEventListener("click", outsideClickListener);
  }
}

// MAYBE USE LATER //
// Marquee //
// const marquee = document.getElementById("marquee-text");
// const marqueeBox = marquee.parentElement;

// // 复制内容，实现无缝滚动
// marquee.innerHTML += marquee.innerHTML;

// // 获取单条内容宽度
// const textWidth = marquee.scrollWidth / 2;

// // 初始位置
// let pos = 0;

// // 滚动速度（像素/帧）
// const speed2 = 3;

// function animate() {
//   pos += speed2;
//   if (pos >= textWidth) {
//     pos = 0; // 重置，实现无缝
//   }
//   marquee.style.transform = `translateY(-50%) translateX(${pos}px)`;
//   requestAnimationFrame(animate);
// }

// animate();

function openDoor_fromOutside(doorID, targetURL) {
  const door = document.getElementById(doorID);
  const panel = document.querySelector(".bg-panel");
  if (!door) return;

  //  保存当前 scrollLeft 到 localStorage
  if (panel) {
    localStorage.setItem("scrollLeft", panel.scrollLeft);
  }

  // Hide illus on door with isOpening class
  const doorContainer = door.closest(".door-container");
  if (doorContainer) {
    doorContainer.classList.add("isOpening");
  }

  // Door opening animation
  door.style.transformOrigin = "right center";
  door.style.transition = "transform 1s ease-in-out";
  door.style.transform = "rotateY(-85deg)";

  // 人物 overlay 缩小动画
  const overlayImage = door.parentElement.querySelector(".door-overlay-image");
  if (overlayImage) {
    overlayImage.style.transition = "transform 0.6s ease, opacity 0.6s ease";
    overlayImage.style.transform = "scale(0)";
    overlayImage.style.opacity = "0";
  }

  setTimeout(() => {
    window.location.href = targetURL;
    // window.location.href = "/game-world/peeing-cat-room";
  }, 1100);
  // 2秒后关门（+1秒动画时间 = 总共3秒）
  setTimeout(() => {
    door.style.transform = "rotateY(0deg)";
  }, 1050);
}

window.addEventListener("DOMContentLoaded", () => {
  const panel = document.querySelector(".bg-panel");
  const scrollLeft = localStorage.getItem("scrollLeft");
  const door = document.getElementById("door-image");

  if (panel && scrollLeft !== null) {
    panel.scrollLeft = parseInt(scrollLeft, 10);
    localStorage.removeItem("scrollLeft"); // 可选：清除记录
  }

  if (door) {
    // 强制门初始化为“关闭”状态
    door.style.transformOrigin = "right center";
    door.style.transform = "rotateY(0deg)";
    door.style.transition = "transform 0.5s ease-in-out";

    // 清除任何“开门”记录（可选）
    localStorage.removeItem("doorOpened");
  }
});
