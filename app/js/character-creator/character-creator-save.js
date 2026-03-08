console.log("%ccharacter-creator-save.js loaded ✓", logStyle_loaded);

/**
 * Save character to backend
 * @param {fabric.Canvas} canvas - The fabric canvas containing the character
 * @param {string} characterName - The name of the character
 * @returns {Promise} - Promise that resolves on success or rejects on error
 */

function saveCharacter(canvas, characterName) {
  return new Promise((resolve, reject) => {
    //////////////////// Setup /////////////////////
    ////////////////////////////////////////////////

    console.log("Saving character:", characterName);

    // Stop, if no name provided
    if (!characterName || characterName.trim() === "") {
      reject(new Error("Character name is required"));
      return;
    }

    //////////// Prepare character img. ////////////
    ////////////////////////////////////////////////

    /////// Crop away whitespace ///////
    ////////////////////////////////////

    // Get bounding box of all objects to crop whitespace
    const objects = canvas.getObjects();
    if (objects.length === 0) {
      reject(new Error("No objects on canvas to save"));
      return;
    }

    // Calculate bounding rectangle of all objects
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    objects.forEach((obj) => {
      const bound = obj.getBoundingRect();
      minX = Math.min(minX, bound.left);
      minY = Math.min(minY, bound.top);
      maxX = Math.max(maxX, bound.left + bound.width);
      maxY = Math.max(maxY, bound.top + bound.height);
    });

    // Add small padding around the content
    const padding = 20;
    const cropArea = {
      left: Math.max(0, minX - padding),
      top: Math.max(0, minY - padding),
      width: Math.min(canvas.width - minX + padding, maxX - minX + padding * 2),
      height: Math.min(canvas.height - minY + padding, maxY - minY + padding * 2),
    };

    // // Convert canvas to img (data URL)
    // const dataURL = canvas.toDataURL({ format: "png", multiplier: 2 });
    // Convert canvas to img with cropping
    const dataURL = canvas.toDataURL({
      format: "png",
      multiplier: 2,
      left: cropArea.left,
      top: cropArea.top,
      width: cropArea.width,
      height: cropArea.height,
    });

    // Remove the "data:image/png;base64," prefix (not needed for backend)
    const base64Image = dataURL.replace(/^data:image\/png;base64,/, "");

    ///// Request to backend to save character /////
    ////////////////////////////////////////////////

    // Create body for POST request to backend
    const requestBody = {
      image: base64Image,
      name: characterName,
      timestamp: new Date().toISOString(),
    };



    // Send POST request to Kirby backend
    fetch("api.character.create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    })
      .then(async (resp) => {
        if (!resp.ok) {
          // Parse error response to get specific error message
          const errorData = await resp.json();
          throw new Error(errorData.error || "Network response was not ok");
        }
        return resp.json();
      })
      .then((data) => {
        console.log("Character saved successfully:", data);
        Cookies.set("characterId", data.characterId); // Save character id in cookie
        resolve(data);
      })
      .catch((err) => {
        console.error("Error saving character:", err);

        // Handle specific error cases
        if (err.message === "Character with this name already exists") {
          alert("A character with this name already exists. Please choose a different name.");
        } else {
          alert("Error saving character: " + err.message);
        }

        reject(err);
      });
  });
}
