export class PomodoroTimer {
    constructor(onTick, onComplete) {
        this.timerId = null;
        this.secondsLeft = 25 * 60;
        this.isRunning = false;
        this.onTick = onTick;
        this.onComplete = onComplete;
    }

    setMode(minutes) {
        this.stop();
        this.secondsLeft = minutes * 60;
        this.onTick(this.secondsLeft);
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.timerId = setInterval(() => {
            this.secondsLeft--;
            this.onTick(this.secondsLeft);
            if (this.secondsLeft <= 0) {
                this.stop();
                this.onComplete();
            }
        }, 1000);
    }

    stop() {
        this.isRunning = false;
        if (this.timerId) clearInterval(this.timerId);
    }
}