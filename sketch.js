
const initialGridSize = 16;
let desiredGridSize = initialGridSize;
let getColor = constantColor;
let blendColors = replace;
let pixels = [];
let recolorable = true;

const root = document.documentElement;
const etchCtn = document.querySelector(".etch-container");

// INPUTS
// fill
const fillBtn = document.querySelector("#fill-btn");
fillBtn.addEventListener("click", fill);
// reset
const resetBtn = document.querySelector("#reset-btn");
resetBtn.addEventListener("click", ()=> {
  generateGrid(desiredGridSize);
});

// grid size slider
const resetSliderCtn = document.querySelector(".reset-slider");
resetSliderCtn.querySelector(".slider").addEventListener("change", e => {
  desiredGridSize = e.target.value;
  resetSliderCtn.querySelector(".slider-value").textContent = desiredGridSize;
  generateGrid(desiredGridSize);
});

// DRAW MODE INPUTS
const drawModeOptionsCtn = document.querySelector("#draw-mode-options");
const drawModeButtons = drawModeOptionsCtn.querySelectorAll("input");
drawModeButtons.forEach((btn)=> {
  let drawFunction;
  switch (btn.value) {
    case "selected":
      drawFunction = constantColor;
      break;
    case "random":
      drawFunction = totallyRandomColor;
      break;
    default:
      console.log(`Draw Mode option button set to invalid value ${btn.value}`, btn);
      return;
  }

  btn.addEventListener("change", () => {
    getColor = drawFunction;
  });
});

// BLEND MODE INPUTS
const blendModeOptionsCtn = document.querySelector("#blend-mode-options");
const blendModeButtons = blendModeOptionsCtn.querySelectorAll("input");
blendModeButtons.forEach((btn)=> {
  let blendFunction;
  switch (btn.value) {
    case "replace":
      blendFunction = replace;
      break;
    case "mix":
      blendFunction = mix;
      break;
    case "multiply":
      blendFunction = multiply;
      break;
    default:
      console.log(`Blend Mode option button set to invalid value ${btn.value}`, btn);
      return;
  }

  btn.addEventListener("change", () => {
    blendColors = blendFunction;
  });
});


// RGBA Slider Inputs:
rgbaCustom = [0,0,0,1];
rgbaSliderCtn = document.querySelector(".color-picker-group");
rgbaCustomPreview = rgbaSliderCtn.querySelector(".color-preview");
rgbaSliders = rgbaSliderCtn.querySelectorAll(".rgb-slider");
for(let i = 0; i < rgbaSliders.length; i++) {
  rgbaSliders[i].querySelector(".slider").addEventListener("change", e => {
    let newColorChannelValue = e.target.value;
    rgbaCustom[i] = newColorChannelValue;
    rgbaSliders[i].querySelector(".slider-value").textContent = newColorChannelValue;
    updateColorPreview(rgbaCustomPreview);
  });
}

function updateColorPreview(previewBox) {
  previewBox.style.backgroundColor = 
      `rgba(${rgbaCustom[0]},${rgbaCustom[1]},${rgbaCustom[2]},${rgbaCustom[3]})`;
}

// THE ACTUAL GRID
function generateGrid(size) {
  while (etchCtn.firstChild) {
    etchCtn.removeChild(etchCtn.firstChild);
  }
  pixels = [];
  
  root.style.setProperty("--grid-size", size);
  
  for(let i = 0; i < (size * size); i++) {
    let pixel = document.createElement("div");
    pixel.setAttribute("class","pixel");
    pixel.setAttribute("id",`${i%size}-${Math.floor(i/size)}`);
    
    pixel.addEventListener("mouseenter", e => {setPixelColor(e.target)});
    
    pixel.addEventListener("mouseleave", e => {
      if (!recolorable) {
        pixel.removeEventListener("mouseenter", setPixelColor);
      }
    });
    
    etchCtn.appendChild(pixel);
    pixels.push(pixel);
  }
}

function setPixelColor(pixel) {
  let colorA = pixel.style.backgroundColor; // OLD COLOR
  let colorB = getColor(); // NEW COLOR

  let newColor = blendColors(colorA, colorB);
  pixel.style.backgroundColor = newColor;
}

// GETCOLOR FUNCTIONS
function randomShade() {
  let shade = Math.random() * 100;
  return `hsl(40, 50%, ${shade}%)`;
}

function constantColor() {
  return rgbaCustomPreview.style.backgroundColor;
}

function totallyRandomColor() {
  let r = Math.random() * 256;
  let g = Math.random() * 256;
  let b = Math.random() * 256;
  return `rgb(${r},${g},${b})`;
}

// BLENDCOLOR FUNCTIONS
function replace(colA, colB) { return colB; }

function mix(colA, colB) {
  let colAArray = convertColorStringToArray(colA);
  let colBArray = convertColorStringToArray(colB);
  let colCArray = [];

  // For each color channel, blend between colA & colB by the alpha of colB
  for (let i = 0; i < 3; i++) {
    colCArray[i] = lerp(colAArray[i], colBArray[i], colBArray[3]);
  }

  colCArray[3] = Math.min(colAArray[3] + colBArray[3], 1); //final alpha is additive

  return getColorAsRgbaString(colCArray);
}

function multiply(colA, colB) {
  let colA_Arr = convertColorStringToArray(colA);
  let colB_Arr = convertColorStringToArray(colB);
  let colC_Arr = [];

  // For each color channel, multiply colA & colB then divide by 255
  for (let i = 0; i < 3; i++) {
    let c = colA_Arr[i] * colB_Arr[i] / 255; // Full effect of multiply
    colC_Arr[i] = lerp(colA_Arr[i], c, colB_Arr[3]); // Power of effect = alpha of new col
  }

  colC_Arr[3] = Math.min(colA_Arr[3] + colB_Arr[3], 1);

  return getColorAsRgbaString(colC_Arr);
}

// COLOR HELPERS
function convertColorStringToArray(col) {
  // It seems as if, if all values are zero, the property returns an empty string
  if (col === "") {
    return [0,0,0,0];
  }

  let rgba = col.match(/([0-9.])+/gi);
  rgba = [(+rgba[0]), (+rgba[1]), (+rgba[2]), (+rgba[3])];
  rgba[3] = isNaN(rgba[3]) ? 1 : rgba[3];
  return rgba;
}

//takes an array of colors [r, g, b] or [r, g, b, a]
function getColorAsRgbaString(rgba) {
  rgba[3] = isNaN(rgba[3]) ? 1 : rgba[3];
  return `rgba(${rgba[0]},${rgba[1]},${rgba[2]},${rgba[3]})`;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function fill() {
  const col = constantColor();
  pixels.forEach(pixel => {
    pixel.style.backgroundColor = col;
  });
}

// MAIN
generateGrid(initialGridSize);
updateColorPreview(rgbaCustomPreview);
