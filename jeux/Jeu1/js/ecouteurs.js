function initListeners(inputStates, canvas, menu, startGame) {
    window.onkeydown = (event) => {
        if (event.key === " ") {
            inputStates.Space = true;
        }
        if (event.key === "f" || event.key === "F") {
            inputStates.F = true;
        }
        if (event.key === "Escape") {
            menu.togglePause();
        }
        if (event.key === "Enter") {
            startGame();
        }
    }

    window.onkeyup = (event) => {
        if (event.key === " ") {
            inputStates.Space = false;
        }
        if (event.key === "f" || event.key === "F") {
            inputStates.F = false;
        }
    }

    window.onmousemove = (event) => {
        // get proper x and y for the mouse in the canvas
        inputStates.mouseX = event.clientX - canvas.getBoundingClientRect().left;
        inputStates.mouseY = event.clientY - canvas.getBoundingClientRect().top;
    }

    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        menu.handlePauseIconClick(x, y);
    });
}

export { initListeners };