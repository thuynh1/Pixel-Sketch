function createPixel() {
    const pixel = document.createElement("div");
    pixel.classList.add("pixel");
    return pixel;
}

// TODO: Should we have 2 sliders to change the height and width?
function createScreen(size=16) {
    clearScreen();
    screen.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    screen.style.gridTemplateRows = `repeate(${size}, 1fr)`;
    for (let h = 0; h < size; h += 1) {
        for (let w = 0; w < size; w += 1) {
            let pixel = createPixel();
            screen.appendChild(pixel);
        }
    }
}

function clearScreen() {
    while (screen.firstChild) {
        screen.removeChild(screen.firstChild);
    }
}

const screen = document.querySelector(".screen");
const controlScreenSize = document.querySelector(".control__screen-size");
controlScreenSize.addEventListener("change", function(event) {
    let size = event.target.value;
    createScreen(size)
});

// main()
createScreen();