# 3D SoftEngine & WebGL GPU Renderer

A 3D graphics rendering project built with **TypeScript**, **Vite**, and **Babylon.js Core**. 

This repository demonstrates the fundamental mechanics of 3D graphics pipeline architecture by comparing a custom **CPU-based Software Renderer (SoftEngine)** against a hardware-accelerated **GPU WebGL Pipeline**.

---

## 📌 Project Overview

This project implements two distinct 3D rendering engines side-by-side to compare architecture and performance:

1. **CPU SoftEngine (`index.html` / `src/index.ts`)**:
   - Built from scratch in TypeScript.
   - Handles matrix transformations (`World`, `View`, `Projection`), perspective division, 3D-to-2D screen coordinate projection, and manual pixel rasterization on the CPU.
   - Outputs directly to an HTML5 `<canvas>` backbuffer using 2D context (`ImageData`).

2. **GPU WebGL Engine (`gpu.html` / `src/gpu.ts`)**:
   - Built using Babylon.js Core (`@babylonjs/core`).
   - Offloads matrix math, vertex processing, and rasterization to GPU VRAM using hardware instancing and WebGL shaders.

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v16+ recommended) installed on your system.

### 1. Installation

Clone the repository and install the dependencies:

```bash
# Clone the repository
git clone https://github.com/your-username/softengine-demo.git
cd softengine-demo

# Install dependencies
npm install
```

### 2. Running the Development Server

Start the local Vite development server:

```bash
npx vite
```

Once running, Vite will display your local server URL (typically `http://localhost:5173`).

---

## 🎮 How to View & Compare Renderers

| Engine Type | URL | Description |
| :--- | :--- | :--- |
| **CPU SoftEngine** | `http://localhost:5173/` | Runs custom software projection and manual pixel drawing on the CPU. |
| **GPU WebGL Engine** | `http://localhost:5173/gpu.html` | Runs hardware-accelerated WebGL rendering on the GPU. |

---

## ⚡ Toggling Stress Testing (1 vs. 5,000+ Meshes)

Both rendering files feature a toggle flag to switch between a single rotating cube and a stress-test scene containing thousands of cubes.

### In `src/index.ts` (CPU) or `src/gpu.ts` (GPU):

```typescript
// Set to 'false' for 1 mesh, or 'true' to render thousands of cubes
var rendersManyMeshes = true; 
```

### 📊 What to Expect:

- **1 Cube**: Both CPU and GPU engines will comfortably hit the monitor's refresh rate cap (e.g., 60 FPS or 72 FPS).
- **5,000 Cubes**:
  - **CPU Engine**: FPS will drop significantly (or freeze into single digits) as JavaScript loops through thousands of matrix transformations and manual pixel array operations frame-by-frame.
  - **GPU Engine**: Maintains high FPS (60+ FPS) thanks to GPU hardware instancing and parallel shader execution.

---

## 🛠️ Tech Stack

- **Language**: TypeScript
- **Bundler / Dev Server**: [Vite](https://vitejs.dev/)
- **Math & GPU Framework**: `@babylonjs/core`
- **Output Target**: HTML5 Canvas (`2D` Context for CPU, `WebGL` Context for GPU)