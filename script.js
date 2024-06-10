const BOUNDARY_X_MIN = 0;
const BOUNDARY_X_MAX = 1200;
const BOUNDARY_Y_MIN = 0;
const BOUNDARY_Y_MAX = 650;
const MAX_BALL_COUNT = 50;
const BALL_MIN_RADIUS = 5;
const BALL_MAX_RADIUS = 20;

// x => x_position of circle's box
// y => y_position of circle's box
// h => height of circle's box
// w => width of circle's box
//dy and dx gives the direction
class Ball {
  constructor(x = 0, y = 0, radius = BALL_MIN_RADIUS) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.h = this.radius * 2;
    this.w = this.radius * 2;
    this.color = getRandomColor();

    this.mass = this.radius; // mass proportional to radius so easy comparison

    this.dy = Math.random() > 0.5 ? 1 : -1;
    this.dx = Math.random() > 0.5 ? 1 : -1;
    this.speed = getRandomInt(1, 4);
    this.xVelocity = this.dx * this.speed;
    this.yVelocity = this.dy * this.speed;

    this.element = document.createElement("div");
    this.element.style.backgroundColor = this.color;
    this.element.style.top = `${this.y}px`;
    this.element.style.left = `${this.x}px`;
    this.element.style.height = `${this.h}px`;
    this.element.style.width = `${this.w}px`;
    this.element.style.borderRadius = "50%";
    this.element.style.position = "absolute";
  }

  moveBall() {
    this.x += this.xVelocity;
    this.y += this.yVelocity;

    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }

  handleWallCollision() {
    //for vertical walls
    if (this.y >= BOUNDARY_Y_MAX - this.h) {
      this.y = BOUNDARY_Y_MAX - this.h;
      this.yVelocity *= -1;
    } else if (this.y <= 0) {
      this.y = 0;
      this.yVelocity *= -1;
    }
    //for horizontal walls
    if (this.x >= BOUNDARY_X_MAX - this.w) {
      this.x = BOUNDARY_X_MAX - this.w;
      this.xVelocity *= -1;
    } else if (this.x <= 0) {
      this.x = 0;
      this.xVelocity *= -1;
    }
  }

  handleBallCollision(ballArray) {
    ballArray.forEach((ball) => {
      if (ball !== this) {
        const xDistance = ball.x + ball.radius - (this.x + this.radius);
        const yDistance = ball.y + ball.radius - (this.y + this.radius);
        const distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
        const radiusDistance = this.radius + ball.radius;

        // checks if balls overlap
        if (distance < radiusDistance) {
          const overlap = radiusDistance - distance;
          const normalX = xDistance / distance;
          const normalY = yDistance / distance;

          // Move both balls by overlap distance
          this.x -= (normalX * overlap) / 2;
          this.y -= (normalY * overlap) / 2;
          ball.x += (normalX * overlap) / 2;
          ball.y += (normalY * overlap) / 2;

          // reverse direction of balls using elastic collision
          const newXVelocity1 = (this.xVelocity * (this.mass - ball.mass) + 2 * ball.mass * ball.xVelocity) / (this.mass + ball.mass);
          const newYVelocity1 = (this.yVelocity * (this.mass - ball.mass) + 2 * ball.mass * ball.yVelocity) / (this.mass + ball.mass);
          const newXVelocity2 = (ball.xVelocity * (ball.mass - this.mass) + 2 * this.mass * this.xVelocity) / (this.mass + ball.mass);
          const newYVelocity2 = (ball.yVelocity * (ball.mass - this.mass) + 2 * this.mass * this.yVelocity) / (this.mass + ball.mass);

          // update velocities
          this.xVelocity = newXVelocity1;
          this.yVelocity = newYVelocity1;
          ball.xVelocity = newXVelocity2;
          ball.yVelocity = newYVelocity2;
        }
      }
    });
  }
}

//generate random number in range
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//generate random color of balls
function getRandomColor() {
  let r = getRandomInt(0, 255);
  let g = getRandomInt(0, 255);
  let b = getRandomInt(0, 255);
  return `rgb(${r},${g},${b})`;
}

const ballArray = [];
const TOTAL_BALL_COUNT = getRandomInt(20, MAX_BALL_COUNT);
// const TOTAL_BALL_COUNT = 500;
for (let i = 0; i < TOTAL_BALL_COUNT; i++) {
  let x, y, radius;

  radius = getRandomInt(BALL_MIN_RADIUS, BALL_MAX_RADIUS);
  x = getRandomInt(BOUNDARY_X_MIN, BOUNDARY_X_MAX - radius);
  y = getRandomInt(BOUNDARY_Y_MIN, BOUNDARY_Y_MAX - radius);

  const ball = new Ball(x, y, radius);
  document.getElementById("box").appendChild(ball.element);
  ballArray.push(ball);
}

function displayAll() {
  ballArray.forEach((ball) => {
    ball.moveBall();
    ball.handleWallCollision();
    ball.handleBallCollision(ballArray);
  });
  requestAnimationFrame(displayAll);
}

displayAll();
