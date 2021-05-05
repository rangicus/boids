// Classes
class Boid {
  constructor () {
    const startingVelocity = random(2, 5);

    this.id = boidId ++;
    
    this.pos = Vector2.random().mult(canvas.v);
    this.vel = Vector2.random().setMag(startingVelocity);
    this.acc = Vector2.zero();

    this.maxForce = 0.2;
    this.maxSpeed = 5;

    this.gang = null;
  }

  static setupDraw () { noFill(); stroke(colors.white); strokeWeight(1); }

  step () {
    this.pos.add(this.vel);

    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);

    this.acc = Vector2.zero();

    if (this.pos.x > canvas.w) this.pos.x = 0;
    else if (this.pos.x < 0) this.pos.x = canvas.w;

    if (this.pos.y > canvas.h) this.pos.y = 0;
    else if (this.pos.y < 0) this.pos.y = canvas.h;
  }

  draw () {
    const triSize = 10;
    let height = Math.sqrt( Math.pow(triSize * 2, 2) - (Math.pow(triSize, 2) / 4) ) / 2;
    let width = triSize / 2;

    push(); translate(this.pos.x, this.pos.y); rotate(this.vel.angle + 1.5708);

    triangle(0, -height, -width, height, width, height);

    pop();
  }
}

// Globals
let canvas = {
  e: null, // Canvas element

  w: null, // Canvas width
  h: null, // Canvas height

  v: null, // Canvas size Vector2
};

let colors = {};

let boids = [];

let boidId = 0;

const BOID_AMOUNT = 25;

// p5 Functions
function setup () {
  // Canvas
  canvas.e = createCanvas();
  canvas.e.parent(`container`);
  windowResized();

  // Variables
  colors = {
    black: color(0),
    gray: color(128),
    white: color(255),

    green: color(0, 255, 0),
    blue: color(0, 0, 255),
    red: color(255, 0, 0),
  }

  for (let i = 0; i < BOID_AMOUNT; i ++) boids.push(new Boid());
}

function draw () {
  // Clearing
  background(colors.black);

  // Calculations
  for (let boid of boids) boid.step();

  // Drawing
  Boid.setupDraw();
  for (let boid of boids) boid.draw();
}

function windowResized () {
  const size = { w: window.innerWidth, h: window.innerHeight };

  canvas.w = size.w;
  canvas.h = size.h;
  canvas.v = new Vector2(canvas.w, canvas.h);

  resizeCanvas(size.w, size.h);
}