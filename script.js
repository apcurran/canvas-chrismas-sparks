"use strict";

/** @type {HTMLCanvasElement} */
const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d", { alpha: false });

const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
};
const GRAVITY = 0.02;
const FRICTION = 0.99;

// Helper functions
function createCachedCanvases() {
    // Pre-compute particles
    const cachedCanvas1 = typeof OffscreenCanvas !== "undefined" ? new OffscreenCanvas(10, 10) : document.createElement("canvas");
    const cachedCanvasCtx1 = cachedCanvas1.getContext("2d");
    cachedCanvasCtx1.fillStyle = "#dc2626";
    cachedCanvasCtx1.beginPath();
    cachedCanvasCtx1.arc(5, 5, 3, 0, 2 * Math.PI, true);
    cachedCanvasCtx1.fill();
    
    const cachedCanvas2 = typeof OffscreenCanvas !== "undefined" ? new OffscreenCanvas(10, 10) : document.createElement("canvas");
    const cachedCanvasCtx2 = cachedCanvas2.getContext("2d");
    cachedCanvasCtx2.fillStyle = "#16a34a";
    cachedCanvasCtx2.beginPath();
    cachedCanvasCtx2.arc(5, 5, 3, 0, 2 * Math.PI, true);
    cachedCanvasCtx2.fill();
    
    return [cachedCanvas1, cachedCanvas2];
}

function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Particle {
    /**
     * @param {number} x 
     * @param {number} y 
     * @param {HTMLCanvasElement|OffscreenCanvas} selectedCachedCanvas 
     * @param {number} velocityX 
     * @param {number} velocityY 
     */
    constructor(x, y, selectedCachedCanvas, velocityX, velocityY) {
        this.x = x;
        this.y = y;
        this.selectedCachedCanvas = selectedCachedCanvas;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.alpha = 1;
    }
    
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.drawImage(this.selectedCachedCanvas, this.x, this.y);
        ctx.restore();
    }
    
    update() {
        // Multiply x and y velocities by friction
        this.velocityX *= FRICTION;
        this.velocityY *= FRICTION;
        // Add gravity to y velocity
        this.velocityY += GRAVITY;
        // Update x and y positions
        this.x += this.velocityX;
        this.y += this.velocityY;
        // Reduce alpha value continuously
        this.alpha -= 0.005;
    }
}

// Implementation
let particles;
const particleCount = 450;
const POWER = 20;
// Ring effect
const angleIncrement = Math.PI * 2 / particleCount;
const cachedCanvasesArr = createCachedCanvases();

function init() {
    // Set canvas dimensions
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;

    // Reset particles arr
    particles = [];
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    ctx.fillStyle = "rgba(0,0,0, .05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
        // Remove particle if its alpha val is less than 0.
        if (particles[i].alpha < 0) {
            particles.splice(i, 1);
        } else {
            particles[i].draw();
            particles[i].update();
        }
    }
}

init();
animate();

// Event Listeners
document.addEventListener("click", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(
            mouse.x,
            mouse.y,
            cachedCanvasesArr[randomIntFromRange(0, 1)],
            Math.cos(angleIncrement * i) * Math.random() * POWER,
            Math.sin(angleIncrement * i) * Math.random() * POWER
        ));
    }
});

window.addEventListener("resize", init);