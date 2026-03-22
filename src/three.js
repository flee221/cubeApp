import * as THREE from "three";
let hands = [];
let targetRotationX = 0;
let currentRotationX = 0;
let targetRotationY = 0;
let currentRotationY = 0;

const width = 640;
const height = 480;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);

const canvasContainer = document.getElementById("canvasContainer");
canvasContainer.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;
function animate(time) {
  // Update hands from sharedData every frame for smoothness
  if (window.sharedData && window.sharedData.handPredictions) {
    hands = window.sharedData.handPredictions;
  }

  // Smoothly interpolate rotation. Use the tip of the index finger (keypoint 8) as the target
  if (hands[0] && hands[0].keypoints && hands[0].keypoints[8]) {
    targetRotationX = hands[0].keypoints[8].x / 100;
    targetRotationY = hands[0].keypoints[8].y / 100;
  }
  // Linear interpolation for smoothness
  currentRotationX += (targetRotationX - currentRotationX) * 0.1;
  currentRotationY += (targetRotationY - currentRotationY) * 0.1;
  cube.rotation.x = currentRotationY;
  cube.rotation.y = currentRotationX;

  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
