let START_GAME_FLAG = 0

class DraggableBox {
  constructor(x, y, width, height, description, inputs = 2, outputs = 2) {
    this.edgeConnections = [];
    this.corners = [];
    // Initialize corners array
    for (var i = 0; i < inputs + outputs; ++i) {
      this.corners.push(null);
    }
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.description = description;
    this.color = [30, 40, 40];
    this.text_color = [200,220,220];
    this.inputs = inputs;
    this.outputs = outputs;
  }

  set_text_color(color) {
    this.text_color = color;
  }

  is_inside(x, y) {
    return x <= this.x + this.width && y <= this.y + this.height && x >= this.x && y >= this.y;
  }

  remove_all_edge_connections(){
    this.edgeConnections = []
  }
   
  check_corners() {
    // Check which corner the mouse is clicking, or if it's clicking in the middle somewhere
    // First check the corners
    for (var corner in this.corners) {
      if (corner != null && (mouseX - this.corners[corner][0])**2 + (mouseY - this.corners[corner][1])**2 <= (this.corners[corner][2] / 2)**2) {
        return corner;
      }
    }
    // Didn't find a corner
    return -1;
  }

  get_corner_location(corner) {
    return [this.corners[corner][0], this.corners[corner][1]];
  }

  draw() {
    // Draw boxes
    fill(this.color[0],this.color[1],this.color[2]);
    rect(this.x, this.y, this.width, this.height, 10);

    //connectable components
    // Color to draw the corners:
    fill(50, 150, 255);

    // Add inputs:
    // edge case where there's only one input
    if (this.inputs == 1) {
      ellipse(this.x, this.y + this.height / 2, this.width/4);
      this.corners[0] = [this.x, this.y + this.height / 2, this.width/4];
    }
    else {
      for (var i = 0; i < this.inputs; ++i) {
        ellipse(this.x, this.y + i * this.height / (this.inputs - 1), this.width/4);
        this.corners[i] = [this.x, this.y + i * this.height / (this.inputs - 1), this.width/4];
      }
    }

    // Add outputs:
    if (this.outputs == 1) {
      ellipse(this.x + this.width, this.y + this.height / 2, this.width/4);
      this.corners[this.inputs] = [this.x + this.width, this.y + this.height / 2, this.width/4];
    }
    else {
      for (var i = 0; i < this.outputs; ++i) {
        ellipse(this.x + this.width, this.y + i * this.height / (this.outputs - 1), this.width/4);
        this.corners[i + this.inputs] = [this.x + this.width, this.y + i * this.height / (this.outputs - 1), this.width/4];
      }
    }

    // Description text
    textAlign(CENTER, CENTER);
    fill(this.text_color[0],this.text_color[1],this.text_color[2]);
    text(this.description, this.x, this.y, this.width, this.height);

    // Draw connections
    for (var connection of this.edgeConnections) {
      let fromLoc = this.get_corner_location(connection[1]);
      let toLoc = connection[0].get_corner_location(connection[2]);
      
      // Thicker line first
      stroke(50, 50, 255);
      strokeWeight(10);
      line(fromLoc[0], fromLoc[1], toLoc[0], toLoc[1]);
      // Thinner line next
      stroke(50, 150, 255);
      strokeWeight(5);
      line(fromLoc[0], fromLoc[1], toLoc[0], toLoc[1]);

      // Reset stroke stuff
      stroke(0);
      strokeWeight(1);
    }
  }
}

class GUI {
  constructor() {
    this.addButtons()
  }

  addButtons() {
    this.GUIarray = []
    let startButton = createButton('Start Game');
    this.styledict = {
      'color': "rgb(225, 227, 198)",
      'background-color':'transparent',
      'border-color':'antiquewhite',
      'padding':'1%'
    }
    startButton.position(windowWidth / 2, windowHeight / 2);
    startButton.mousePressed(this.startGame.bind(this))
    for (let key in this.styledict) {
      startButton.style(key,this.styledict[key])
    }
    let aboutButton = createButton('About');
    aboutButton.position(windowWidth / 2 + 150, windowHeight / 2);
    aboutButton.mousePressed(this.showAbout.bind(this))
    for (let key in this.styledict) {
      aboutButton.style(key,this.styledict[key])
    }
    let removeEdges = createButton('Remove All Edges');
    removeEdges.position(windowWidth / 2 + 250, windowHeight / 2);
    removeEdges.mousePressed(this.removeAllEdges.bind(this))
    for (let key in this.styledict) {
      removeEdges.style(key,this.styledict[key])
    }
    this.GUIarray.push(startButton)
    this.GUIarray.push(aboutButton)
    this.GUIarray.push(removeEdges)
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

  removeAllEdges(){
    if (boxes){
      for (let box of boxes){
        box.remove_all_edge_connections()
      }
    }
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
current_corner = null;

let levelSelector;


function mySelectEvent() {
  let item = levelSelector.value();
  background(200);
  text('It is a ' + item + '!', 50, 50);
}

function selectLevel(){
  textAlign(CENTER);
  levelSelector = createSelect();
  levelSelector.position(10, 10);
  levelSelector.option('1');
  levelSelector.option('2');
  levelSelector.option('3');
  levelSelector.selected('1');
  levelSelector.changed(mySelectEvent);
}

function preload(){
  song = loadSound('polish_cow.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  selectLevel()
  song.play()
  mainGUI = new GUI()

  background(0);
  boxes.push(new DraggableBox(200, 200, 80, 80, "Bob", 1, 3));
  boxes.push(new DraggableBox(200, 200, 80, 80, "Joey", 4, 1));
  boxes.push(new DraggableBox(200, 200, 80, 80, "asdf", 2, 2));
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

  // Draw current connection if there is one
  if (current_corner != null) {
    // Start at whichever corner is selected
    loc = current_corner[0].get_corner_location(current_corner[1]);
    
    // Thicker line first
    stroke(50, 50, 255);
    strokeWeight(10);
    line(loc[0],loc[1], mouseX, mouseY);
    // Thinner line next
    stroke(50, 150, 255);
    strokeWeight(5);
    line(loc[0],loc[1], mouseX, mouseY);

    // Reset
    stroke(0);
    strokeWeight(1);
  }


  //ellipse(mouseX, mouseY, 40, 40);
}

function mousePressed() {
  // Check if mouse is over one of the elements
  for (var i = boxes.length - 1; i >= 0; --i) {
    // check corners
    let corner = boxes[i].check_corners();
    if (corner != -1) {
      // Store corner that this connection is coming from
      current_corner = [boxes[i], corner];
    }
    else {
      if (boxes[i].is_inside(mouseX, mouseY)) {
        current_box = boxes[i];
        current_offset = [mouseX - boxes[i].x, mouseY - boxes[i].y];
        boxes[i].set_text_color([180,200,200]);
        break;
      }
    }
  }
  //boxes.push(new DraggableBox(mouseX, mouseY, 80, 80, "test", [255,255,255]));
}

function mouseReleased() {
  if (current_corner != null) {
    for (var i = boxes.length - 1; i >= 0; --i) {
      if (current_corner[0] !== boxes[i]) {
        // check corners
        let corner = boxes[i].check_corners();
        if (corner != -1) {
          // End the connection at this corner of this box
          current_corner[0].edgeConnections.push([boxes[i], current_corner[1], corner]);
          boxes[i].edgeConnections.push([current_corner[0], corner, current_corner[1]]);
          current_corner = null;
          return;
        }
      }
    }
    current_corner = null;
  }
  if (current_box != null) {
    current_box.set_text_color([200,220,220]);
    current_box = null;
    current_offset = null;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  clear();
  background(51);
}