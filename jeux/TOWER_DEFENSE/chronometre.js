class Chronometre {
    constructor(game) {
        this.game = game;
        this.startTime = 0;
        this.isRunning = false;
        this.intervalId = null;
        
        this.timerElement = document.createElement('div');
        this.timerElement.className = 'timer';
        this.timerElement.textContent = 'Chrono : 00:00:00';
        
        const statsElement = document.querySelector('.stats');
        if (statsElement) {
            statsElement.appendChild(this.timerElement);
        }
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.startTime = Date.now();
            
            this.intervalId = setInterval(() => {
                if (this.isRunning) {
                    const elapsedTime = Date.now() - this.startTime;
                    this.timerElement.textContent = "Chrono : "  +this.formatTime(elapsedTime);
                }
            }, 100);
        }
    }

    stop() {
        if (this.isRunning) {
            this.isRunning = false;
            clearInterval(this.intervalId);
        }
    }

    reset() {
        this.stop();
        this.timerElement.textContent = 'Chrono : 00:00:00';
    }

    formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000) % 60;
        const minutes = Math.floor(milliseconds / 60000) % 60;
        const hours = Math.floor(milliseconds / 3600000);
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}
