import { Color4, Vector3, Vector2, Matrix } from "@babylonjs/core";
import { Camera } from "./Camera.js";
import { Mesh } from "./Mesh.js";

export class Device {
  // the back buffer size is equal to the number of pixels to draw
  // on screen (width*height) * 4 (R,G,B & Alpha values). 
  private backbuffer: ImageData | undefined = undefined;
  private workingCanvas: HTMLCanvasElement;
  private workingContext: CanvasRenderingContext2D | null;
  private workingWidth: number;
  private workingHeight: number;
  // equals to backbuffer.data
  private backbufferdata: ImageDataArray | undefined = undefined;

  constructor(canvas: HTMLCanvasElement) {
    this.workingCanvas = canvas;
    this.workingWidth = canvas.width;
    this.workingHeight = canvas.height;
    this.workingContext = this.workingCanvas.getContext("2d", { willReadFrequently: true });
  }

  // This function is called to clear the back buffer with a specific color
  public clear(): void {
    // Clearing with black color by default
    this.workingContext?.clearRect(0, 0, this.workingWidth, this.workingHeight);
    // once cleared with black pixels, we're getting back the associated image data to 
    // clear out back buffer
    this.backbuffer = this.workingContext?.getImageData(0, 0, this.workingWidth, this.workingHeight);
  }

  // Once everything is ready, we can flush the back buffer
  // into the front buffer. 
  public present(): void {
    if (this.backbuffer) {
      this.workingContext?.putImageData(this.backbuffer, 0, 0);
    }
  }

  // Called to put a pixel on screen at a specific X,Y coordinates
  public putPixel(x: number, y: number, color: Color4): void {
    this.backbufferdata = this.backbuffer?.data;
    // As we have a 1-D Array for our back buffer
    // we need to know the equivalent cell index in 1-D based
    // on the 2D coordinates of the screen
    var index: number = ((x >> 0) + (y >> 0) * this.workingWidth) * 4;

    if (this.backbufferdata) {
      // RGBA color space is used by the HTML5 canvas
      this.backbufferdata[index] = color.r * 255;
      this.backbufferdata[index + 1] = color.g * 255;
      this.backbufferdata[index + 2] = color.b * 255;
      // this.backbufferdata[index + 3] = color.a * 255;
      this.backbufferdata[index + 3] = 255;
    }
  }

  // Project takes some 3D coordinates and transform them
  // in 2D coordinates using the transformation matrix
  public project(coord: Vector3 | undefined, transMat: Matrix): Vector2 {
    if (coord) {
      // transforming the coordinates
      var point = Vector3.TransformCoordinates(coord, transMat);
      // The transformed coordinates will be based on coordinate system
      // starting on the center of the screen. But drawing on screen normally starts
      // from top left. We then need to transform them again to have x:0, y:0 on top left.
      var x = point.x * this.workingWidth + this.workingWidth / 2.0 >> 0;
      var y = -point.y * this.workingHeight + this.workingHeight / 2.0 >> 0;
      return (new Vector2(x, y));
    } else {
      return new Vector2(0, 0);
    }
  }

  // drawPoint calls putPixel but does the clipping operation before
  public drawPoint(point: Vector2): void {
    // Clipping what's visible on screen
    if (point.x >= 0 && point.y >= 0 && point.x < this.workingWidth
      && point.y < this.workingHeight) {
      // Drawing a yellow point
      this.putPixel(point.x, point.y, new Color4(1, 1, 0, 1));
    }
  }

  // The main method of the engine that re-compute each vertex projection
  // during each frame
  public render(camera: Camera, meshes: Mesh[]): void {
    // To understand this part, please read the prerequisites resources
    var viewMatrix = Matrix.LookAtLH(camera.Position, camera.Target, Vector3.Up());
    var projectionMatrix = Matrix.PerspectiveFovLH(0.78, this.workingWidth / this.workingHeight, 0.01, 100.0);

    for (var index = 0; index < meshes.length; index++) {
      // current mesh to work on
      var mesh = meshes[index];

      if (mesh) {
        // Beware to apply rotation before translation
        var worldMatrix = Matrix
          .RotationYawPitchRoll(mesh.Rotation.y, mesh.Rotation.x, mesh.Rotation.z)
          .multiply(
            Matrix.Translation(mesh.Position.x, mesh.Position.y, mesh.Position.z)
          );

        var transformMatrix = worldMatrix.multiply(viewMatrix).multiply(projectionMatrix);

        for (var indexVertices = 0; indexVertices < mesh.Vertices.length; indexVertices++) {
          // First, we project the 3D coordinates into the 2D space
          var projectedPoint = this.project(mesh.Vertices[indexVertices], transformMatrix);
          // Then we can draw on screen
          this.drawPoint(projectedPoint);
        }
      }
    }
  }
}