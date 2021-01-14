
const root = document.documentElement;
const etchContainer = document.querySelector(".etch-container");
const gridResetBtn = document.querySelector("#grid-reset-btn");

const gridSize = 60;


let pixels = [];

let setPixelColor = randomShade;

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
function randomShade(e) {
  let shade = Math.random() * 100;
  e.target.style.backgroundColor = `hsl(40, 50%, ${shade}%`;
}

function constantColor(e) {
  e.target.style.backgroundColor = "blue";
}

// MAIN
generateGrid(gridSize);

gridResetBtn.addEventListener("click", ()=> {
  let newSize = prompt("What grid size do you want?");
  generateGrid(Math.min(newSize, 100));
});
