class Clock {
    constructor() {
        let setTimeButtons = document.getElementsByClassName("set-time-button");
        
        this.upButton = setTimeButtons[0];
        this.downButton = setTimeButtons[1];
        this.setUpTime = this.setUpTime.bind(this);
        this.attachEventListeners();
    }

    attachEventListeners() {
        this.upButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.setUpTime("up");
        })
        this.downButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.setUpTime("down")
        })
    }

    setUpTime(direction) {
        let value = document.getElementById(`starting-time-${direction}`).value || 0;
        new Timer(value, direction);
    }
}

class Timer {
    constructor(currentTimeInSeconds, direction) {
        this.currentTimeInSeconds = direction === 'up' ? 0 : currentTimeInSeconds;
        this.originalTime = currentTimeInSeconds;
        this.timer;
        this.currentLap = 1;
        this.direction = direction || 'up';
    
        this.buttons = document.getElementById(`clock-count-${this.direction}-buttons`);
        this.lapTable = document.getElementById(`clock-count-${this.direction}-laps`);
        this.startButton = this.buttons.children[0];
        this.stopButton = this.buttons.children[1];
        this.pauseButton = this.buttons.children[2];
        this.lapButton = this.buttons.children[3];
        this.attachEventListeners = this.attachEventListeners.bind(this);
        this.updateTimer = this.updateTimer.bind(this);
        this.initialize();
    }

    initialize() {
        this.updateTimer();
        this.attachEventListeners();
    }

    createHandlers() {
        
    }

    convertTime(currentSeconds) {
        var mins = Math.floor(currentSeconds % 3600 / 60);
        var secs = Math.floor(currentSeconds % 3600 % 60);
        if (mins < 10) {
            mins = '0' + mins.toString();
        }
        if (secs < 10) {
            secs = '0' + secs.toString();
        }
        mins = mins.toString();
        secs = secs.toString();
        return { mins, secs }
    }

    updateTimer() {
        let currentSeconds 
        if (this.direction === "up") {
            currentSeconds = this.currentTimeInSeconds === 3599 ? this.currentTimeInSeconds : this.currentTimeInSeconds++;
        } else {
            currentSeconds = this.currentTimeInSeconds === 0 ? this.currentTimeInSeconds : this.currentTimeInSeconds--;
        }
        let {mins, secs} = this.convertTime(currentSeconds);
        let timer = document.getElementById(`clock-count-${this.direction}-time`);
        timer.innerHTML = `${mins} : ${secs}`;
        if (+this.currentTimeInSeconds === +this.originalTime || +this.currentTimeInSeconds === 0) {
            setTimeout(() => {
                console.log('clearing interval');
                clearInterval(this.timer);
            }, 1000);
        } 
        
    }

    attachEventListeners() {
        this.onClickStart();
        this.onClickStop();
        this.onClickLap();
        this.onClickPause();
    }

    
    onClickStart() {
        this.startButton.addEventListener('click', (e) => {
            if (!this.timer) {
                this.updateTimer();
                this.timer = setInterval(this.updateTimer, 1000);  
            }
        })
    }
    
    onClickPause() {
        this.pauseButton.addEventListener('click', (e) => {
            clearInterval(this.timer);
            this.timer = null;
        })
    }

    onClickStop() {
        this.stopButton.addEventListener('click', (e) => {
            clearInterval(this.timer);
            this.timer = null;
            if (this.direction === "up") {
                this.currentTimeInSeconds = 0;
            } else {
                this.currentTimeInSeconds = this.originalTime;
            }
            this.updateTimer();
        })
    }

    onClickLap() {
        this.lapButton.addEventListener('click', (e) => {
            let { mins, secs } = this.convertTime(this.currentTimeInSeconds);
            let row = document.createElement("TR")
            let colLap = document.createElement("TD")
            colLap.innerHTML = `Lap ${this.currentLap}`
            let colTime = document.createElement("TD");
            colTime.innerHTML = `${mins} : ${secs}` 
            row.appendChild(colLap);
            row.appendChild(colTime);
            this.lapTable.appendChild(row);
            this.currentLap++;
        })
    }

}

let clock = new Clock();

