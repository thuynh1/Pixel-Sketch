// GLOBALS
let isDrawing = false;

/**
 * Pixel
 */
function createPixel() {
    const pixel = document.createElement("div");
    pixel.classList.add("pixel");
    pixel.addEventListener("mousedown", pixelMouseDown);
    pixel.addEventListener("mouseover", pixelMouseOver);
    pixel.addEventListener("mouseup", pixelMouseUp);
    return pixel;
}

function pixelMouseDown(event) {
    event.target.classList.add("pixel--set");
    isDrawing = true;
}

function pixelMouseOver(event) {
    if (isDrawing === true &&
        event.target.classList[0] === "pixel") {
        event.target.classList.add("pixel--set");
    }
}

function pixelMouseUp(event) {
    if (isDrawing === true) {
        event.target.classList.add("pixel--set");
        isDrawing = false;
    }
}

/**
 * Canvas 
 */
function createCanvas(size=16) {
    clearCanvas();
    canvas.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    canvas.style.gridTemplateRows = `repeate(${size}, 1fr)`;
    for (let h = 0; h < size; h += 1) {
        for (let w = 0; w < size; w += 1) {
            let pixel = createPixel();
            canvas.appendChild(pixel);
        }
    }
}

function clearCanvas() {
    while (canvas.firstChild) {
        canvas.removeChild(canvas.firstChild);
    }
}

function disableBrush(event) {
    if (event.target.classList[0] !== "pixel") {
        isDrawing = false;
    }
}

function resizeCanvas(event) {
    let size = event.target.value;
    createCanvas(size);
}

const body = document.querySelector("body");
const canvas = document.querySelector(".canvas");
const controlCanvasSize = document.querySelector(".control__screen-size");

body.addEventListener("mouseover", disableBrush);
controlCanvasSize.addEventListener("change", resizeCanvas);

// main()
createCanvas();