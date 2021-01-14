
const root = document.documentElement;
const etchContainer = document.querySelector(".etch-container");

const gridSize = 16;
root.style.setProperty("--grid-size", gridSize);

const pixels = [];

for(let i = 0; i < (gridSize * gridSize); i++) {
  let shade = Math.random();
  let pixel = document.createElement("div");
  pixel.setAttribute("class","pixel");
  etchContainer.appendChild(pixel);
  pixels.push(pixel);
}
