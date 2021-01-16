let START_GAME_FLAG = 0

class GUI {
  constructor() {
    this.addButtons()
  }

  addButtons() {
    this.GUIarray = []
    let startButton = createButton('Start Game');
    startButton.position(windowWidth / 2, windowHeight / 2);
    startButton.mousePressed(this.startGame.bind(this))

    let aboutButton = createButton('About');
    aboutButton.position(windowWidth / 2 + 100, windowHeight / 2);
    aboutButton.mousePressed(this.showAbout.bind(this))

    this.GUIarray.push(startButton)
    this.GUIarray.push(aboutButton)
  }

  startGame(thi) {
    console.log("bruh")
    this.removeAllButtons()
    clear()
    START_GAME_FLAG = 1;
    background(70);
  }

  showAbout(thi) {
    this.removeAllButtons()
    clear()
    background(70);
  }

  removeAllButtons() {
    console.log("yes")
    for (let btn of this.GUIarray) {
      btn.remove()
    }
  }
}

var mainGUI;

function setup() {
  createCanvas(windowWidth, windowHeight);
  mainGUI = new GUI()
  background(51);
}



function draw() {
  if (mouseIsPressed) {
    //clear();
    //background(70);
  }
  //rect(mouseX, mouseY, 55, 55);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  clear();
  background(51);
}