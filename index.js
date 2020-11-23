// GLOBALS
let isDrawing = false;
let brushSetting = "solid";
let setting = `pixel--${brushSetting}`;
const rainbowColors = [
    "rgb(255, 0, 0)",       // Red
    "rgb(255, 127, 0)",     // Orange
    "rgb(255, 255, 0)",     // Yellow
    "rgb(0, 255, 0)",       // Green
    "rgb(0, 0, 255)",       // Blue
    "rgb(75, 0, 130)",      // Indigo
    "rgb(148, 0, 211)",     // Violet
];

const brushTypes = {
    SOLID: "solid",
    GRAYSCALE: "grayscale",
    RAINBOW: "rainbow",
    ERASER: "eraser",
};

/**
 * Controls
 */
function setBrushSetting(event) {
    let type = event.target.value;
    if (Object.values(brushTypes).includes(type)) {
        brushSetting = type;
        setting = `pixel--${brushSetting}`;
    }
}

// Handles the pixel color depending on the brush settings
function colorSchemeHandler(pixel) {
    let style = "";
    switch (brushSetting) {
        case brushTypes.GRAYSCALE:
            style = applyGrayscaleColor(pixel);
            break;
        case brushTypes.RAINBOW:
            style = applyRainbowColor(pixel);
            break;
        case brushTypes.ERASER:
            if (pixel.classList[1] !== undefined) {
                pixel.classList.remove(pixel.classList[1]);
            }
            break;
        case brushTypes.SOLID:
            break;
    }
    return style;
}

/**
 * https://www.cssportal.com/html-colors/shades-of-gray.php
 * GRAYSCALE_END   = rgb(0, 0, 0)
 * GRAYSCALE_START = rgb(232, 232, 232)
 */
function applyGrayscaleColor(pixel) {
    const SHIFT = 16;
    let backgroundColor = window.getComputedStyle(pixel).backgroundColor;
    let currentGray = backgroundColor.split(",")[1];
    let newGray = currentGray - SHIFT;
    return `rgb(${newGray}, ${newGray}, ${newGray})`;
}

/**
 * https://www.webnots.com/vibgyor-rainbow-color-codes/
 */
function applyRainbowColor(pixel) {
    let backgroundColor = window.getComputedStyle(pixel).backgroundColor;
    let index = rainbowColors.indexOf(backgroundColor);
    // Cycle through the array of rainbowColors
    let newColor = rainbowColors[((index + 1) % 7)];
    return newColor;
}

/**
 * Pixel
 */
function createPixel() {
    const pixel = document.createElement("div");
    pixel.classList.add("pixel");
    pixel.addEventListener("mousedown", pixelMouseDown);
    pixel.addEventListener("mouseenter", pixelMouseOver);
    pixel.addEventListener("mouseup", pixelMouseUp);
    return pixel;
}

function setPixelStyle(event) {
    let pixel = event.target;
    let currentStyle = pixel.classList[1];
    if (currentStyle === undefined) {
        pixel.classList.add(setting);
    } else if (currentStyle !== setting) {
        pixel.classList.remove(currentStyle);
        pixel.classList.add(setting);
    }
    pixel.style.backgroundColor = colorSchemeHandler(pixel);
}

function pixelMouseDown(event) {
    setPixelStyle(event);
    isDrawing = true;
}

function pixelMouseOver(event) {
    if (isDrawing === true) setPixelStyle(event);
}

function pixelMouseUp(event) {
    isDrawing = false;
}

/**
 * Canvas 
 */
function createCanvas(size=16) {
    clearCanvas();
    let oldPixelAmount = canvas.childElementCount;
    let newPixelAmount = Number(size) ** 2;

    canvas.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    canvas.style.gridTemplateRows = `repeate(${size}, 1fr)`;

    let delta = newPixelAmount - oldPixelAmount;
    for (let i = 0; i < Math.abs(delta); i += 1) {
        if (delta > 0) {
            let pixel = createPixel();
            canvas.appendChild(pixel);
        } else if (delta < 0) {
            canvas.removeChild(canvas.lastChild);
        }
    }
}

function clearCanvas() {
    const types = [brushTypes.SOLID, brushTypes.GRAYSCALE, brushTypes.RAINBOW];
    types.forEach(function(type) {
        clearPixels(type);
    })
}

function clearPixels(type) {
    let pixelType = `pixel--${type}`;
    let list = document.querySelectorAll(`.${pixelType}`);
    if (list.length > 0) {
        list.forEach(function(item) {
            item.classList.remove(pixelType);
            if (item.style.backgroundColor !== null) {
                item.style.backgroundColor = null;
            }
        })
    }
}

function disableBrush(event) {
    if (event.target.classList[0] !== "pixel") {
        isDrawing = false;
    }
}

function updatePixelDensity(event) {
    let size = event.target.value;
    pixelDensityValue.textContent = size;
    createCanvas(size);
}

function recreateCanvas(event) {
    let size = Number(controlCanvasPixelDensity.value);
    createCanvas(size);
}

const body = document.querySelector("body");
const canvas = document.querySelector(".canvas");
const controlCanvasPixelDensity = document.querySelector(".control__canvas-pixel-density");
const clearCanvasButton = document.querySelector(".control__canvas-clear");
const pixelDensityValue = document.querySelector(".control__canvas-pixel-value");
const controlBrushSettings = document.querySelectorAll(".control__brush");

body.addEventListener("mouseover", disableBrush);
controlCanvasPixelDensity.addEventListener("change", updatePixelDensity);
clearCanvasButton.addEventListener("click", recreateCanvas);
controlBrushSettings.forEach(function(setting) {
    setting.addEventListener("change", setBrushSetting);
});

// main()
createCanvas();