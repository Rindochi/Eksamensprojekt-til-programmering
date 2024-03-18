class Board {
    constructor(size) {
      this.size = size
      this.squares = []
      this.currentPlayer = 0 // index of the current player
      this.winner = null
      this.createSquares()
    }
  
    createSquares() {
      for (let i = 0; i < this.size; i++) {
        const tmp = []
        for (let j = 0; j < this.size; j++) {
          tmp.push(new Square(i, j))
        }
        this.squares.push(tmp)
      }
    }
  
    findSquare(x, y) {
      // x and y are the coordinates of the mouse click
  
      const w = width / this.size
      const h = height / this.size
  
      console.log(width, height)
  
      // i and j are the coordinates of the square that was clicked
      const i = floor(x / w)
      const j = floor(y / h)
  
      // return the square that was clicked
      // this is the formula for finding the index of a 2D array in a 1D array
      return this.squares[i][j]
    }
  
    drawBoard() {
      const w = width / this.size
      const h = height / this.size
      for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
          const x = i * w
          const y = j * h
          rect(x, y, w, h)
        }
      }
    }
  
    drawSquares() {
      for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
          this.squares[i][j].draw()
        }
      }
    }
  
    resetSquares() {
      for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
          this.squares[i][j].reset()
        }
      }
    }
  
    checkCols(player) {
      for (let i = 0; i < this.size; i++) {
        let count = 0
        for (let j = 0; j < this.size; j++) {
          if (this.squares[i][j].claimedBy === player) {
            count++
          }
        }
        if (count === this.size) {
          return true
        }
      }
      return false
    }
  
    checkRows(player) {
      for (let j = 0; j < this.size; j++) {
        let count = 0
        for (let i = 0; i < this.size; i++) {
          if (this.squares[i][j].claimedBy === player) {
            count++
          }
        }
        if (count === this.size) {
          return true
        }
      }
      return false
    }
  
    checkDiagonals(player) {
      let count = 0
      for (let i = 0; i < this.size; i++) {
        if (this.squares[i][i].claimedBy === player) {
          count++
        }
      }
      if (count === this.size) {
        return true
      }
  
      count = 0
      for (let i = 0; i < this.size; i++) {
        if (this.squares[i][this.size - 1 - i].claimedBy === player) {
          count++
        }
      }
      if (count === this.size) {
        return true
      }
      return false
    }
  
    checkIfWinnerIsFound() {
      if (this.checkCols(p1) || this.checkRows(p1) || this.checkDiagonals(p1)) {
        this.winner = p1
        return true
      }
      if (this.checkCols(p2) || this.checkRows(p2) || this.checkDiagonals(p2)) {
        this.winner = p2
        return true
      }
      return false
    }
  }
  
  class Square {
    constructor(i, j) {
      this.i = i
      this.j = j
      this.isClaimed = false
      this.claimedBy = null
    }
  
    claim(player) {
      this.isClaimed = true
      this.claimedBy = player
      console.log('Claimed by', player.name)
    }
  
    draw() {
      if (this.isClaimed) {
        push()
        fill(this.claimedBy.color)
        const w = width / board.size
        const h = height / board.size
        const x = this.i * w
        const y = this.j * h
        // rect(x, y, w, h)
        ellipse(x + w / 2, y + h / 2, w / 2, h / 2)
        pop()
      }
    }
  
    reset() {
      this.isClaimed = false
      this.claimedBy = null
    }
  }
  
  class Player {
    constructor(color, isTurn, name) {
      this.color = color
      this.isTurn = isTurn
      this.name = name
      this.score = 0
    }
  }
  
  let board
  let p1
  let p2
  let gameOver
  
  function setup() {
    createCanvas(windowWidth, windowHeight)
    const n = 4
    board = new Board(n)
    p1 = new Player(color(255, 0, 0), true, 'Player 1')
    p2 = new Player(color(0, 0, 255), false, 'Player 2')
    gameOver = false
  }
  
  function draw() {
    if (gameOver === false) {
      board.drawBoard()
      board.drawSquares()
      printScoresInTopRightCorner()
    }
  
    if (board.checkIfWinnerIsFound() && gameOver === false) {
      gameOver = true
      if (board.winner === p1) {
        p1.score++
      } else {
        p2.score++
      }
      printWinnerOnScreen()
    }
  }
  
  function printWinnerOnScreen() {
    push()
    textSize(32)
    textAlign(CENTER, CENTER)
    rectMode(CENTER)
    fill('black')
    rect(width / 2, height / 2, 600, 400)
    fill('white')
    text(
      'And the winner is ... ' + board.winner.name,
      width / 2,
      height / 2 - 100
    )
    text('Score: ' + p1.name + '   ' + p1.score, width / 2, height / 2)
    text('Score: ' + p2.name + '   ' + p2.score, width / 2, height / 2 + 50)
  
    textSize(24)
    text('Click N to start a new game', width / 2, height / 2 + 100)
    pop()
  }
  
  function printScoresInTopRightCorner() {
    push()
    textSize(24)
    textAlign(RIGHT, TOP)
    fill('black')
    text(p1.name + ':   ' + p1.score, width - 20, 20)
    text(p2.name + ':   ' + p2.score, width - 20, 50)
    pop()
  }
  
  function mousePressed() {
    const square = board.findSquare(mouseX, mouseY)
  
    if (!square.isClaimed) {
      if (p1.isTurn) {
        square.claim(p1)
        p1.isTurn = false
        p2.isTurn = true
      } else {
        square.claim(p2)
        p1.isTurn = true
        p2.isTurn = false
      }
    }
  }
  
  function newGame() {
    board.squares = []
    board.createSquares()
    board.winner = null
  }
  
  function keyPressed() {
    if (keyCode === 78) {
      console.log('New game')
      newGame()
      gameOver = false
    }
  }
  