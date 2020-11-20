// GLOBALS
let isDrawing = false;
// TODO: setting should maybe be called 
let brushSetting = "solid";
let setting = `pixel--${brushSetting}`;
const rainbowColors = [
    "rgb(255, 0, 0)",       // Red
    "rgb(255, 165, 0)",     // Orange
    "rgb(255, 255, 0)",     // Yellow
    "rgb(0, 128, 0)",       // Green
    "rgb(0, 0, 255)",       // Blue
    "rgb(75, 0, 130)",      // Indigo
    "rgb(238, 130, 238)",   // Violet
];

const brushTypes = {
    SOLID: "solid",
    GRAYSCALE: "grayscale",
    RAINBOW: "rainbow",
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
        case brushTypes.SOLID:
            style = applySolidColor();
            break;
        case brushTypes.GRAYSCALE:
            style = applyGrayscaleColor(pixel);
            break;
        case brushTypes.RAINBOW:
            style = applyRainbowColor(pixel);
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
 * https://colorswall.com/palette/102/
 */
function applyRainbowColor(pixel) {
    let backgroundColor = window.getComputedStyle(pixel).backgroundColor;
    let index = rainbowColors.indexOf(backgroundColor);
    // Cycle through the array of rainbowColors
    let newColor = rainbowColors[((index + 1) % 7)];
    return newColor;
}

// TODO: Is this necessary?
function applySolidColor() {}

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

// TODO: This should also handle setting the event.target.style.backgroundColor = blah
// Inside this function should be a switch statement that manages the style
function setPixelStyle(event) {
    let pixel = event.target;
    let currentStyle = pixel.classList[1];
    if (currentStyle === undefined) {
        pixel.classList.add(setting);
    } else if (currentStyle !== setting) {
        pixel.target.classList.remove(currentStyle);
        pixel.target.classList.add(sxetting);
    }
    pixel.style.backgroundColor = colorSchemeHandler(pixel);
}

function pixelMouseDown(event) {
    console.log("pixelMouseDown");
    setPixelStyle(event);
    isDrawing = true;
}

function pixelMouseOver(event) {
    console.log("pixelMouseOver");
    if (isDrawing === true) setPixelStyle(event);
}

function pixelMouseUp(event) {
    console.log("pixelMouseUp");
    if (isDrawing === true) setPixelStyle(event);
    isDrawing = false;
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
    // TODO: Remove the class .pixel-set from setPixelsList
    // TODO: How do we handle 
    // const setPixelsList = document.querySelectorAll(".pixel--set");

    while (canvas.firstChild) {
        canvas.removeChild(canvas.firstChild);
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
// TODO: Change controlCanvasSize -> controlCanvasPixelDensity
// TODO: Add a number to the side of the slider to indicate how many pixesl are going to be drawn
// TODO: Implement an eraser
// TODO: Implement different pixel colors. Call it Brush Options

// Optimization
// TODO: Don't bother clearing out entire canvas, just add or remove the amount of pixels to match the target pixel density
// Essentially delete all pixels with the pixel--set class