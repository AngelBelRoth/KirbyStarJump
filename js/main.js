document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const kirby = document.createElement('div')
    let isGameOver = false
    let starCount = 18
    let stars = []
    let score = 0
    let kirbyLeftSpace = 50
    let startPoint = 100
    let kirbyBottomSpace = startPoint
    let upTimerId
    let downTimerId
    let isJumping = false
    let isGoingLeft = false
    let isGoingRight = false
    let leftTimerId
    let rightTimerId

    class Star {
        constructor(newStarBottom) {
            //grid width - star width = 600 - 120 = 480
            this.left = Math.random() * 1600
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
        // kirbyLeftSpace = stars[0].left
        kirby.style.left = kirbyLeftSpace + 'px'
        kirby.style.bottom = kirbyBottomSpace + 'px'
    }

    function fall() {
        isJumping = false
        clearTimeout(upTimerId)
        downTimerId = setInterval(() => {
            kirbyBottomSpace -= 5
            kirby.style.bottom = kirbyBottomSpace + 'px'
            if (kirbyBottomSpace <= 0) {
                gameOver()
            }
            stars.forEach(star => {
                if (
                    (kirbyBottomSpace >= star.bottom) &&
                    (kirbyBottomSpace <= (star.bottom + 12)) &&
                    ((kirbyLeftSpace + 60) >= star.left) &&
                    (kirbyLeftSpace <= (star.left + 85)) &&
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
    // fall()

    function jump() {
        clearInterval(downTimerId)
        isJumping = true
        upTimerId = setInterval(() => {
            kirbyBottomSpace += 20
            kirby.style.bottom = kirbyBottomSpace + 'px'
            if (kirbyBottomSpace > startPoint + 200) {
                fall()
                isJumping = false
            }
        }, 30)
    }

    function moveLeft() {
        if (isGoingRight) {
            clearInterval(rightTimerId)
            isGoingRight = false
        }
        isGoingLeft = true
        leftTimerId = setInterval(() => {
            if (kirbyBottomSpace >= 0) {
                console.log('going left')
                kirbyLeftSpace -= 5
                kirby.style.left = kirbyLeftSpace + 'px'
            } else moveRight()
        }, 20)
    }

    function moveRight() {
        if (isGoingLeft) {
            clearInterval(leftTimerId)
            isGoingLeft = false
        }
        isGoingRight = true
        rightTimerId = setInterval(() => {
            //grid width - star width = 600 - 120 = 480
            if (kirbyLeftSpace <= 1600) {
                console.log('going right')
                kirbyLeftSpace += 5
                kirby.style.left = kirbyLeftSpace + 'px'
            } else moveLeft()
        }, 20)
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
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
    }

    function start() {
        if (!isGameOver) {
            createKirby()
            createStars()
            setInterval(moveStars, 30)
            jump()
            // document.addEventListener('keyup', control)
            document.addEventListener('keydown', control)
        }
    }
    start()

})

// Citation: Ania Kubów & M.Kazin
// href: https://www.youtube.com/watch?v=dgUGTGEdVSk&list=WL&index=5&t=1545s