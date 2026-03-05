console.log("%cmap.js loaded ✓", "color: green; font-weight: bold;");
gsap.registerPlugin(MotionPathPlugin);

//////////////////////////////// Setup /////////////////////////////////
////////////////////////////////////////////////////////////////////////

// Player character insert
get_playerCharacter();
console.log("%cCharacter loaded ✓", "color: green; font-weight: bold;");

///////////// Functions for moving char. to points on path /////////////
////////////////////////////////////////////////////////////////////////

function move_char_toPathPosition(characterEl, path, position = "start") {
  // Use GSAP MotionPath to set position at start or end of path
  const motionPathConfig = {
    path: path,
    align: path,
    autoRotate: false,
    alignOrigin: [0.5, 0.5], // Center char. element on path point
  };

  // Set start or end position based on parameter
  if (position === "start") {
    motionPathConfig.start = 0;
  } else if (position === "end") {
    motionPathConfig.end = 0;
  }

  gsap.set(characterEl, {
    motionPath: motionPathConfig,
  });
}

//////////////////// Character movement with sound /////////////////////
////////////////////////////////////////////////////////////////////////

// play audio
function playWalkingSoundOnce() {
  walkingSound.pause(); // 先停止（避免正在播放的重叠）
  walkingSound.currentTime = 0; // 回到开头
  walkingSound.playbackRate = 0.5; // 设置播放速度
  walkingSound.play(); // 播放一次
}
// stop playing audio
function stopWalkingSound() {
  walkingSound.pause();
  walkingSound.currentTime = 0;
}

function move_char_alongPath(characterEl, path, direction = "forward") {
  console.log("Moving character along path");
  gsap.to(characterEl, {
    duration: 1.2,
    repeat: false,
    ease: "none",
    motionPath: {
      path: path,
      align: path,
      autoRotate: false,
      alignOrigin: [0.5, 0.5],
      start: direction === "forward" ? 0 : 1,
      end: direction === "forward" ? 1 : 0,
    },
  });
}

////////////////////////// Character movement //////////////////////////
////////////////////////////////////////////////////////////////////////

if (el_character) {
  ///////// Animate character along path /////////
  ////////////////////////////////////////////////

  if (path_ubahnToApartments) {
    // Move char. to start of path
    move_char_toPathPosition(el_character, path_ubahnToApartments, "start");

    // Move character on click on apartment outline
    if (outline_apartments) {
      outline_apartments.addEventListener("click", () => {
        if (currentPosition === "apartments") {
          console.log("Already at apartments");
          return; // Do nothing if already at apartments
        }
        console.log("Apartment outline clicked");
        playWalkingSoundOnce();
        move_char_alongPath(el_character, path_ubahnToApartments, "forward");
        currentPosition = "apartments";
      });
    }

    // // Move character on click on ubahn outline
    // const outline_ubahn = document.getElementById("outline-ubahn");
    // if (outline_ubahn) {
    //   outline_ubahn.addEventListener("click", () => {
    //     if (currentPosition === "ubahn") {
    //       console.log("Already at ubahn");
    //       return; // Do nothing if already at ubahn
    //     }
    //     console.log("Ubahn outline clicked");
    //     playWalkingSoundOnce();
    //     move_char_alongPath(el_character, path_ubahnToApartments, "backward");
    //     currentPosition = "ubahn";
    //   });
    // }
  }

  ///////////////////////// Click-to-enter cover /////////////////////////
  ////////////////////////////////////////////////////////////////////////

  const clickToEnterCover = document.querySelector(".click-to-enter-cover");
  if (clickToEnterCover) {
    clickToEnterCover.addEventListener("click", () => {
      console.log("Click-to-enter cover clicked");
      clickToEnterCover.style.display = "none";
    });
  }
}
