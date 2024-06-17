type Draw = {
    ctx: CanvasRenderingContext2D
    currentPoint: Point
    prevPoint: Point | null
    width: Number
  }
  
  type Point = { x: number; y: number }
  