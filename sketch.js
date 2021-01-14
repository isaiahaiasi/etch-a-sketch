
const root = document.documentElement;
const etchContainer = document.querySelector(".etch-container");
const gridResetBtn = document.querySelector("#grid-reset-btn");

const initialGridSize = 60;


let pixels = [];
let recolorable = true;
let getColor = chiaroscuro;

function setPixelColor(e) {
  e.target.style.backgroundColor = getColor(e);
}

function generateGrid(size) {
  while (etchContainer.firstChild) {
    etchContainer.removeChild(etchContainer.firstChild);
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

    etchContainer.appendChild(pixel);
    pixels.push(pixel);
  }
}

// Coloring functions
function randomShade() {
  let shade = Math.random() * 100;
  return `hsl(40, 50%, ${shade}%)`;
}

function constantColor() {
  return "blue";
}

function totallyRandomColor() {
  let r = Math.random() * 256;
  let g = Math.random() * 256;
  let b = Math.random() * 256;
  return `rgb(${r},${g},${b})`;
}

// The only reason I pass the event to these functions...
// This implementation is a little goofy when going over colors, because it DOES
// Darken a colored pixel 10%, but the final col is grey due to subtract ratios
function chiaroscuro(e) {
  let color = window.getComputedStyle(e.target, null).getPropertyValue("background-color");
  console.log(color);
  let rgb = color.match(/([0-9])+/gi); // Oof, I need to improve my regex...
  rgb = [(+rgb[0]), (+rgb[0]), (+rgb[0])];
  let rgbSum = rgb[0] + rgb[1] + rgb[2];
  let overallBrightnessReduction = (255 * 3 / 10) / rgbSum;

  let rgbNew = [];
  for(let i = 0; i < 3; i++) {
    let rgbSubtract = rgb[i] * overallBrightnessReduction;
    console.log(rgbSubtract);
    rgbNew[i] = rgb[i] - rgbSubtract;
  }
  return `rgb(${rgbNew[0]},${rgbNew[1]},${rgbNew[2]})`;
  
}

// MAIN
generateGrid(initialGridSize);

gridResetBtn.addEventListener("click", ()=> {
  let newSize = prompt("What grid size do you want?");
  generateGrid(Math.min(Math.max(newSize,2), 100));
});
