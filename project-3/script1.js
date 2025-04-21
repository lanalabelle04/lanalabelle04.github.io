let textInput = document.getElementById('textInput');
let textDisplay = document.getElementById('textDisplay');
let fontSizeSlider = document.getElementById('fontSize');
let lineHeightSlider = document.getElementById('lineHeight');
let letterSpacingSlider = document.getElementById('letterSpacing');
let menu = document.getElementById('menu');
let menuToggle = document.getElementById('menuToggle');
let canvasContainer = document.getElementById('canvas-container');
let menuOpen = false;
let inputTimer = null;
let pixelMap = {};

function toggleMenu() {
    menuOpen = !menuOpen;
    if (menuOpen) {
        menu.classList.remove('closed');
        menuToggle.innerHTML = '✕';
    } else {
        menu.classList.add('closed');
        menuToggle.innerHTML = '☰'; 
    }
}

function changeText() {
    textDisplay.textContent = textInput.value;
    textDisplay.style.opacity = '1'; 
    
    clearTimeout(inputTimer);
    
    if (textInput.value.trim() !== '') {
        inputTimer = setTimeout(() => {
            pixelateText();
        }, 5000);
    }
}

function pixelateText() {
    let rect = textDisplay.getBoundingClientRect();
    let fontSize = parseInt(window.getComputedStyle(textDisplay).fontSize);
    let text = textDisplay.textContent;
    
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    ctx.font = `${fontSize}px 'Argent Pixel CF', Arial, sans-serif`;
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;
    
    let pixelSize = 5;
    let pixelSpacing = 5; 
    
    let pixels = [];
    
    for (let y = 0; y < canvas.height; y += pixelSpacing) {
        for (let x = 0; x < canvas.width; x += pixelSpacing) {
            let index = (y * canvas.width + x) * 4;
            if (data[index + 3] > 50) { 
                let pixel = createPixel(rect.left + x, rect.top + y, pixelSize);
                pixels.push(pixel);
            }
        }
    }
    
    textDisplay.style.opacity = '0';
    
    pixels.forEach(pixel => canvasContainer.appendChild(pixel));
    
    pixels.forEach(pixel => {
        setTimeout(() => {
            let xPos = parseInt(pixel.style.left);
            let xKey = Math.floor(xPos / pixelSize) * pixelSize; 
            
            if (!pixelMap[xKey]) {
                pixelMap[xKey] = 0;
            }
            
            let landingY = window.innerHeight - pixelMap[xKey] - pixelSize;
            
            pixelMap[xKey] += pixelSize;
            
            pixel.style.top = landingY + 'px';
        }, Math.random() * 1000);
    });
}

function createPixel(x, y, size) {
    let pixel = document.createElement('div');
    pixel.className = 'pixel';
    pixel.style.left = x + 'px';
    pixel.style.top = y + 'px';
    pixel.style.width = size + 'px';
    pixel.style.height = size + 'px';
    
let initialColors = ['#423C1B', '#616F16', '#A0A358', '#716E4B', '#666337', '#8F953A', '#394308', '#C5CC68'];
let secondaryColors = ['#201511', '#2B1C12', '#010100', '#24130A'];

function getRandomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
}

function setInitialColor(pixel) {
    pixel.style.backgroundColor = getRandomColor(initialColors);
    
    let firstDelay = 5000 + Math.random() * 5000; 
    setTimeout(() => {
        pixel.style.backgroundColor = getRandomColor(secondaryColors);
        
        let secondDelay = 5000 + Math.random() * 5000;
        setTimeout(() => {
            if (pixel.parentNode) {
                pixel.parentNode.removeChild(pixel);
            }
        }, secondDelay);
    }, firstDelay);
}

setInitialColor(pixel);
    
    return pixel;
}

function updateStyles() {
    let fontSize = fontSizeSlider.value;
    let lineHeight = lineHeightSlider.value;
    let letterSpacing = letterSpacingSlider.value;
    
    textDisplay.style.fontSize = `${fontSize}px`;
    textDisplay.style.lineHeight = lineHeight;
    textDisplay.style.letterSpacing = `${letterSpacing}px`;
    
    document.getElementById('fontSizeValue').textContent = `${fontSize}px`;
    document.getElementById('lineHeightValue').textContent = lineHeight;
    document.getElementById('letterSpacingValue').textContent = `${letterSpacing}px`;
    
    clearTimeout(inputTimer);
    if (textInput.value.trim() !== '') {
        textDisplay.style.opacity = '1'; 
        inputTimer = setTimeout(() => {
            pixelateText();
        }, 5000);
    }
}

function refreshAll() {
    textInput.value = '';
    fontSizeSlider.value = 50;
    lineHeightSlider.value = 1.5;
    letterSpacingSlider.value = 0;
    textDisplay.textContent = '';
    textDisplay.style.opacity = '1';
    canvasContainer.innerHTML = '';
    pixelMap = {}; 
    clearTimeout(inputTimer);
    updateStyles();
}

function randomizeStyles() {
    fontSizeSlider.value = Math.floor(Math.random() * 91) + 10; 
    lineHeightSlider.value = (Math.random() * 2 + 1).toFixed(1); 
    letterSpacingSlider.value = Math.floor(Math.random() * 11); 
    updateStyles();
}

document.fonts.load(`16px 'Argent Pixel CF'`).then(() => {
    ctx.font = `${fontSize}px 'Argent Pixel CF'`;
    ctx.fillText('Hello world!', 50, 50);
  });
  

updateStyles();