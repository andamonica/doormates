console.log("%cubahn-train.js loaded ✓", logStyle_loaded);

// Stop, if ubahn vars. is not defined
if (typeof ubahnContainer === "undefined" || typeof ubahnVideo === "undefined") {
  console.error("Ubahn variables are not defined, cannot load ubahn train.");
} else {
  //////////////////////////////// Setup /////////////////////////////////
  ////////////////////////////////////////////////////////////////////////

  /////////// Variables for animation ////////////
  ////////////////////////////////////////////////

  const duration_trainMovement = 8; // seconds
  const duration_trainWaiting = 10; // seconds
  const duration_trainOffscreen = 4; // seconds
  let width_train = 0;

  // Train width //
  function update_trainWidth() {
    const rect_ubahn = ubahnContainer.getBoundingClientRect();
    width_train = rect_ubahn.width;
  }

  /////////// Functions for animation ////////////
  ////////////////////////////////////////////////

  function ubahnTrain_enter() {
    ////////////// Setup ///////////////
    ////////////////////////////////////

    console.log("%cPlaying ubahn train enter animation …", logStyle_action_step);

    // Reset video
    ubahnVideo.pause();
    ubahnVideo.currentTime = 0;

    /////// Train enter movement ///////
    ////////////////////////////////////

    gsap.to(ubahnContainer, {
      left: "104.61vh",
      duration: duration_trainMovement,
      ease: "linear",
      onComplete: () => {
        console.log("%cUbahn train has reached station …", logStyle_action_step);

        // Play video (doors opening)
        ubahnVideo.play();
        setTimeout(() => ubahnVideo.pause(), 1500);

        // Wait, then play video (doors closing)
        setTimeout(() => ubahnVideo.play(), (duration_trainWaiting - 3) * 1000);

        // Wait, then play leave animation
        setTimeout(() => ubahnTrain_leave(), duration_trainWaiting * 1000);
      },
    });
  }

  function ubahnTrain_leave() {
    /////// Train leave movement ///////
    ////////////////////////////////////

    console.log("%cPlaying ubahn train leave animation …", logStyle_action_step);

    gsap.to(ubahnContainer, {
      left: width_train * -1 + "px",
      duration: duration_trainMovement,
      ease: "linear",
      onComplete: () => {
        console.log("%cUbahn train has left scene –", logStyle_action_step);
        console.log("%cUbahn train animation cycle complete ✓", logStyle_action_end);

        // Reset position for next enter animation
        gsap.set(ubahnContainer, { left: "100%" });

        // Wait, then play enter animation
        setTimeout(() => {
          console.log("%cRestarting ubahn train animation cycle …", logStyle_action_start);
          ubahnTrain_enter();
        }, duration_trainOffscreen * 1000);
      },
    });
  }

  //////////////////////// Train animation cycle /////////////////////////
  ////////////////////////////////////////////////////////////////////////

  // Run setup functions (with delay to ensure elements are loaded)
  setTimeout(() => update_trainWidth(), 1000);

  // Initialize train animation cycle
  setTimeout(() => {
    console.log("%cStarting ubahn train animation cycle …", logStyle_action_start);
    ubahnTrain_enter();
  }, 1500);

  ////////////////////////////// Spray can ///////////////////////////////
  ////////////////////////////////////////////////////////////////////////

  //////////// Variables for spraying ////////////
  ////////////////////////////////////////////////

  const gameWorldContainer = document.getElementById("game-world-scroll-container");
  const sprayCan = document.getElementById("ubahn-spray-can");
  const sprayCanvas = document.getElementById("ubahn-train-spray-canvas");
  const sprayCtx = sprayCanvas.getContext("2d");

  // Spray config. //
  let sprayModeActive = false;
  let isSpraying = false;
  let sprayStartTime = 0;
  let pressure = 0; // 0 ~ 1
  const sprayRadius = 8; // 喷漆范围
  let sprayColor = "255,255,255"; // 默认白色

  // Mouse position on canvas
  let mouseX = 10;
  let mouseY = 10;

  //////////// Functions for spraying ////////////
  ////////////////////////////////////////////////

  // Setup canvas dimensions to match display size
  function setupCanvas() {
    const rect = sprayCanvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Set the actual canvas size in memory (scaled by device pixel ratio)
    sprayCanvas.width = rect.width * dpr;
    sprayCanvas.height = rect.height * dpr;

    // Scale the drawing context back down
    sprayCtx.scale(dpr, dpr);

    // Set the CSS size to maintain the original display size
    sprayCanvas.style.width = rect.width + "px";
    sprayCanvas.style.height = rect.height + "px";

    console.log(`%cCanvas setup complete – width: ${sprayCanvas.width}px, height: ${sprayCanvas.height}px ✓`, logStyle_setupComplete);
  }

  setTimeout(() => setupCanvas(), 1500);

  function sprayCan_followMouse(event) {
    // Update spray can position
    const scrollX = parseInt(gameWorldContainer.getAttribute("data-scroll-x") || "0");
    const sprayCanWidth = sprayCan.offsetWidth;
    const mouseX = event.clientX + scrollX - sprayCanWidth / 2;
    const mouseY = event.clientY;
    gsap.set(sprayCan, { left: mouseX + "px", top: mouseY + "px" });
  }

  function spray() {
    if (!sprayModeActive || !isSpraying) return;

    //////// Setup /////////
    ////////////////////////

    const now = performance.now();
    const sprayDuration = now - sprayStartTime;
    const basePressure = 0.25; // 👈 初始压力
    pressure = Math.min(basePressure + sprayDuration / 2500, 1);

    // 🎛️ 用压力控制参数
    const dynamicAlpha = 0.2 + pressure * 0.5; // 透明度
    const dynamicParticles = 30 + pressure * 15; // 颗粒数
    const dynamicRadius = sprayRadius + pressure * 3; // 扩散范围

    sprayCtx.fillStyle = `rgba(${sprayColor}, ${dynamicAlpha})`;

    /// Spray particles ////
    ////////////////////////

    for (let i = 0; i < dynamicParticles; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * dynamicRadius;
      const x = mouseX + Math.cos(angle) * radius;
      const y = mouseY + Math.sin(angle) * radius;
      sprayCtx.beginPath();
      sprayCtx.arc(x, y, Math.random() * (1.5 + pressure * 2), 0, Math.PI * 2);
      sprayCtx.fill();
    }
  }

  // Start spraying canvas animation loop
  function animate() {
    spray();
    requestAnimationFrame(animate);
  }
  animate();

  ///////////////// Color picker /////////////////
  ////////////////////////////////////////////////

  const colorPicker = document.getElementById("color-picker");
  const colorFields = colorPicker.querySelectorAll(".color-picker-color-field");
  const colorPickerStopBtn = document.getElementById("color-picker-stop-btn");

  // Set color on color field click
  colorFields.forEach((el) => {
    el.addEventListener("click", () => {
      // 更新喷漆颜色
      sprayColor = el.dataset.color;

      // 清除其他按钮选中状态
      colorFields.forEach((field) => field.classList.remove("selected"));

      // 给当前点击的按钮加上选中状态
      el.classList.add("selected");
    });
  });

  // Stop spray mode on stop button click
  colorPickerStopBtn.addEventListener("click", () => {
    console.log("%cStopping spray mode …", logStyle_action_start);

    // Hide color picker
    colorPicker.classList.add("hidden");

    // Remove class from game world container to show native cursor
    gameWorldContainer.classList.remove("no-cursor");

    // Disable spray can following mouse
    document.removeEventListener("mousemove", sprayCan_followMouse);

    // Enable further clicks on spray can
    sprayCan.style.pointerEvents = "auto";

    // Deactivate spray mode
    sprayModeActive = false;

    // Move spray can back to original position
    gsap.to(sprayCan, {
      left: "150vh",
      bottom: "5vh",
      top: "auto",
      duration: 0.5,
      ease: "power2.out",
    });
  });

  //////////// Spray can interactions ////////////
  ////////////////////////////////////////////////

  // Make spray can follow mouse once clicked
  sprayCan.addEventListener("click", () => {
    console.log("%cSpray can clicked – now following mouse ✓", logStyle_action_start);

    // Disable further clicks + activate spray mode
    sprayCan.style.pointerEvents = "none";
    sprayModeActive = true;

    // Show color picker
    colorPicker.classList.remove("hidden");

    // Add class to game world container to hide native cursor
    gameWorldContainer.classList.add("no-cursor");

    // Enable spray can to follow mouse
    document.addEventListener("mousemove", sprayCan_followMouse);
  });

  // Track mouse position on canvas
  sprayCanvas.addEventListener("mousemove", (e) => {
    const rect = sprayCanvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  // Spray on canvas when mouse is pressed
  sprayCanvas.addEventListener("mousedown", () => {
    if (!sprayModeActive) return;
    isSpraying = true;
  });

  // Stop spraying when mouse is released
  document.addEventListener("mouseup", () => {
    if (!sprayModeActive) return;
    isSpraying = false;
  });

  ////////////// Saving of drawing ///////////////
  ////////////////////////////////////////////////

  const colorPickerSaveDrawingBtn = document.getElementById("color-picker-save-drawing-btn");

  // Function for saving ubahn illustration to Kirby backend
  function saveUbahnDrawing() {
    // Setup //
    const now = new Date();

    // Disable save button to prevent multiple clicks
    colorPickerSaveDrawingBtn.style.opacity = "0.5";
    colorPickerSaveDrawingBtn.style.pointerEvents = "none"; // Prevent multiple clicks

    // Create img. data
    const dataURL = sprayCanvas.toDataURL("image/png");
    const base64Image = dataURL.replace(/^data:image\/png;base64,/, "");

    // Create body for POST request to backend
    const requestBody = {
      image: base64Image,
      canvas_data: dataURL,
      from: Cookies.get("characterId"),
      timestamp: now.toISOString(),
    };

    // Send POST request to Kirby backend
    fetch("api.ubahn-illus.save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    })
      .then((resp) => {
        if (!resp.ok) throw new Error("Network response was not ok");

        // Re-enable save button
        colorPickerSaveDrawingBtn.style.opacity = "1";
        colorPickerSaveDrawingBtn.style.pointerEvents = "auto";

        return resp.json();
      })
      .then((data) => {
        console.log("Ubahn illu saved successfully:", data);

        // Re-enable save button
        colorPickerSaveDrawingBtn.style.opacity = "1";
        colorPickerSaveDrawingBtn.style.pointerEvents = "auto";
      })
      .catch((error) => {
        console.error("Error saving ubahn illu:", error);
      });
  }

  colorPickerSaveDrawingBtn.addEventListener("click", () => {
    console.log("%cSaving ubahn drawing …", logStyle_action_start);
    saveUbahnDrawing();
  });

  //////// Loading of last saved drawing /////////
  ////////////////////////////////////////////////

  // Load canvas data on page load
  function loadUbahnDrawing() {
    console.log("%cLoading last saved ubahn drawing …", logStyle_action_start);

    fetch("api.ubahn-illus.get")
      .then((response) => response.json())
      .then((data) => {
        console.log("Ubahn illu data received:", data);
        const canvas_data = data.canvas_data;
        const img = new Image();
        img.onload = function () {
          // Clear existing canvas
          sprayCtx.clearRect(0, 0, sprayCanvas.width, sprayCanvas.height);

          // Draw loaded image onto canvas
          sprayCtx.drawImage(img, 0, 0, sprayCanvas.width / (window.devicePixelRatio || 1), sprayCanvas.height / (window.devicePixelRatio || 1));
          console.log("%cUbahn drawing loaded onto canvas ✓", logStyle_setupComplete);
        };
        img.src = canvas_data;
      });
  }

  setTimeout(() => loadUbahnDrawing(), 2000);

  console.log("%cubahn-train.js setup complete ✓", logStyle_setupComplete);
}
