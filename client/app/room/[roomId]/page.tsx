'use client'

import { FC, useEffect, useState } from 'react'
import { useDraw } from '../../../hooks/useDraw'
import { ChromePicker } from 'react-color'
import { Slider } from '../../../components/ui/slider'
import { io } from 'socket.io-client'
import { drawLine } from '@/utils/drawLine'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"

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
    socket.emit("join-room", room)
  }

  const handleLeaveRoom = () => {
    router.push('/')
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(room)
    toast.success('Room ID copied to clipboard!')
}


  return (
    <div className='w-screen h-screen bg-white flex justify-center items-center'>
      <div className='flex flex-col gap-y-4 pr-10'>
        <ChromePicker color={color} onChange={(e) => setColor(e.hex)} />
        <Label>Width</Label>
        <Slider defaultValue={[3]} max={10} step={1} min={1} onValueChange={(i) => setWidth(i[i.length - 1])}/>
        <div className="flex flex-row w-64 max-w-sm justify-around content-end items-end space-x-2">
          <Input type="text" placeholder="roomID" className="" value={room} readOnly/>
          <Button type="submit" variant="secondary" onClick={handleCopy}>Copy</Button>
        </div>
        <Button className='p-2 rounded-md border border-black' onClick={clear}>
          Undo
        </Button>
        <Button className='p-2 rounded-md border border-black' onClick={clear}>
          Clear
        </Button>
        <Button variant='destructive'  onClick={handleLeaveRoom}>
          Leave Room
        </Button>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={onMouseDown}
        width={1200}
        height={750}
        className='border border-black rounded-md'
      />
    <Toaster position="top-center" />
    </div>
  )
}

export default page
