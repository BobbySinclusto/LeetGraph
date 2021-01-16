function setup() {
  
  createCanvas(windowWidth, windowHeight);
  background(51);
}

function draw() {
  if (mouseIsPressed) {
    clear();
    background(51);
  } 
  ellipse(mouseX, mouseY, 40, 40);
}

function windowResized() { 
  resizeCanvas(windowWidth, windowHeight);
  clear();
  background(51);
} 