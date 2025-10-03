document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const kirby = document.createElement('div')
    const KIRBY_JUMP_HEIGHT = 300
    const MAX_INTERVALS = 5

    let starCount = 10
    let stars = []
    let score = 0
    let startPoint = 100
    let kirbyLeftSpace = 50
    let kirbyBottomSpace = startPoint
    let upTimerId
    let downTimerId
    let isJumping = false
    let isGameOver = false

    let leftIntervals = [];
    let rightIntervals = [];

    class Star {
        constructor(newStarBottom) {
            //grid width - star width = 1600 - 120 = 1480
            this.left = Math.random() * 1480
            this.bottom = newStarBottom
            this.visual = document.createElement('div')
            this.visual.classList.add('star')
            this.visual.style.left = this.left + 'px'
            this.visual.style.bottom = this.bottom + 'px'
            grid.appendChild(this.visual)
        }
    }

    function createStars() {
        for (let i = 0; i < starCount; i++) {
            //grid height 800
            let starGap = 800 / starCount
            let newStarBottom = 100 + i * starGap
            let newStar = new Star(newStarBottom)
            stars.push(newStar)
        }
    }

    function moveStars() {
        if (kirbyBottomSpace > 200) {
            stars.forEach(star => {
                star.bottom -= 4
                let visual = star.visual
                visual.style.bottom = star.bottom + 'px'

                if (star.bottom < 10) {
                    let firstStar = stars[0].visual
                    firstStar.classList.remove('star')
                    stars.shift()
                    console.log('1', stars)
                    score++
                    let newStar = new Star(800)
                    stars.push(newStar)
                    console.log('2', stars)
                }
            })
        }
    }

    function createKirby() {
        grid.appendChild(kirby)
        kirby.classList.add('kirby')
        kirbyLeftSpace = stars[0].left
        kirby.style.left = kirbyLeftSpace + 'px'
        kirby.style.bottom = kirbyBottomSpace + 'px'
    }

    function fall() {
        isJumping = false
        clearTimeout(upTimerId)
        downTimerId = setInterval(() => {
            //gravity 'how many px to drop' for every interval (20milisec)
            kirbyBottomSpace -= 5
            kirby.style.bottom = kirbyBottomSpace + 'px'
            if (kirbyBottomSpace <= 0) {
                gameOver()
            }
            stars.forEach(star => {
                if (
                    (kirbyBottomSpace >= star.bottom) &&
                    (kirbyBottomSpace <= (star.bottom + 11)) &&
                    (kirbyLeftSpace >= star.left - 80) &&
                    (kirbyLeftSpace <= star.left + 100) &&
                    !isJumping
                ) {
                    startPoint = kirbyBottomSpace
                    jump()
                    console.log('startPoint', startPoint)
                    isJumping = true
                }
            })
        }, 20)
    }

    function jump() {
        clearInterval(downTimerId)
        isJumping = true
        upTimerId = setInterval(() => {
            kirbyBottomSpace += 20
            kirby.style.bottom = kirbyBottomSpace + 'px'
            if (kirbyBottomSpace > startPoint + KIRBY_JUMP_HEIGHT) {
                fall()
                isJumping = false
            }
        }, 20)
    }

    function moveLeft() {
        if (rightIntervals.length) {
            let rightTimerId = rightIntervals.pop()
            clearInterval(rightTimerId)
        }else if(leftIntervals.length <= MAX_INTERVALS){
            let leftTimerId = setInterval(() => {
                if (kirbyLeftSpace >= 0) {
                    console.log('going left')
                    kirbyLeftSpace -= 5
                } else {
                    kirbyLeftSpace = 1600
                }
                kirby.style.left = kirbyLeftSpace + 'px'
            }, 20)
            leftIntervals.push(leftTimerId)
        }
    }

    function moveRight() {
        if (leftIntervals.length) {
            let leftTimerId = leftIntervals.pop()
            clearInterval(leftTimerId)
        }else if (rightIntervals.length <= MAX_INTERVALS){
            rightTimerId = setInterval(() => {
                //grid width - star width = 600 - 120 = 480
                if (kirbyLeftSpace <= 1600) {
                    console.log('going right')
                    kirbyLeftSpace += 5
                } else {
                    kirbyLeftSpace = 0
                }
                kirby.style.left = kirbyLeftSpace + 'px'
            }, 20)
            rightIntervals.push(rightTimerId);
        }
    }

    function moveStraight() {
        isGoingLeft = false
        isGoingRight = false
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
    }

    function control(e) {
        kirby.style.bottom = kirbyBottomSpace + 'px'
        if (e.key === 'ArrowLeft') {
            moveLeft()
        } else if (e.key === 'ArrowRight') {
            moveRight()
        } else if (e.key === 'ArrowUp') {
            moveStraight()
        }
    }

    function gameOver() {
        isGameOver = true
        while (grid.firstChild) {
            grid.removeChild(grid.firstChild)
        }
        grid.innerHTML = score
        clearInterval(downTimerId)
        clearInterval(upTimerId)
        leftIntervals.forEach( (leftTimerId) => clearInterval(leftIntervals) )
        rightIntervals.forEach( (rightTimerId) => clearInterval(rightTimerId) )

    }

    function start() {
        if (!isGameOver) {
            createStars()
            createKirby()
            setInterval(moveStars, 30)
            jump()
            document.addEventListener('keydown', control)
        }
    }
    start()
})

// Citation: Ania Kubów
// href: https://www.youtube.com/watch?v=dgUGTGEdVSk&list=WL&index=5&t=1545s
// Revision: Michael Kazin
// p.s. do "less" randomization next time, control vertial & horizontal stars gap e.g. (Y 80px/star)