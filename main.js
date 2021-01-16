class DraggableBox {
  constructor(x, y, width, height, description, color) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.description = description;
    this.color = color;
    this.text_color = [0,0,0];
  }

  set_text_color(color) {
    this.text_color = color;
  }

  is_inside(x, y) {
    return x <= this.x + this.width && y <= this.y + this.height && x >= this.x && y >= this.y;
  }

  draw() {
    fill(this.color[0],this.color[1],this.color[2]);
    rect(this.x, this.y, this.width, this.height, 10);
    textAlign(CENTER, CENTER);
    fill(this.text_color[0],this.text_color[1],this.text_color[2]);
    text(this.description, this.x, this.y, this.width, this.height);
  }
}

let boxes = [];
current_box = null;
current_offset = null;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(51);
  boxes.push(new DraggableBox(200, 200, 80, 80, "test", [255,255,255]));
  boxes.push(new DraggableBox(200, 200, 80, 80, "test", [255,255,255]));
}

function draw() {
  // Clear screen
  clear();
  background(51);

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
