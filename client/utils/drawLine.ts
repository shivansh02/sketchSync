type DrawLineProps = Draw & {
    color: string
    width: number
}

export const drawLine = ({ prevPoint, currentPoint, ctx, color, width }: DrawLineProps): void => {

    if (!currentPoint) {
        throw new Error('currentPoint is undefined');
    }


    const { x: currX, y: currY } = currentPoint;
    const lineColor: string = color;
    const lineWidth: number = width
    // const lineWidth: number = 5;

    let startPoint: Point = prevPoint ?? currentPoint;
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(currX, currY);
    ctx.stroke();

    ctx.fillStyle = lineColor;
    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI);
    ctx.fill();
}
