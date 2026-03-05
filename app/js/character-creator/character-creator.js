console.log("%ccharacter-creator.js loaded ✓", logStyle_loaded);
console.log("%cchecking fabric version: " + fabric.version, logStyle_loaded);

///////////////////////////////// Monkey patch: undo function //////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

fabric.Canvas.prototype.historyInit = function () {
  this.historyUndo = [];
  this.historyNextState = this.historyNext();

  this.on({
    "object:added": this.historySaveAction,
    "object:removed": this.historySaveAction,
    "object:modified": this.historySaveAction,
  });
};

fabric.Canvas.prototype.historyNext = function () {
  return JSON.stringify(this.toDatalessJSON(this.extraProps));
};

fabric.Canvas.prototype.historySaveAction = function () {
  if (this.historyProcessing) return;
  const json = this.historyNextState;
  this.historyUndo.push(json);
  this.historyNextState = this.historyNext();
};

fabric.Canvas.prototype.undo = function () {
  // The undo process will render the new states of the objects
  // Therefore, object:added and object:modified events will triggered again
  // To ignore those events, we are setting a flag.
  this.historyProcessing = true;

  const history = this.historyUndo.pop();
  if (history) {
    this.loadFromJSON(history)
      .then(() => {
        this.renderAll();
        this.historyProcessing = false;
      })
      .catch((error) => {
        console.error("Error loading from JSON:", error);
        this.historyProcessing = false;
      });
  } else {
    this.historyProcessing = false;
  }
};

/////////////////////////////////////// Fabric.js setup ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

// We are using Fabric.js to manage create a canvas on which the selected character features
// will be displayed and manipulated.

const characterViewer = document.getElementById("characterViewer");
const characterCanvasContainer = document.getElementById("characterCanvasContainer");
const characterCanvas = document.getElementById("characterCanvas");

const canvas = new fabric.Canvas(characterCanvas, {
  width: characterCanvasContainer.clientWidth,
  height: characterCanvasContainer.clientHeight,
});

canvas.historyInit();

// Interaction with character save button (for testing)
const btn_saveCharacter = document.getElementById("saveBtn");
if (btn_saveCharacter) {
  btn_saveCharacter.addEventListener("click", () => {
    console.log("Save button clicked");

    // Get character name from input
    const characterNameInput = document.getElementById("characterNameInput");
    const characterName = characterNameInput.value;

    // Save character to backend
    saveCharacter(canvas, characterName)
      .then(() => goToPage("/map"))
      .catch((error) => console.log("Save failed:", error.message));
  });
}

// Interaction with object flip button
const btn_flipObject = document.getElementById("flipBtn");
if (btn_flipObject) {
  btn_flipObject.addEventListener("click", () => {
    console.log("Flip button clicked");

    // Get the active object on the canvas
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      // Flip the object horizontally
      activeObject.set("flipX", !activeObject.flipX);
      // Render the canvas to reflect the changes
      canvas.renderAll();
    } else {
      console.log("No active object to flip");
    }
  });
}

// Event handler for deleting selected objects from Farbic canvas //
document.addEventListener("keydown", function (e) {
  if (e.key === "Delete" || e.key === "Backspace") {
    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length) {
      activeObjects.forEach(function (obj) {
        canvas.remove(obj);
      });
      canvas.discardActiveObject();
      canvas.renderAll();
    }
  }
});

const btn_undoObject = document.getElementById("undoBtn");
if (btn_undoObject) {
  btn_undoObject.addEventListener("click", () => canvas.undo());
}

//////////////////////////////////// Feature selection menu ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

const hairAudioList = [
  "app/assets/audio/hair1.mp3",
  "app/assets/audio/hair2.mp3",
  "app/assets/audio/hair3.m4a",
  "app/assets/audio/hair4.m4a",
  "app/assets/audio/hair5.m4a",
  "app/assets/audio/hair6.m4a",
  "app/assets/audio/hair7.m4a",
  "app/assets/audio/hair8.m4a",
];

const shoeAudioList = ["app/assets/audio/ohh1.m4a", "app/assets/audio/oof.mp3", "app/assets/audio/testing_boundaries.mp3", "app/assets/audio/pigeons.mp3"];

const topAudioList = ["app/assets/audio/grass1.mp3", "app/assets/audio/hello.mp3"];

const selectionMenu = document.getElementById("featureSelectionMenu");
const optionsViewer = document.getElementById("featureOptionsViewer");

// Get button elements
const btn_hair = selectionMenu?.querySelector("#btn_hair");
const btn_face = selectionMenu?.querySelector("#btn_face");
const btn_top = selectionMenu?.querySelector("#btn_top");
const btn_nose = selectionMenu?.querySelector("#btn_nose");
const btn_eyes = selectionMenu?.querySelector("#btn_eyes");
const btn_mouse = selectionMenu?.querySelector("#btn_mouse");
const btn_accessory = selectionMenu?.querySelector("#btn_accessory");
const btn_shoes = selectionMenu?.querySelector("#btn_shoes");
const btn_legs = selectionMenu?.querySelector("#btn_legs");

// Get feaeture option groups
const optionsGroup_hair = optionsViewer?.querySelector("#optionsGroup_hair");
const optionsGroup_face = optionsViewer?.querySelector("#optionsGroup_face");
const optionsGroup_top = optionsViewer?.querySelector("#optionsGroup_top");
const optionsGroup_nose = optionsViewer?.querySelector("#optionsGroup_nose");
const optionsGroup_eyes = optionsViewer?.querySelector("#optionsGroup_eyes");
const optionsGroup_mouse = optionsViewer?.querySelector("#optionsGroup_mouse");
const optionsGroup_accessory = optionsViewer?.querySelector("#optionsGroup_accessory");
const optionsGroup_shoes = optionsViewer?.querySelector("#optionsGroup_shoes");
const optionsGroup_legs = optionsViewer?.querySelector("#optionsGroup_legs");

////////// Interactions with feature group selection buttons ///////////
////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////
// 保存当前播放中的 Audio 实例
let currentCategory = null; // 当前选中的部位：例如 'shoes'、'top' 等
let currentAudio = null;

// 当有图片添加进 canvas
canvas.on("object:added", function (e) {
  // 如果有正在播放的语音，先暂停它
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }

  let audioList = [];

  switch (currentCategory) {
    case "shoes":
      audioList = shoeAudioList;
      break;
    case "top":
      audioList = topAudioList;
      break;
    case "hair":
      audioList = hairAudioList;
      break;
    // 可以添加更多 case 例如 'face'、'hair'...
    default:
      return; // 没有选中分类就不播放
  }

  if (audioList.length > 0) {
    const randomIndex = Math.floor(Math.random() * audioList.length);
    const audio = new Audio(audioList[randomIndex]);
    audio.play().catch((err) => console.warn("Audio playback failed:", err));
    currentAudio = audio;
  }
});

////////////////////////////////////////////////////////////////

if (btn_hair) {
  btn_hair.addEventListener("click", () => {
    currentCategory = "hair";
    console.log("Hair button clicked");

    // Toggle visibility of hair options
    optionsGroup_hair.classList.toggle("hidden");
    optionsGroup_face?.classList.add("hidden");
    optionsGroup_top?.classList.add("hidden");
    optionsGroup_nose?.classList.add("hidden");
    optionsGroup_eyes?.classList.add("hidden");
    optionsGroup_mouse?.classList.add("hidden");
    optionsGroup_accessory?.classList.add("hidden");
    optionsGroup_shoes?.classList.add("hidden");
    optionsGroup_legs?.classList.add("hidden");

    // Toggle active state of buttons
    btn_hair.classList.toggle("active");
    btn_face?.classList.remove("active");
    btn_top?.classList.remove("active");
    btn_nose?.classList.remove("active");
    btn_eyes?.classList.remove("active");
    btn_mouse?.classList.remove("active");
    btn_accessory?.classList.remove("active");
    btn_shoes?.classList.remove("active");
    btn_legs?.classList.remove("active");
  });
}

if (btn_face) {
  btn_face.addEventListener("click", () => {
    currentCategory = null;
    console.log("Face button clicked");

    // Toggle visibility of face options
    optionsGroup_face.classList.toggle("hidden");
    optionsGroup_hair?.classList.add("hidden");
    optionsGroup_top?.classList.add("hidden");
    optionsGroup_nose?.classList.add("hidden");
    optionsGroup_eyes?.classList.add("hidden");
    optionsGroup_mouse?.classList.add("hidden");
    optionsGroup_accessory?.classList.add("hidden");
    optionsGroup_shoes?.classList.add("hidden");
    optionsGroup_legs?.classList.add("hidden");

    // Toggle active state of buttons
    btn_face.classList.toggle("active");
    btn_hair?.classList.remove("active");
    btn_top?.classList.remove("active");
    btn_nose?.classList.remove("active");
    btn_eyes?.classList.remove("active");
    btn_mouse?.classList.remove("active");
    btn_accessory?.classList.remove("active");
    btn_shoes?.classList.remove("active");
    btn_legs?.classList.remove("active");
  });
}

if (btn_nose) {
  btn_nose.addEventListener("click", () => {
    currentCategory = null;
    console.log("Nose button clicked");

    // Toggle visibility of face options
    optionsGroup_nose.classList.toggle("hidden");
    optionsGroup_hair?.classList.add("hidden");
    optionsGroup_top?.classList.add("hidden");
    optionsGroup_face?.classList.add("hidden");
    optionsGroup_eyes?.classList.add("hidden");
    optionsGroup_mouse?.classList.add("hidden");
    optionsGroup_accessory?.classList.add("hidden");
    optionsGroup_shoes?.classList.add("hidden");
    optionsGroup_legs?.classList.add("hidden");

    // Toggle active state of buttons
    btn_nose.classList.toggle("active");
    btn_hair?.classList.remove("active");
    btn_top?.classList.remove("active");
    btn_face?.classList.remove("active");
    btn_eyes?.classList.remove("active");
    btn_mouse?.classList.remove("active");
    btn_accessory?.classList.remove("active");
    btn_shoes?.classList.remove("active");
    btn_legs?.classList.remove("active");
  });
}

if (btn_eyes) {
  btn_eyes.addEventListener("click", () => {
    currentCategory = null;
    console.log("Eyes button clicked");

    // Toggle visibility of face options
    optionsGroup_eyes.classList.toggle("hidden");
    optionsGroup_hair?.classList.add("hidden");
    optionsGroup_top?.classList.add("hidden");
    optionsGroup_face?.classList.add("hidden");
    optionsGroup_nose?.classList.add("hidden");
    optionsGroup_mouse?.classList.add("hidden");
    optionsGroup_accessory?.classList.add("hidden");
    optionsGroup_shoes?.classList.add("hidden");
    optionsGroup_legs?.classList.add("hidden");

    // Toggle active state of buttons
    btn_eyes.classList.toggle("active");
    btn_hair?.classList.remove("active");
    btn_top?.classList.remove("active");
    btn_face?.classList.remove("active");
    btn_nose?.classList.remove("active");
    btn_mouse?.classList.remove("active");
    btn_accessory?.classList.remove("active");
    btn_shoes?.classList.remove("active");
    btn_legs?.classList.remove("active");
  });
}

if (btn_mouse) {
  btn_mouse.addEventListener("click", () => {
    currentCategory = null;
    console.log("mouse button clicked");

    // Toggle visibility of face options
    optionsGroup_mouse.classList.toggle("hidden");
    optionsGroup_hair?.classList.add("hidden");
    optionsGroup_top?.classList.add("hidden");
    optionsGroup_face?.classList.add("hidden");
    optionsGroup_nose?.classList.add("hidden");
    optionsGroup_eyes?.classList.add("hidden");
    optionsGroup_accessory?.classList.add("hidden");
    optionsGroup_shoes?.classList.add("hidden");
    optionsGroup_legs?.classList.add("hidden");

    // Toggle active state of buttons
    btn_mouse.classList.toggle("active");
    btn_hair?.classList.remove("active");
    btn_top?.classList.remove("active");
    btn_face?.classList.remove("active");
    btn_nose?.classList.remove("active");
    btn_eyes?.classList.remove("active");
    btn_accessory?.classList.remove("active");
    btn_shoes?.classList.remove("active");
    btn_legs?.classList.remove("active");
  });
}

if (btn_top) {
  btn_top.addEventListener("click", () => {
    currentCategory = "top";
    console.log("Top button clicked");

    // Toggle visibility of hair options
    optionsGroup_top.classList.toggle("hidden");
    optionsGroup_face?.classList.add("hidden");
    optionsGroup_hair?.classList.add("hidden");
    optionsGroup_nose?.classList.add("hidden");
    optionsGroup_eyes?.classList.add("hidden");
    optionsGroup_mouse?.classList.add("hidden");
    optionsGroup_accessory?.classList.add("hidden");
    optionsGroup_shoes?.classList.add("hidden");
    optionsGroup_legs?.classList.add("hidden");

    // Toggle active state of buttons
    btn_top.classList.toggle("active");
    btn_face?.classList.remove("active");
    btn_hair?.classList.remove("active");
    btn_nose?.classList.remove("active");
    btn_eyes?.classList.remove("active");
    btn_mouse?.classList.remove("active");
    btn_accessory?.classList.remove("active");
    btn_shoes?.classList.remove("active");
    btn_legs?.classList.remove("active");
  });
}

if (btn_accessory) {
  btn_accessory.addEventListener("click", () => {
    currentCategory = null;
    console.log("accessory button clicked");

    // Toggle visibility of face options
    optionsGroup_accessory.classList.toggle("hidden");
    optionsGroup_hair?.classList.add("hidden");
    optionsGroup_top?.classList.add("hidden");
    optionsGroup_face?.classList.add("hidden");
    optionsGroup_nose?.classList.add("hidden");
    optionsGroup_eyes?.classList.add("hidden");
    optionsGroup_mouse?.classList.add("hidden");
    optionsGroup_shoes?.classList.add("hidden");
    optionsGroup_legs?.classList.add("hidden");

    // Toggle active state of buttons
    btn_accessory.classList.toggle("active");
    btn_hair?.classList.remove("active");
    btn_top?.classList.remove("active");
    btn_face?.classList.remove("active");
    btn_nose?.classList.remove("active");
    btn_eyes?.classList.remove("active");
    btn_mouse?.classList.remove("active");
    btn_shoes?.classList.remove("active");
    btn_legs?.classList.remove("active");
  });
}

if (btn_shoes) {
  btn_shoes.addEventListener("click", () => {
    currentCategory = "shoes";
    console.log("Shoes button clicked");

    // Toggle visibility of hair options
    optionsGroup_shoes.classList.toggle("hidden");
    optionsGroup_face?.classList.add("hidden");
    optionsGroup_top?.classList.add("hidden");
    optionsGroup_nose?.classList.add("hidden");
    optionsGroup_eyes?.classList.add("hidden");
    optionsGroup_mouse?.classList.add("hidden");
    optionsGroup_accessory?.classList.add("hidden");
    optionsGroup_hair?.classList.add("hidden");
    optionsGroup_legs?.classList.add("hidden");

    // Toggle active state of buttons
    btn_shoes.classList.toggle("active");
    btn_face?.classList.remove("active");
    btn_top?.classList.remove("active");
    btn_nose?.classList.remove("active");
    btn_eyes?.classList.remove("active");
    btn_mouse?.classList.remove("active");
    btn_accessory?.classList.remove("active");
    btn_hair?.classList.remove("active");
    btn_legs?.classList.remove("active");
  });
}
if (btn_legs) {
  btn_legs.addEventListener("click", () => {
    currentCategory = null;
    console.log("Legs button clicked");

    // Toggle visibility of face options
    optionsGroup_legs.classList.toggle("hidden");
    optionsGroup_hair?.classList.add("hidden");
    optionsGroup_top?.classList.add("hidden");
    optionsGroup_nose?.classList.add("hidden");
    optionsGroup_eyes?.classList.add("hidden");
    optionsGroup_mouse?.classList.add("hidden");
    optionsGroup_accessory?.classList.add("hidden");
    optionsGroup_shoes?.classList.add("hidden");
    optionsGroup_face?.classList.add("hidden");

    // Toggle active state of buttons
    btn_legs.classList.toggle("active");
    btn_hair?.classList.remove("active");
    btn_top?.classList.remove("active");
    btn_nose?.classList.remove("active");
    btn_eyes?.classList.remove("active");
    btn_mouse?.classList.remove("active");
    btn_accessory?.classList.remove("active");
    btn_shoes?.classList.remove("active");
    btn_face?.classList.remove("active");
  });
}
/////////////////// Interactions with option buttons ///////////////////
////////////////////////////////////////////////////////////////////////

if (optionsGroup_hair) {
  const optionImgs_hair = optionsGroup_hair.querySelectorAll(".option-img");
  optionImgs_hair.forEach((optionImg) => {
    // 点击事件：添加到canvas
    optionImg.addEventListener("click", () => {
      const imgUrl = optionImg.dataset.imgUrl;
      fabric.FabricImage.fromURL(imgUrl, {}, { left: 70, top: 50, scaleX: 0.1, scaleY: 0.1 }).then((img) => canvas.add(img));
    });
  });
}

if (optionsGroup_face) {
  const optionImgs_face = optionsGroup_face.querySelectorAll(".option-img");
  optionImgs_face.forEach((optionImg) => {
    optionImg.addEventListener("click", () => {
      console.log("Face option clicked");
      const imgUrl = optionImg.dataset.imgUrl;
      fabric.FabricImage.fromURL(imgUrl, {}, { left: 70, top: 50, scaleX: 0.1, scaleY: 0.1 }).then((img) => canvas.add(img)); // 触发 canvas:add
    });
  });
}

if (optionsGroup_nose) {
  const optionImgs_nose = optionsGroup_nose.querySelectorAll(".option-img");
  optionImgs_nose.forEach((optionImg) => {
    optionImg.addEventListener("click", () => {
      console.log("Nose option clicked");
      // Update canvas with selected face feature
      const imgUrl = optionImg.dataset.imgUrl;
      fabric.FabricImage.fromURL(imgUrl, {}, { left: 70, top: 50, scaleX: 0.1, scaleY: 0.1 }).then((img) => canvas.add(img));
    });
  });
}

if (optionsGroup_eyes) {
  const optionImgs_eyes = optionsGroup_eyes.querySelectorAll(".option-img");
  optionImgs_eyes.forEach((optionImg) => {
    optionImg.addEventListener("click", () => {
      console.log("Eyes option clicked");
      // Update canvas with selected face feature
      const imgUrl = optionImg.dataset.imgUrl;
      fabric.FabricImage.fromURL(imgUrl, {}, { left: 70, top: 50, scaleX: 0.1, scaleY: 0.1 }).then((img) => canvas.add(img));
    });
  });
}

if (optionsGroup_mouse) {
  const optionImgs_mouse = optionsGroup_mouse.querySelectorAll(".option-img");
  optionImgs_mouse.forEach((optionImg) => {
    optionImg.addEventListener("click", () => {
      console.log("mouse option clicked");
      // Update canvas with selected face feature
      const imgUrl = optionImg.dataset.imgUrl;
      fabric.FabricImage.fromURL(imgUrl, {}, { left: 70, top: 50, scaleX: 0.1, scaleY: 0.1 }).then((img) => canvas.add(img));
    });
  });
}

if (optionsGroup_top) {
  const optionImgs_top = optionsGroup_top.querySelectorAll(".option-img");
  optionImgs_top.forEach((optionImg) => {
    optionImg.addEventListener("click", () => {
      // Update canvas with selected top feature
      const imgUrl = optionImg.dataset.imgUrl;
      fabric.FabricImage.fromURL(imgUrl, {}, { left: 70, top: 50, scaleX: 0.1, scaleY: 0.1 }).then((img) => canvas.add(img));
    });
  });
}

if (optionsGroup_accessory) {
  const optionImgs_accessory = optionsGroup_accessory.querySelectorAll(".option-img");
  optionImgs_accessory.forEach((optionImg) => {
    optionImg.addEventListener("click", () => {
      console.log("accessory option clicked");
      // Update canvas with selected face feature
      const imgUrl = optionImg.dataset.imgUrl;
      fabric.FabricImage.fromURL(imgUrl, {}, { left: 70, top: 50, scaleX: 0.1, scaleY: 0.1 }).then((img) => canvas.add(img));
    });
  });
}

if (optionsGroup_shoes) {
  const optionImgs_shoes = optionsGroup_shoes.querySelectorAll(".option-img");
  optionImgs_shoes.forEach((optionImg) => {
    optionImg.addEventListener("click", () => {
      // Update canvas with selected hair feature
      const imgUrl = optionImg.dataset.imgUrl;
      fabric.FabricImage.fromURL(imgUrl, {}, { left: 70, top: 50, scaleX: 0.1, scaleY: 0.1 }).then((img) => canvas.add(img));
    });
  });
}

if (optionsGroup_legs) {
  const optionImgs_legs = optionsGroup_legs.querySelectorAll(".option-img");
  optionImgs_legs.forEach((optionImg) => {
    optionImg.addEventListener("click", () => {
      // Update canvas with selected hair feature
      const imgUrl = optionImg.dataset.imgUrl;
      fabric.FabricImage.fromURL(imgUrl, {}, { left: 50, top: 50, scaleX: 0.1, scaleY: 0.1 }).then((img) => canvas.add(img));
    });
  });
}

console.log("%ccharacter-creator.js setup complete ✓", logStyle_setupComplete);
