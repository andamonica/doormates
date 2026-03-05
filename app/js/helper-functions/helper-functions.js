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

  // LOCAL STUB: If running on localhost, use localStorage and mock data
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    console.log("%c[Local Stub] Fetching character data locally...", "color: #2ecc71; font-weight: bold;");
    
    setTimeout(() => {
      const localImg = localStorage.getItem("localCharacterImg");
      const mockData = {
        characterId: characterId || "local-guest",
        characterImgUrl: localImg || "/app/assets/images/doormates/7.png", // Use local fallback
        name: "Local Player"
      };
      
      console.log("Local character data:", mockData);

      const characterImg = document.querySelector("#character img");
      if (characterImg) {
        characterImg.src = mockData.characterImgUrl;
      } else {
        console.error("Character image element not found on this page.");
      }
    }, 100);
    return;
  }

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
