// Classes
class Boid {
  constructor () {
    const startingVelocity = random(2, 5);

    this.id = boidId ++;
    
    this.pos = Vector2.randomPos().mult(canvas.v);
    this.vel = Vector2.random().setMag(startingVelocity);
    this.acc = Vector2.zero();

    this.maxForce = 0.2;
    this.maxSpeed = 5;

    this.gang = null;
  }

  static setupDraw () { noFill(); stroke(colors.white); strokeWeight(1); }

  step () {
    // Find new direction.
    let locals = this.getLocal();
    this.flock(locals); // Flock to neighbors.
    
    // Calculation
    this.pos.add(this.vel); // Move according to velocity.

    this.vel.add(this.acc); // Speed up according to acceleration.
    this.vel.limit(this.maxSpeed); // Break if above max speed.

    this.acc = Vector2.zero(); // Reset acceleration.

    // Teleport around edges
    if (this.pos.x > canvas.w) this.pos.x = 0;
    else if (this.pos.x < 0) this.pos.x = canvas.w;

    if (this.pos.y > canvas.h) this.pos.y = 0;
    else if (this.pos.y < 0) this.pos.y = canvas.h;
  }

  flock (locals) {
    let vals = [
      this.align(locals),
      this.cohere(locals),
      this.separate(locals),
    ];

    for (let v of vals) this.acc.add(v);
  }

  align (locals) {
    if (locals.length > 0) {
      return locals
        .reduce((total, local) => total.add(local.vel), Vector2.zero())
        .div(locals.length)
        .setMag(this.maxSpeed)
        .sub(this.vel)
        .limit(this.maxForce);
    }

    return Vector2.zero();
  }

  cohere (locals) {
    // Returns steering towards the average position of neighbors.
    
    if (locals.length > 0) return locals
      .reduce((total, local) => total.add(local.pos), Vector2.zero())
      .div(locals.length)
      .sub(this.pos)
      .setMag(this.maxSpeed)
      .sub(this.vel)
      .limit(this.maxForce);

    return Vector2.zero();
  }

  separate (locals) {
    if (locals.length > 0) return locals
        .reduce((total, local) => (
          total.add(
            this.pos.copy() // Get position
              .sub(local.pos) // Subtract other position
              .div( Math.pow( this.pos.dist(local.pos), 2 ) ) // Divide by distance squared.
          )
        ), Vector2.zero())
        .div(locals.length) // Average
        .setMag(this.maxSpeed) // Set to speed.
        .sub(this.vel) // Subtract current velocity.
        .limit(this.maxForce); // Limit to maxForce
    
    return Vector2.zero();
  }

  draw () {
    const triSize = 10;
    let height = Math.sqrt( Math.pow(triSize * 2, 2) - (Math.pow(triSize, 2) / 4) ) / 2;
    let width = triSize / 2;

    push(); translate(this.pos.x, this.pos.y); rotate(this.vel.angle + HALF_PI);

    triangle(0, -height, -width, height, width, height);

    pop();

    if (options.draw.boid.vel) {
      stroke(colors.green); strokeWeight(1);

      let big = this.vel.copy().mult(options.draw.boid.velMult).add(this.pos);

      line( this.pos.x, this.pos.y, big.x, big.y );

      Boid.setupDraw();
    }

    if (options.draw.boid.sight) {
      noFill(); stroke(colors.white); strokeWeight(1);

      circle(this.pos.x, this.pos.y, options.boid.sight * 2);

      Boid.setupDraw();
    }

    if (options.draw.boid.locals) {
      noFill(); stroke(colors.blue); strokeWeight(1);

      let locals = this.getLocalManual();

      for (let local of locals) line(this.pos.x, this.pos.y, local.pos.x, local.pos.y);

      Boid.setupDraw();
    }
  }

  getLocalManual () {
    let localBoids = boids.filter(other => (
      (other !== this) &&
      (this.pos.dist(other.pos) <= options.boid.sight)
    ));

    return localBoids;
  }

  getLocal () {
    let range = new Circle(this.pos.copy(), options.boid.sight);

    return tree.query(range)
      .filter(other => other.id !== this.id);
  }
}

// Globals
let canvas = {
  e: null, // Canvas element

  w: null, // Canvas width
  h: null, // Canvas height

  v: null, // Canvas size Vector2
};

let options = {
  boid: {
    sight: 50,
    amount: 500,
  },

  draw: {
    boid: {
      vel: false,
      velMult: 10,

      sight: false,

      locals: false,
    }
  }
}

let colors = {};

let boids = [];

let boidId = 0;
let tree;

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

  for (let i = 0; i < options.boid.amount; i ++) boids.push(new Boid());
}

function draw () {
  // Clearing
  background(colors.black);

  // Calculations
  tree = new QuadTree(
    new Rect( Vector2.zero(), canvas.v.copy() ),
    4,
    (boid => boid.pos)
  );
  boids.forEach(boid => tree.insert(boid));

  for (let boid of boids) boid.step();

    // If there are too many/few boids, remove/add more.
  if (boids.length !== options.boid.amount) {
    let diff = boids.length - options.boid.amount;

    if (diff > 0) {
      for (let i = 0; i < diff; i ++) boids.pop();
    } else if (diff < 0) {
      for (let i = 0; i < -diff; i ++) boids.push(new Boid());
    }
  }

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