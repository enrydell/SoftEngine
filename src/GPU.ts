import { Engine, Scene, Vector3, FreeCamera, MeshBuilder, StandardMaterial, Color3, TransformNode } from "@babylonjs/core";

var canvas: HTMLCanvasElement;
var engine: Engine;
var scene: Scene;
var camera: FreeCamera;
var fpsElement: HTMLElement | null;

// Array to hold references to meshes/instances for rotation
var activeMeshes: TransformNode[] = [];

// Flag to determine if we are rendering many meshes or just one
var rendersManyMeshes = false;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, false);
} else {
  init();
}

function init() {
  canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
  fpsElement = document.getElementById("fpsCounter");

  engine = new Engine(canvas, true);
  scene = new Scene(engine);

  if (rendersManyMeshes) {
    spawnThousandsOfCubes();
  } else {
    spawnACube();
  }

  // Start the BabylonJS rendering loop
  engine.runRenderLoop(drawingLoop);

  // Handle window resizing
  window.addEventListener("resize", () => {
    engine.resize();
  });
}

function drawingLoop() {
  // Rotate each active mesh on the GPU
  for (let i = 0; i < activeMeshes.length; i++) {
    var mesh = activeMeshes[i];
    if (mesh) {
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.01;
    }
  }

  scene.render();

  // Display GPU FPS
  if (fpsElement) {
    fpsElement.textContent = `GPU FPS: ${engine.getFps().toFixed(0)}`;
  }
}

function spawnACube() {
  camera = new FreeCamera("camera", new Vector3(0, 0, -10), scene);
  camera.setTarget(Vector3.Zero());

  const cube = MeshBuilder.CreateBox("cube", { size: 2 }, scene);
  const material = new StandardMaterial("mat", scene);
  material.wireframe = true;
  material.emissiveColor = new Color3(1, 1, 0);
  cube.material = material;

  activeMeshes.push(cube);
}

function spawnThousandsOfCubes() {
  camera = new FreeCamera("camera", new Vector3(0, 0, -100), scene);
  camera.setTarget(Vector3.Zero());

  // Base template mesh
  const baseCube = MeshBuilder.CreateBox("baseCube", { size: 2 }, scene);
  const material = new StandardMaterial("mat", scene);
  material.wireframe = true;
  material.emissiveColor = new Color3(1, 1, 0);
  baseCube.material = material;
  baseCube.isVisible = false; // Hide the root template mesh

  // Spawn 20,000 Instanced Cubes
  for (let i = 0; i < 20000; i++) {
    const instance = baseCube.createInstance(`cube_${i}`);
    instance.position = new Vector3(
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 100
    );

    activeMeshes.push(instance);
  }
}