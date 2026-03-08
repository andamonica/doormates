// Helper function to navigate to a different page

function goToPage(url) {
  window.location.href = url;
}

// Helper function to get player character by getting the characterId
// from cookies to search for character data in backend

function get_playerCharacter(idOverride) {
  ///////// Get character ID from cookie /////////
  ////////////////////////////////////////////////

  const characterId = idOverride || Cookies.get("characterId");
  console.log("Character ID from cookie:", characterId);



  //// Request character data via backend API ////
  ////////////////////////////////////////////////

  fetch("api.character.get", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ characterId: characterId }),
  })
    .then((response) => {
      if (!response.ok) {
        console.error("Failed to fetch character data, redirecting to start page");
        goToPage("/");
        return;
      }
      return response.json();
    })
    .then((data) => {
      console.log("Character data:", data);
      const characterImg = document.querySelector("#character img");
      if (characterImg) {
        characterImg.src = data.characterImgUrl || "default-character.png";
      } else {
        console.error("Character image element not found, redirecting to start page");
        goToPage("/");
      }
    })
    .catch((error) => {
      console.error("Error fetching character data:", error, "redirecting to start page");
      // goToPage("/"); // Disabled to prevent loops during debugging
    });
}
