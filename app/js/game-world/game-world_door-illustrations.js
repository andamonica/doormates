console.log("game-world_door-illustrations.js loaded");

/////////////////// Load existing door illustrations ///////////////////
////////////////////////////////////////////////////////////////////////

try {
  const localDataStr = localStorage.getItem("doorIllus");
  if (localDataStr) {
    const data = JSON.parse(localDataStr);
    const doorIllus = data.doorIllus || [];
    const doors = document.querySelectorAll(".door-container");
    doorIllus.forEach((illu) => {
      const doorId = illu.id_door;
      const door = Array.from(doors).find((d) => d.dataset.id === doorId);
      if (door) {
        const wrapper = document.createElement("div");
        wrapper.className = "thumbnail-wrapper";
        wrapper.style.left = `${illu.x}px`;
        wrapper.style.top = `${illu.y}px`;
        const img = new Image();
        img.className = "thumbnail";
        img.src = illu.url;
        wrapper.appendChild(img);
        door.appendChild(wrapper);
      }
    });
  } else {
    console.log("No existing door illustrations locally.");
  }
} catch (error) {
  console.error("Error loading door illustrations from local storage:", error);
}

////////////////////////// Setup for drawing ///////////////////////////
////////////////////////////////////////////////////////////////////////

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const history = []; // 存储历史绘图状态

const colorPicker = document.getElementById("colorPicker");
const thicknessSlider = document.getElementById("thickness");

let painting = false;

//////////////// Event handlers for canvas interactions ////////////////
////////////////////////////////////////////////////////////////////////

canvas.addEventListener("mousedown", () => {
  console.log("mousedown");
  painting = true;
  saveState(); // 每次开始画时记录当前状态
});
canvas.addEventListener("mouseup", () => {
  painting = false;
  ctx.beginPath(); // 结束路径，防止多余连接
});

canvas.addEventListener("mouseleave", () => {
  painting = false;
  ctx.beginPath();
});
canvas.addEventListener("mousemove", draw);

/////////////////////////// Drawing function ///////////////////////////
////////////////////////////////////////////////////////////////////////

function draw(e) {
  if (!painting) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ctx.lineWidth = thicknessSlider.value;
  ctx.lineCap = "round";
  ctx.strokeStyle = colorPicker.value;

  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}

///////////////////////// Undo/Clear function //////////////////////////
////////////////////////////////////////////////////////////////////////

function saveState() {
  // 保存当前 canvas 图像数据 URL
  if (history.length >= 20) history.shift(); // 最多保存 20 步，避免占用太多内存
  history.push(canvas.toDataURL());
}

function undo() {
  if (history.length === 0) return;

  const imgData = history.pop(); // 移除最近状态
  const img = new Image();
  img.src = imgData;
  img.onload = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清空画布
    ctx.drawImage(img, 0, 0); // 绘制恢复图像
  };
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  history.length = 0; // 清空历史
}

//////////////////////// Save-drawing function /////////////////////////
////////////////////////////////////////////////////////////////////////

let drawCount = 0;
let currentActiveDoor = null; // 追踪当前激活的门

function saveDrawing() {
  if (!currentActiveDoor) {
    alert("Please walk to the door and save your answers!");
    return;
  }

  // 获取当前激活门的容器
  const container = currentActiveDoor.parentElement;
  if (!container) return;

  const size = 100;
  const wrapper = document.createElement("div");
  wrapper.className = "thumbnail-wrapper";

  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  // 定义禁止粘贴区域2
  const excludeX1 = 83;
  const excludeY1 = 62;
  const excludeWidth1 = 140;
  const excludeHeight1 = 110;
  // 定义禁止粘贴区域2
  const excludeX2 = 0;
  const excludeY2 = containerHeight - 153; // bottom: 0px → y轴上是靠近底部
  const excludeWidth2 = 300;
  const excludeHeight2 = 153;

  // 循环直到找到一个不在任意排除区域内的位置
  let x, y;
  do {
    x = Math.random() * (containerWidth - size);
    y = Math.random() * (containerHeight - size);
  } while (
    // 判断与区域1冲突
    (x + size > excludeX1 &&
      x < excludeX1 + excludeWidth1 &&
      y + size > excludeY1 &&
      y < excludeY1 + excludeHeight1) ||
    // 判断与区域2冲突
    (x + size > excludeX2 &&
      x < excludeX2 + excludeWidth2 &&
      y + size > excludeY2 &&
      y < excludeY2 + excludeHeight2)
  );

  // 设置位置
  wrapper.style.left = `${x}px`;
  wrapper.style.top = `${y}px`;

  const img = new Image();
  img.src = canvas.toDataURL("image/png");
  img.className = "thumbnail";

  const timestamp = document.createElement("div");
  timestamp.className = "timestamp";
  const now = new Date();
  timestamp.textContent = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(
    now.getHours()
  ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(
    now.getSeconds()
  ).padStart(2, "0")}`;

  wrapper.appendChild(img);
  wrapper.appendChild(timestamp);
  container.appendChild(wrapper);

  /// Save door illustration to Kirby backend ////
  ////////////////////////////////////////////////

  // Create img. data
  const dataURL = canvas.toDataURL("image/png");
  const base64Image = dataURL.replace(/^data:image\/png;base64,/, "");

  // Create body for POST request to backend
  const requestBody = {
    image: base64Image,
    id_door: container.dataset.id,
    from: Cookies.get("characterId"),
    x: x,
    y: y,
    timestamp: now.toISOString(),
  };

  try {
    const localDataStr = localStorage.getItem("doorIllus");
    let storedData = localDataStr ? JSON.parse(localDataStr) : { doorIllus: [] };

    // Add the new illustration replacing url key
    storedData.doorIllus.push({
      id_door: requestBody.id_door,
      from: requestBody.from,
      x: requestBody.x,
      y: requestBody.y,
      timestamp: requestBody.timestamp,
      url: "data:image/png;base64," + requestBody.image
    });

    localStorage.setItem("doorIllus", JSON.stringify(storedData));
    console.log("Door illu saved successfully to localStorage.");
  } catch (error) {
    console.error("Error saving door illu locally:", error);
  }

  ///////////////// Clear canvas /////////////////
  ////////////////////////////////////////////////

  drawCount++;
  clearCanvas();
}
