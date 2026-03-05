/////////////////// Interaction with location links ////////////////////
////////////////////////////////////////////////////////////////////////

//////////////////// Setup /////////////////////
////////////////////////////////////////////////

// const id_path_ubahn = "motionPath_ubahnToApartments";
// const path_ubahnToApartments = document.getElementById(id_path_ubahn);

// Function for moving character to location and then navigating to page
function handle_locationLinkClick(targetLocation, targetUrl, direction) {
  if (currentPosition !== targetLocation) {
    console.log(`Going to ${targetLocation} from ${currentPosition}`);
    move_char_alongPath(el_character, path_ubahnToApartments, direction);
    currentPosition = targetLocation;
    setTimeout(() => goToPage(targetUrl), 1200);
  } else {
    goToPage(targetUrl);
  }
}

//////////// Enter-apartments link /////////////
////////////////////////////////////////////////

// const outline_door_apartments = document.getElementById(
//   "outline-door-apartments"
// );
if (outline_door_apartments) {
  outline_door_apartments.addEventListener("click", () => {
    handle_locationLinkClick("apartments", "/game-world/index.html", "forward");
  });
}

////////////// Enter-U-Bahn link ///////////////
////////////////////////////////////////////////

// const outline_ubahn = document.getElementById("outline-ubahn");
if (outline_ubahn) {
  outline_ubahn.addEventListener("click", () => {
    handle_locationLinkClick("ubahn", "/game-world-ubahn", "backward");
  });
}
