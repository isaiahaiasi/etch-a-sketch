
const root = document.documentElement;
const etchContainer = document.querySelector(".etch-container");

const gridSize = 16;
root.style.setProperty("--grid-size", gridSize);

const pixels = [];

for(let i = 0; i < (gridSize * gridSize); i++) {
  
  let pixel = document.createElement("div");
  pixel.setAttribute("class","pixel");

  pixel.addEventListener("mouseenter", e => {
    let shade = Math.random() * 100;
    e.target.style.backgroundColor = `hsl(40, 50%, ${shade}%`;
  });
  etchContainer.appendChild(pixel);
  pixels.push(pixel);
}
