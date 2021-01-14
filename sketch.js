
const root = document.documentElement;
const etchContainer = document.querySelector(".etch-container");
const gridResetBtn = document.querySelector("#grid-reset-btn");

const gridSize = 60;


let pixels = [];

let getColor = totallyRandomColor;

function setPixelColor(e) {
  e.target.style.backgroundColor = getColor();
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
      pixel.removeEventListener("mouseenter", setPixelColor);
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

function constantColor(e) {
  return "blue";
}

function totallyRandomColor(e) {
  let r = Math.random() * 256;
  let g = Math.random() * 256;
  let b = Math.random() * 256;
  return `rgb(${r},${g},${b})`;
}

// MAIN
generateGrid(gridSize);

gridResetBtn.addEventListener("click", ()=> {
  let newSize = prompt("What grid size do you want?");
  generateGrid(Math.min(newSize, 100));
});
