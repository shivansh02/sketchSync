'use client'

import { FC, useEffect, useState } from 'react'
import { useDraw } from '../hooks/useDraw'
import { ChromePicker } from 'react-color'
import { Slider } from '../components/ui/slider'
import {io} from 'socket.io-client'
import { drawLine } from '@/utils/drawLine'
const socket = io('http://localhost:3001')

interface pageProps {}

type DrawLineProps = {
  prevPoint: Point | null
  currentPoint: Point
  color: string
}

const page: FC<pageProps> = ({}) => {
  const [color, setColor] = useState<string>('#000')
  const [width, setWidth] = useState<number[]>([3])
  const { canvasRef, onMouseDown, clear } = useDraw(createLine)


  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    socket.on("draw-line", ({prevPoint, currentPoint, color}: DrawLineProps) => {
      drawLine({prevPoint, currentPoint, ctx, color})
    })

    return () => {
      socket.off('draw-line')
    }


  }, [canvasRef])


  function createLine({ prevPoint, currentPoint, ctx }: Draw) {
    socket.emit("draw-line", {prevPoint, currentPoint, color})
    drawLine({ prevPoint, currentPoint, ctx, color })
  }

  return (
    <div className='w-screen h-screen bg-white flex justify-center items-center'>
      <div className='flex flex-col gap-10 pr-10'>
        <ChromePicker color={color} onChange={(e) => setColor(e.hex)} />
        
        <button type='button' className='p-2 rounded-md border border-black' onClick={clear}>
          Clear
        </button>
        <p>Width</p>
        <Slider defaultValue={[3]} max={10} step={1} onValueChange={(i) => setWidth(i)}/>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={onMouseDown}
        width={750}
        height={750}
        className='border border-black rounded-md'
      />
    </div>
  )
}

export default page
