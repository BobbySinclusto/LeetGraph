function setup() {
  
  createCanvas(windowWidth, windowHeight,renderer=WEBGL);
  background(51);
}

function draw() {
  if (mouseIsPressed) {
    clear();
    background(51);
  }

  box(50);
}

function windowResized() { 
  resizeCanvas(windowWidth, windowHeight);
  clear();
  background(51);
} 
