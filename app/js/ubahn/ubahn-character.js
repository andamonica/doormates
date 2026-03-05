console.log("%cubahn-character.js loaded ✓", "color: gold; font-weight: bold;");

// Stop, if character var. is not defined
if (typeof character === "undefined") {
  console.error("Character variable is not defined, cannot load character.");
} else {
  //////////////////////////////// Setup /////////////////////////////////
  ////////////////////////////////////////////////////////////////////////

  const scrollContainer = document.getElementById("game-world-scroll-container");

  ////////////////////////// Character movement //////////////////////////
  ////////////////////////////////////////////////////////////////////////

  //////////////// Movement state ////////////////
  ////////////////////////////////////////////////

  const movementState = {
    step: 50, // pixels to move per keypress
    scrollStep: 50, // pixels to scroll when at edge
    minPosition: 0, // leftmost position
    maxPosition: window.innerWidth * 0.6, // rightmost position
    currentPosition: 0, // current x position
    isJumping: false, // track if character is currently jumping
  };

  ////////////// Movement functions //////////////
  ////////////////////////////////////////////////

  function jumpCharacter() {
    // Setup //
    if (movementState.isJumping || !character) return;
    movementState.isJumping = true;

    // Jump animation using GSAP
    gsap.to(character, {
      y: -100, // Jump height in pixels
      duration: 0.3,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
      onComplete: () => (movementState.isJumping = false),
    });
  }

  function moveCharacter(direction) {
    // Setup //
    if (!character || !scrollContainer) return;
    const { step, scrollStep, minPosition, maxPosition } = movementState;
    let newPosition = movementState.currentPosition;

    // Calculate new position based on direction
    if (direction === "left") {
      newPosition = Math.max(minPosition, movementState.currentPosition - step);

      // Check if character hit the left edge and panel should scroll
      if (newPosition === minPosition && scrollContainer.scrollLeft > 0) {
        scrollContainer.scrollLeft = Math.max(0, scrollContainer.scrollLeft - scrollStep);

        // Updtate data-scroll-x on scrollContainer
        const currentScrollX = scrollContainer.getAttribute("data-scroll-x") || "0";
        const newScrollX = Math.max(0, parseInt(currentScrollX, 10) - scrollStep);
        scrollContainer.setAttribute("data-scroll-x", newScrollX.toString());
      }
    } else if (direction === "right") {
      newPosition = Math.min(maxPosition, movementState.currentPosition + step);

      // Check if character hit the right edge and panel should scroll
      if (newPosition === maxPosition) {
        const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        if (scrollContainer.scrollLeft < maxScroll) {
          scrollContainer.scrollLeft = Math.min(maxScroll, scrollContainer.scrollLeft + scrollStep);

          // Updtate data-scroll-x on scrollContainer
          const currentScrollX = scrollContainer.getAttribute("data-scroll-x") || "0";
          const newScrollX = Math.min(maxScroll, parseInt(currentScrollX, 10) + scrollStep);
          scrollContainer.setAttribute("data-scroll-x", newScrollX.toString());
        }
      }
    }

    // Update character position (only if it has changed)
    if (newPosition !== movementState.currentPosition) {
      movementState.currentPosition = newPosition;
      gsap.set(character, { x: newPosition });
      // console.log(`Character moved ${direction}, position: ${newPosition}`);
    }

    // Flip character sprite based on movement direction
    if (direction === "left") {
      gsap.set(character, { scaleX: -1 }); // Flip to face left
    } else if (direction === "right") {
      gsap.set(character, { scaleX: 1 }); // Face right (normal)
    }
  }

  /////////// Key press event handling ///////////
  ////////////////////////////////////////////////

  // Move character when arrow keys are pressed
  document.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowLeft":
      case "ArrowRight":
        event.preventDefault(); // Suppress native scrolling
        if (event.key === "ArrowLeft") {
          moveCharacter("left");
        } else {
          moveCharacter("right");
        }
        break;

      case "ArrowUp":
        event.preventDefault(); // Suppress native scrolling
        jumpCharacter();
        break;
    }
  });

  console.log("%cubahn-character.js setup complete ✓", "color: green; font-weight: bold;");
}
