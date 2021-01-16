let START_GAME_FLAG = 0

//maintain levels of the game
class GameLevels {

  constructor(){
    // gets level and an id assosiated with it
    this.levelsText = {}
    this.levels = {}
  }
  // add a level
  addLevel(adj,id,txt){
    this.levels[id] = adj
    this.levelsText[id] = txt
  }
  // get a level by id
  getLevelatId(id) {
    return this.levels[id]
  }
  // a an array of ids 
  getAllIds(){
    return Object.keys(this.levels)
  }



}

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
    this.text_size = 15;
  }

  set_text_color(color) {
    this.text_color = color;
  }

  is_inside(x, y) {
    return x <= this.x + this.width && y <= this.y + this.height && x >= this.x && y >= this.y;
  }

  is_input(corner) {
    return corner < this.inputs;
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
    textSize(this.text_size);
    // fix dumb hyphenated text wrapping for words
    let lines_arr = [];
    var current_line = "";
    for (var word of this.description.split(' ')) {
      let new_line = current_line == "" ? word : (current_line + " " + word);
      if (textWidth(new_line) <= this.width - this.width/8) {
        current_line = new_line;
      }
      else {
        lines_arr.push(current_line);
        current_line = word;
      }
    }
    lines_arr.push(current_line);

    let height_offset = 1.1 * this.text_size;
    let total_height = height_offset * (lines_arr.length - 1) + this.text_size;
    let container_top = this.y + this.height / 2 - total_height / 2;

    for (i in lines_arr) {
      text(lines_arr[i], this.x + this.width / 16, container_top + height_offset * i, this.width - this.width / 8, this.text_size);
    }

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
    
    let startButton = document.createElement('button');
    startButton.textContent = "Start Game"
    startButton.style = "position: absolute;top:20px;"
    startButton.onclick = this.startGame.bind(this)
    document.getElementById("rightCol").appendChild(startButton)
    
    this.styledict = {
      'color': "rgb(225, 227, 198)",
      'background-color':'transparent',
      'border-color':'antiquewhite',
      'padding':'1%'
    }
    for (let key in this.styledict) {
      //startButton.style(key,this.styledict[key])
    }

    let aboutButton = document.createElement('button');
    aboutButton.textContent = "About"
    aboutButton.style = "position: absolute;top:40px;"
    document.getElementById("rightCol").appendChild(aboutButton)
    aboutButton.onclick = this.showAbout.bind(this)

    let removeEdges = document.createElement('button');
    removeEdges.textContent = "Remove Edges"
    removeEdges.style = "position: absolute;top:60px;"
    document.getElementById("rightCol").appendChild(removeEdges)
    removeEdges.onclick = this.removeAllEdges.bind(this)

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

function validatePuzzle(expectedResults){

    // compare adjaceny lits!
    // TODO: build adj list of boxes
    for (let res in expectedResults){
      for (let val of expectedResults[res]){
        if (not (val in adj[res])){
          return False
        }
      } 
    }
    return True
}

class SelectorGUI {

  constructor(){
    // create an instance of all levels
    this.levelCollection = new GameLevels();
    
    for (let i in all_levels) {
      this.levelCollection.addLevel(all_levels[i][0] , i , all_levels[i][1])
    }
    let linkText = ""
    for (let i in this.levelCollection.levels){
      linkText += `<li><a id="${i}" class="dropdown-item" href="#" >${i}</a></li>\n`
    }
    this.currentLevel = "Problem 1"
    let selectElm = document.createElement('div');
    selectElm.className = `dropdown`
    selectElm.innerHTML = ` <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
    Dropdown button
  </button>
  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
    ${linkText}
  </ul>`

    selectElm.style = "position: absolute;top:20px;"

    document.getElementById("yesover").appendChild(selectElm)

    for (let i in this.levelCollection.levels){
      document.getElementById(i).onclick = this.changeLevel(i).bind(this)
    }
  }

  // changes a given level!
  changeLevel(levelID) {
    return function ()  {
      console.log("time to change level!",levelID)
      this.currentLevel = levelID
      document.getElementById("problemH1").innerText = this.currentLevel
      document.getElementById("problemText").innerText = this.levelCollection.levelsText[levelID]
      // change problem text and current level!
    }

  }
}

function preload(){
  song = loadSound('polish_cow.mp3');
}

function add_boxes_from_graph(adj) {
  // Loop through each node
  for (node in adj) {
    boxes.push(new DraggableBox(200, 200, 100, 100, node, adj[node][0].length, adj[node][1].length));
  }
}

function setup() {
  let canvasElm = createCanvas(windowWidth, windowHeight);
  canvasElm.parent("canvasElm")
  levelSelector = new SelectorGUI()
  song.play()
  mainGUI = new GUI()

  background(0);
  // boxes.push(new DraggableBox(200, 200, 100, 100, "Output", 1, 3));
  // boxes.push(new DraggableBox(200, 200, 100, 100, "Sort one half", 4, 1));
  // boxes.push(new DraggableBox(200, 200, 100, 100, "Sort the other half", 2, 2));

  // Temporary debugging
  add_boxes_from_graph(level1);
  
}



function draw() {
  // Clear screen
  clear();
  background(5);

  // Check if mouse is over one of the elements
  if (current_box != null) {
    // update box position
    // make sure our movement is within boundry
    if (mouseX - current_offset[0] > 0 && mouseX - current_offset[0] + current_box.width < windowWidth ) {
      if (mouseY - current_offset[1] > 0 && mouseY - current_offset[1] + current_box.height < windowHeight ) {
      
          current_box.x = mouseX - current_offset[0];
          current_box.y = mouseY - current_offset[1];
      }
    }
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
}

function mousePressed() {
  // Check if mouse is over one of the elements
  for (var i = boxes.length - 1; i >= 0; --i) {
    // check corners
    let corner = boxes[i].check_corners();
    if (corner != -1) {
      // Check that this corner doesn't already have a connection
      for (connection in boxes[i].edgeConnections) {
        if (corner == boxes[i].edgeConnections[connection][1]) {
          // Update current corner to the corner this is connected to
          current_corner = [boxes[i].edgeConnections[connection][0], boxes[i].edgeConnections[connection][2]];
          // Disconnect this connection
          boxes[i].edgeConnections.splice(connection, 1);
          for (i in current_corner[0].edgeConnections) {
            if (current_corner[0].edgeConnections[i][1] == current_corner[1]) {
              current_corner[0].edgeConnections.splice(i, 1);
            }
          }
          return;
        }
      }
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
}

function mouseReleased() {
  if (current_corner != null) {
    for (var i = boxes.length - 1; i >= 0; --i) {
      if (current_corner[0] !== boxes[i]) {
        // check corners
        let corner = boxes[i].check_corners();
        if (corner != -1) {
          // Check to make sure this is input->output or vice versa
          if ((current_corner[0].is_input(current_corner[1]) && !boxes[i].is_input(corner)) || (!current_corner[0].is_input(current_corner[1]) && boxes[i].is_input(corner))) {
            // End the connection at this corner of this box
            current_corner[0].edgeConnections.push([boxes[i], current_corner[1], corner]);
            boxes[i].edgeConnections.push([current_corner[0], corner, current_corner[1]]);
            current_corner = null;
            return;
          }
          
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