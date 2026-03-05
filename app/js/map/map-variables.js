////////////// Variables: Sounds ///////////////
////////////////////////////////////////////////

const walkingSound = document.getElementById("walkingSound");

///////////// Variables: Character /////////////
////////////////////////////////////////////////

const el_character = document.getElementById("character");
let currentPosition = "apartments"; // Initial position

/////////// Variables: Motion paths ////////////
////////////////////////////////////////////////

const id_path_ubahn = "motionPath_ubahnToApartments";
const path_ubahnToApartments = document.getElementById(id_path_ubahn);

/////// Variables: Map elements/outlines ///////
////////////////////////////////////////////////

const outline_apartments = document.getElementById("outline-apartments");
const outline_door_apartments = document.getElementById("outline-door-apartments");
const outline_ubahn = document.getElementById("outline-ubahn");
