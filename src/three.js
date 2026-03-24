import * as THREE from "three";
let hands = [];
let targetRotationX = 0;
let currentRotationX = 0;
let targetRotationY = 0;
let currentRotationY = 0;
let pinchDistance = 0;
let pinchGestureActive = false;

let positionX = 0;
let positionY = 0;
let targetPositionX = 0;
let targetPositionY = 0;

const width = 640;
const height = 480;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);

const canvasContainer = document.getElementById("canvasContainer");
renderer.domElement.id = "three-canvas"; // Set an ID for styling
canvasContainer.appendChild(renderer.domElement);

//set scene and canvas background to transparent so we can see the webcam video behind
scene.background = null;
renderer.setClearColor(0x000000, 0); // Set alpha to 0 for transparency

const geometry = new THREE.BoxGeometry(1, 1, 1);

const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 1).normalize();
scene.add(light);

camera.position.z = 5;
function animate(time) {
  // Update hands from sharedData every frame for smoothness
  if (window.sharedData && window.sharedData.handPredictions) {
    hands = window.sharedData.handPredictions;
  }

  // // Smoothly interpolate rotation. Use the tip of the index finger (keypoint 8) as the target
  // if (
  //   pinchGestureActive &&
  //   hands[0] &&
  //   hands[0].keypoints &&
  //   hands[0].keypoints[8]
  // ) {
  //   targetRotationX = hands[0].keypoints[8].x / 100;
  //   targetRotationY = hands[0].keypoints[8].y / 100;
  // }
  // // Linear interpolation for smoothness
  // currentRotationX += (targetRotationX - currentRotationX) * 0.1;
  // currentRotationY += (targetRotationY - currentRotationY) * 0.1;

  // // Apply flipped rotation to the cube to match the world coordinates of three.js
  // cube.rotation.x = currentRotationY;
  // cube.rotation.y = currentRotationX;

  if (
    hands[0] &&
    hands[0].keypoints &&
    hands[0].keypoints[8] &&
    hands[0].keypoints[4]
  ) {
    pinchDistance = dist(
      hands[0].keypoints[8].x,
      hands[0].keypoints[8].y,
      hands[0].keypoints[4].x,
      hands[0].keypoints[4].y,
    );
    const scale = pinchDistance / 100; // Adjust the divisor to control sensitivity
    cube.scale.set(scale, scale, scale);
  }

  // Smoothly interpolate rotation. Use the tip of the index finger (keypoint 8) as the target
  if (hands[0] && hands[0].keypoints && hands[0].keypoints[8]) {
    targetPositionX = hands[0].keypoints[8].x;
    targetPositionY = hands[0].keypoints[8].y;
  }

  // Linear interpolation for smoothness
  positionX += (targetPositionX - positionX) * 0.1;
  positionY += (targetPositionY - positionY) * 0.1;

  // Apply flipped position to the cube to match the world coordinates of three.js
  cube.position.x = (positionX - width / 2) / 100; // Center and scale down
  cube.position.y = -(positionY - height / 2) / 100; // Center, flip, and scale down
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

// Listen for pinch gesture by checking distance between thumb tip (keypoint 4) and index finger tip (keypoint 8)
setInterval(() => {
  if (
    hands[0] &&
    hands[0].keypoints &&
    hands[0].keypoints[8] &&
    hands[0].keypoints[4]
  ) {
    const distance = dist(
      hands[0].keypoints[8].x,
      hands[0].keypoints[8].y,
      hands[0].keypoints[4].x,
      hands[0].keypoints[4].y,
    );
    pinchGestureActive = distance < 40; // Adjust threshold as needed
  } else {
    pinchGestureActive = false;
  }
}, 100);
