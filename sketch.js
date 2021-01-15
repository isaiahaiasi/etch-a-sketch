
const initialGridSize = 16;
let desiredGridSize = initialGridSize;
let getColor = chiaroscuro;
let pixels = [];
let recolorable = true;

const root = document.documentElement;
const etchCtn = document.querySelector(".etch-container");

// INPUTS
// reset
const resetBtn = document.querySelector("#reset-btn");
resetBtn.addEventListener("click", ()=> {
  generateGrid(desiredGridSize);
});

// grid size slider
const resetSliderCtn = document.querySelector(".reset-slider");
resetSliderCtn.querySelector(".slider").addEventListener("change", e => {
  desiredGridSize = e.target.value;
  resetSliderCtn.querySelector("#slider-value").textContent = desiredGridSize;
  generateGrid(desiredGridSize);
});

// draw mode inputs
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
    case "darken":
      drawFunction = chiaroscuro;
      break;
    default:
      console.log(`Draw Mode option button set to invalid value ${btn.value}`, btn);
      return;
  }

  btn.addEventListener("change", () => {
    getColor = drawFunction;
  });
});

// TODO: blend mode inputs



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
    
    pixel.addEventListener("mouseenter", setPixelColor);
    
    pixel.addEventListener("mouseleave", e => {
      if (!recolorable) {
        pixel.removeEventListener("mouseenter", setPixelColor);
      }
    });
    
    etchCtn.appendChild(pixel);
    pixels.push(pixel);
  }
}

function setPixelColor(e) {
  e.target.style.backgroundColor = getColor(e);
}

// Coloring functions
function randomShade() {
  let shade = Math.random() * 100;
  return `hsl(40, 50%, ${shade}%)`;
}

function constantColor() {
  return "rgb(0,0,255)";
}

function totallyRandomColor() {
  let r = Math.random() * 256;
  let g = Math.random() * 256;
  let b = Math.random() * 256;
  return `rgb(${r},${g},${b})`;
}

// The only reason I pass the event to these functions...
// TODO: I will probably have to delete this, because if I have blend modes,
//    then the draw mode should be agnostic of the color beneath it.
function chiaroscuro(e) {
  let color = window.getComputedStyle(e.target, null).getPropertyValue("background-color");
  let rgb = color.match(/([0-9.])+/gi);
  rgb = [(+rgb[0]), (+rgb[1]), (+rgb[2]), (+rgb[3])];
  rgb[3] = isNaN(rgb[3]) ? 1 : rgb[3];
  let rgbSum = rgb[0] + rgb[1] + rgb[2];
  rgbSum = rgbSum > 0 ? rgbSum : 1;
  let overallBrightnessReduction = (255 * 3 / 10) / rgbSum;

  let rgbNew = [];
  for(let i = 0; i < 3; i++) {
    let rgbSubtract = rgb[i] * overallBrightnessReduction;
    rgbNew[i] = rgb[i] - rgbSubtract;
  }

  let newColor = `rgba(${rgbNew[0]},${rgbNew[1]},${rgbNew[2]}, ${rgb[3] + 0.1})`;
  return newColor;
  
}

// MAIN
generateGrid(initialGridSize);
