let START_GAME_FLAG = 0

class DraggableBox {
  constructor(x, y, width, height, description, color) {
    this.edgeConnections = []
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.description = description;
    this.color = color;
    this.text_color = [0,0,0];
  }

  // TODO: draw a line from one object to another for all the edgeConnections
  drawPath() {
    // prob can do some cool algorithm here

  }
  set_text_color(color) {
    this.text_color = color;
  }

  is_inside(x, y) {
    return x <= this.x + this.width && y <= this.y + this.height && x >= this.x && y >= this.y;
  }

  get_corners(){

  }
  draw() {
    fill(this.color[0],this.color[1],this.color[2]);
    rect(this.x, this.y, this.width, this.height, 10);
    //connectable components
    ellipse(this.x, this.y, this.width/4)
    ellipse(this.x+this.width, this.y, this.width/4)
    ellipse(this.x+this.width, this.y+this.height, this.width/4)
    ellipse(this.x, this.y+this.height, this.width/4)
    textAlign(CENTER, CENTER);
    fill(this.text_color[0],this.text_color[1],this.text_color[2]);
    text(this.description, this.x, this.y, this.width, this.height);
  }
}

class GUI {
  constructor() {
    this.addButtons()
  }

  addButtons() {
    this.GUIarray = []
    let startButton = createButton('Start Game');

    startButton.position(windowWidth / 2, windowHeight / 2);
    startButton.mousePressed(this.startGame.bind(this))
    startButton.style('color',"rgb(225, 227, 198)")
    startButton.style('background-color','transparent')
    startButton.style('border-color','antiquewhite')
    startButton.style('padding','1%')
    let aboutButton = createButton('About');

    aboutButton.position(windowWidth / 2 + 150, windowHeight / 2);
    
    aboutButton.mousePressed(this.showAbout.bind(this))
    aboutButton.style('color',"rgb(225, 227, 198)")
    aboutButton.style('background-color','transparent')
    aboutButton.style('border-color','antiquewhite')
    aboutButton.style('padding','1%')
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
    window.location = "about.html"
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

let boxes = [];
let song;
current_box = null;
current_offset = null;

function preload(){
  song = loadSound('polish_cow.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  song.play()
  mainGUI = new GUI()

  background(0);
  boxes.push(new DraggableBox(200, 200, 80, 80, "test", [255,255,255]));
  boxes.push(new DraggableBox(200, 200, 80, 80, "test", [255,255,255]));
}



function draw() {
  // Clear screen
  clear();
  background(5);

  // Check if mouse is over one of the elements
  if (current_box != null) {
    // update box position
    current_box.x = mouseX - current_offset[0];
    current_box.y = mouseY - current_offset[1];
  }

  for (thing of boxes) {
    thing.draw();
  }


  //ellipse(mouseX, mouseY, 40, 40);
}

function mousePressed() {
  // Check if mouse is over one of the elements
  for (var i = boxes.length - 1; i >= 0; --i) {
    if (boxes[i].is_inside(mouseX, mouseY)) {
      // TODO: check if mouse is over one of the connections
      current_box = boxes[i];
      current_offset = [mouseX - boxes[i].x, mouseY - boxes[i].y];
      boxes[i].set_text_color([255,0,0]);
      break;
    }
  }
  //boxes.push(new DraggableBox(mouseX, mouseY, 80, 80, "test", [255,255,255]));
}

function mouseReleased() {
  if (current_box != null) {
    current_box.set_text_color([0,0,0]);
    current_box = null;
    current_offset = null;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  clear();
  background(51);
}