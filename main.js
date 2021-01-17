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
    this.inputs_color = [3, 218, 198];
    this.outputs_color = [187, 134, 252];
    this.rotateFactor = 3;
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
    // Add inputs:
    // edge case where there's only one input
    if (this.inputs == 1) {
      
      this.corners[0] = [this.x, this.y + this.height / 2, this.width/4];
    }
    else {
      for (var i = 0; i < this.inputs; ++i) {
        
        this.corners[i] = [this.x, this.y + i * this.height / (this.inputs - 1), this.width/4];
      }
    }

    // Add outputs:
    fill(this.outputs_color[0], this.outputs_color[1], this.outputs_color[2]);
    if (this.outputs == 1) {
     
      this.corners[this.inputs] = [this.x + this.width, this.y + this.height / 2, this.width/4];
    }
    else {
      for (var i = 0; i < this.outputs; ++i) {
        
        this.corners[i + this.inputs] = [this.x + this.width, this.y + i * this.height / (this.outputs - 1), this.width/4];
      }
    }

    // rotate box
    if (this.rotateFactor >= 0){
      for (let blank = 0; blank <= this.rotateFactor % 4; blank++ ){
        for (let corner_idx in this.corners) {
          let center = [this.x + this.corners[corner_idx][2]*2, this.y + this.corners[corner_idx][2]*2]
          let x1 = this.corners[corner_idx][0] - center[0];
          let y1 = this.corners[corner_idx][1] - center[1];

          let x2 =  - y1;
          let y2 = x1;

          this.corners[corner_idx][0] = x2 + center[0];
          this.corners[corner_idx][1] = y2 + center[1];
        }
      }
    }

    // Color inputs
    fill(this.inputs_color[0], this.inputs_color[1], this.inputs_color[2]);
    for (var i = 0; i < this.inputs; ++i) {
      ellipse(this.corners[i][0], this.corners[i][1], this.width/4);
    }

    // Color outputs
    fill(this.outputs_color[0], this.outputs_color[1], this.outputs_color[2]);
    for (var i = this.inputs; i < this.inputs + this.outputs; ++i) {
      ellipse(this.corners[i][0], this.corners[i][1], this.width/4);
    }
  
    // Description text
    textAlign(CENTER, CENTER);
    fill(this.text_color[0],this.text_color[1],this.text_color[2]);
    textSize(this.text_size);

    let margin = this.width / 8;
    // fix dumb hyphenated text wrapping for words
    let lines_arr = [];
    var current_line = "";
    for (var word of this.description.split(' ')) {
      let new_line = current_line == "" ? word : (current_line + " " + word);
      if (textWidth(new_line) <= this.width - margin * 2) {
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
      text(lines_arr[i], this.x + margin, container_top + height_offset * i, this.width - margin * 2, this.text_size);
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
    document.getElementById("problemH1").innerText = levelSelector.currentLevel
    document.getElementById("problemText").innerText = levelSelector.levelCollection.levelsText[levelSelector.currentLevel]
    this.addButtons()
  }

  addButtons() {
    this.GUIarray = []
    
    // this is a bait! It validates instead.
    let startButton = document.createElement('button');
    startButton.textContent = "Validate"
    startButton.className = 'btn btn-primary'
    startButton.style = "position: absolute;top:50px; left:200px"
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
    aboutButton.className = 'btn btn-primary'
    aboutButton.style = "position: absolute;top:50px; left:350px"
    document.getElementById("rightCol").appendChild(aboutButton)
    aboutButton.onclick = this.showAbout.bind(this)

    let removeEdges = document.createElement('button');
    removeEdges.textContent = "Remove Edges"
    removeEdges.className = 'btn btn-primary'
    removeEdges.style = "position: absolute;top:50px; left:460px"
    document.getElementById("rightCol").appendChild(removeEdges)
    removeEdges.onclick = this.removeAllEdges.bind(this)

    this.GUIarray.push(startButton)
    this.GUIarray.push(aboutButton)
    this.GUIarray.push(removeEdges)
  }

  startGame(thi) {
    
    let adj_list = levelSelector.levelCollection.levels[levelSelector.currentLevel]
    alert(validatePuzzle(adj_list));
    // console.log("bruh")
    // this.removeAllButtons()
    // clear()
    // START_GAME_FLAG = 1;
    // background(70);
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
let saved_mouse_position = null;

function validatePuzzle(expectedResults){
  // compare adjaceny lits!
  // Go through each node in the expected list
  for (node in expectedResults) {
    // Find box that matches this description
    let current_box = null;
    for (box of boxes) {
      if (box.description == node) {
        current_box = box;
        break;
      }
    }
    // Check whether the connections from this box match the solution's adjacency list
    // Check output connections
    for (connection of expectedResults[node][1]) {
      // Make sure that each output connection is connected from this box
      key_is_in_box_connections = false;
      for (box_conn of current_box.edgeConnections) {
        // Only check output nodes
        if (!current_box.is_input(box_conn) && box_conn[0].description == connection) {
          // There is a connection that matches
          key_is_in_box_connections = true;
          break;
        }
      }
      if (!key_is_in_box_connections) {
        // If nothing matches return false
        return "not valid"
        
      }
    }
  }
  return "valid!"
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
    Problems
  </button>
  <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton">
    ${linkText}
  </ul>`
    let adj_list = this.levelCollection.levels[this.currentLevel]
    add_boxes_from_graph(adj_list);
    selectElm.style = "position: absolute;top:50px; left:52px"

    document.getElementById("rightCol").appendChild(selectElm)

    for (let i in this.levelCollection.levels){
      document.getElementById(i).onclick = this.changeLevel(i).bind(this)
    }
  }

  // changes a given level!
  changeLevel(levelID) {
    return function ()  {
      console.log("time to change level!",levelID)
      this.currentLevel = levelID
      let adj_list = this.levelCollection.levels[this.currentLevel];
      boxes = [];
      add_boxes_from_graph(adj_list);
      document.getElementById("problemH1").innerText = this.currentLevel
      document.getElementById("problemText").innerText = this.levelCollection.levelsText[levelID]
      // change problem text and current level!
    }

  }
}

function preload(){
  song = loadSound('polish_cow.mp3');
}

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
}

function add_boxes_from_graph(adj) {
  // Loop through each node
  for (node in adj) {
    boxes.push(new DraggableBox(200, 200, 150, 150, node, adj[node][0].length, adj[node][1].length));
  }
  // Shuffle array
  shuffleArray(boxes);

  // Calculate total height
  y_pos = 0;
  x_pos = height / 16;
  for (i in boxes) {
    if (i != 0 && x_pos + boxes[i].width + height / 16 > width) {
      y_pos += boxes[i].height + height / 16;
      x_pos = height / 16;
    }
    x_pos += boxes[i].width + height / 16;
  }
  total_height = y_pos + boxes[boxes.length - 1].height;

  // Add boxes to play area in a nice grid type pattern thingy
  y_pos = height / 2 - total_height / 2;
  x_pos = height / 16;
  for (i in boxes) {
    if (i != 0 && x_pos + boxes[i].width + height / 16 > width) {
      y_pos += boxes[i].height + height / 16;
      x_pos = height / 16;
      boxes[i].x = x_pos;
      boxes[i].y = y_pos;
    }
    else {
      boxes[i].x = x_pos;
      boxes[i].y = y_pos;
    }
    x_pos += boxes[i].width + height / 16;
  }

  // Failsafe, make sure that all the boxes are still on the screen
  for (box of boxes) {
    if (box.x + box.width > width) {
      box.x = width - box.width;
    }
    if (box.y + box.height > height) {
      box.y = height - box.height;
    }
  }
}


  


function setup() {
  let canvasElm = createCanvas(document.getElementById("canvasElm").offsetWidth, windowHeight);
  canvasElm.parent("canvasElm")
  levelSelector = new SelectorGUI()
  song.play()
  mainGUI = new GUI()

  background(0);
  // boxes.push(new DraggableBox(200, 200, 100, 100, "Output", 1, 3));
  // boxes.push(new DraggableBox(200, 200, 100, 100, "Sort one half", 4, 1));
  // boxes.push(new DraggableBox(200, 200, 100, 100, "Sort the other half", 2, 2));

  
  
}



function draw() {
  // Clear screen
  clear();
  background(5);

  // Check if mouse is over one of the elements
  if (current_box != null) {
    // update box position
    // make sure our movement is within boundry
    if (mouseX - current_offset[0] > 0 && mouseX - current_offset[0] + current_box.width < width ) {
      if (mouseY - current_offset[1] > 0 && mouseY - current_offset[1] + current_box.height < height ) {
      
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

  // Check if mouse moved
  if (saved_mouse_position != null && (saved_mouse_position[0] != mouseX || saved_mouse_position[1] != mouseY)) {
    saved_mouse_position = null;
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
        // Update saved mouse position
        saved_mouse_position = [mouseX, mouseY];
        boxes[i].set_text_color([0,200,200]);
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
            // Save the from_box in case the index changes when we remove an edge
            from_box = boxes[i];

            // Check that this corner doesn't already have a connection
            for (connection in boxes[i].edgeConnections) {
              if (corner == boxes[i].edgeConnections[connection][1]) {
                // find the corner that this is connected to
                other_corner = [boxes[i].edgeConnections[connection][0], boxes[i].edgeConnections[connection][2]];
                // Disconnect this connection
                boxes[i].edgeConnections.splice(connection, 1);
                for (i in other_corner[0].edgeConnections) {
                  if (other_corner[0].edgeConnections[i][1] == other_corner[1]) {
                    other_corner[0].edgeConnections.splice(i, 1);
                  }
                }
                break;
              }
            }

            // End the connection at this corner of this box
            current_corner[0].edgeConnections.push([from_box, current_corner[1], corner]);
            from_box.edgeConnections.push([current_corner[0], corner, current_corner[1]]);
            current_corner = null;
            return;
          }
        }
      }
    }
    current_corner = null;
  }
  if (current_box != null) {
    if (saved_mouse_position != null) {
      current_box.rotateFactor += 1;
    }
    current_box.set_text_color([200,220,220]);
    current_box = null;
    current_offset = null;
  }
}

function windowResized() {
  resizeCanvas(document.getElementById("canvasElm").offsetWidth, windowHeight);
  // Make sure that all the boxes are still on the screen
  for (box of boxes) {
    if (box.x + box.width > width) {
      box.x = width - box.width;
    }
    if (box.y + box.height > height) {
      box.y = height - box.height;
    }
  }
  clear();
  background(51);
}
