const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const celebration = document.getElementById("celebration");
const reloadBtn = document.getElementById("reloadBtn");

let noButtonArmed = false;
let rafId = null;
let pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

function getViewportSize() {
    if (window.visualViewport) {
        return {
            width: window.visualViewport.width,
            height: window.visualViewport.height
        };
    }
    return {
        width: window.innerWidth,
        height: window.innerHeight
    };
}

function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

function placeNoButtonRandomly() {
    const rect = noBtn.getBoundingClientRect();
    const viewport = getViewportSize();
    const safeMargin = 14;
    const maxX = Math.max(
        safeMargin,
        viewport.width - rect.width - safeMargin
    );
    const maxY = Math.max(
        safeMargin,
        viewport.height - rect.height - safeMargin
    );

    const x = randomInRange(safeMargin, maxX);
    const y = randomInRange(safeMargin, maxY);
    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;
}

function fleeFromPointer() {
    const rect = noBtn.getBoundingClientRect();
    const viewport = getViewportSize();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = pointer.x - centerX;
    const dy = pointer.y - centerY;
    const distance = Math.hypot(dx, dy);

    // Move away quickly if pointer/touch gets close.
    if (distance < 150) {
        const angle = Math.atan2(dy, dx);
        const escapeDistance = 170 + Math.random() * 80;
        const nextX = centerX - Math.cos(angle) * escapeDistance;
        const nextY = centerY - Math.sin(angle) * escapeDistance;

        const margin = 12;
        const clampedLeft = Math.min(
            Math.max(nextX - rect.width / 2, margin),
            viewport.width - rect.width - margin
        );
        const clampedTop = Math.min(
            Math.max(nextY - rect.height / 2, margin),
            viewport.height - rect.height - margin
        );

        noBtn.style.left = `${clampedLeft}px`;
        noBtn.style.top = `${clampedTop}px`;
    }

    rafId = window.requestAnimationFrame(fleeFromPointer);
}

function armNoButton() {
    if (noButtonArmed) return;
    noButtonArmed = true;
    placeNoButtonRandomly();
    rafId = window.requestAnimationFrame(fleeFromPointer);
}

function disarmNoButton() {
    if (!noButtonArmed) return;
    noButtonArmed = false;
    if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
    }
}

function showCelebration() {
    celebration.style.display = "flex";
    celebration.setAttribute("aria-hidden", "false");
    createConfetti();
    disarmNoButton();
}

function createConfetti() {
    const colors = ["#f093fb", "#f5576c", "#4facfe", "#00f2fe", "#43e97b", "#fa709a"];

    for (let i = 0; i < 140; i += 1) {
        window.setTimeout(() => {
            const confetti = document.createElement("div");
            confetti.className = "confetti";
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.opacity = String(randomInRange(0.7, 1));
            confetti.style.animationDuration = `${randomInRange(2.2, 4.2)}s`;
            confetti.style.transform = `translateY(0) rotate(${Math.random() * 180}deg)`;
            document.body.appendChild(confetti);
            window.setTimeout(() => confetti.remove(), 4500);
        }, i * 16);
    }
}

window.addEventListener("mousemove", (event) => {
    pointer = { x: event.clientX, y: event.clientY };
});

window.addEventListener(
    "touchmove",
    (event) => {
        if (!event.touches[0]) return;
        pointer = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
        };
    },
    { passive: true }
);

window.addEventListener(
    "touchstart",
    (event) => {
        if (!event.touches[0]) return;
        pointer = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
        };
    },
    { passive: true }
);

window.addEventListener("resize", () => {
    placeNoButtonRandomly();
});

if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", placeNoButtonRandomly);
    window.visualViewport.addEventListener("scroll", placeNoButtonRandomly);
}

// Make "No" practically impossible to click.
["mouseenter", "pointerdown", "touchstart", "click", "focus"].forEach((eventName) => {
    noBtn.addEventListener(eventName, (event) => {
        event.preventDefault();
        placeNoButtonRandomly();
    });
});

document.addEventListener("DOMContentLoaded", () => {
    armNoButton();
});

yesBtn.addEventListener("click", showCelebration);

if (reloadBtn) {
    reloadBtn.addEventListener("click", () => {
        window.location.reload();
    });
}
