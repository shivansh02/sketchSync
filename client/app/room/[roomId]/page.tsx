'use client'

import { FC, useEffect, useState } from 'react'
import { useDraw } from '../../../hooks/useDraw'
import { ChromePicker } from 'react-color'
import { Slider } from '../../../components/ui/slider'
import { io } from 'socket.io-client'
import { drawLine } from '@/utils/drawLine'
import { useRouter, useParams } from 'next/navigation'

const socket = io('http://localhost:3001')

interface pageProps {}

type DrawLineProps = {
  prevPoint: Point | null
  currentPoint: Point
  color: string
  width: number
  room: string
}

const page: FC<pageProps> = ({}) => {
  const router = useRouter()
  const params = useParams()
  const [color, setColor] = useState<string>('#000')
  const [width, setWidth] = useState<number>(3)
  const [room, setRoom] = useState<string>(params.roomId.toString() || '')
  const { canvasRef, onMouseDown, clear } = useDraw(createLine)

  useEffect(() => {
    if (room) {
      joinRoom()
    }
  }, [room])

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    socket.on("draw-line", ({ prevPoint, currentPoint, color, width }: DrawLineProps) => {
      drawLine({ prevPoint, currentPoint, ctx, color, width })
    })

    return () => {
      socket.off('draw-line')
    }
  }, [canvasRef])

  function createLine({ prevPoint, currentPoint, ctx }: Draw) {
    socket.emit("draw-line", { prevPoint, currentPoint, color, width, room })
    drawLine({ prevPoint, currentPoint, ctx, color, width })
  }

  const joinRoom = () => {
    clear()
    socket.emit("join-room", room)
  }

  return (
    <div className='w-screen h-screen bg-white flex justify-center items-center'>
      <div className='flex flex-col gap-10 pr-10'>
        <ChromePicker color={color} onChange={(e) => setColor(e.hex)} />
        
        <button type='button' className='p-2 rounded-md border border-black' onClick={clear}>
          Clear
        </button>
        <p>Width</p>
        <Slider defaultValue={[3]} max={10} step={1} onValueChange={(i) => setWidth(i[i.length - 1])}/>

        <input
          type='text'
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder='Enter room name'
          className='p-2 border border-black rounded-md'
        />
        <button type='button' className='p-2 rounded-md border border-black' onClick={joinRoom}>
          Join Room
        </button>
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
