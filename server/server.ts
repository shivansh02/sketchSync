const express = require("express")
const http = require("http")
const app = express()
const server = http.createServer(app)

import {Server} from 'socket.io'

const io = new Server(server, {
    cors: {
        origin: "*",
    },
})

type Point = {
    x: number,
    y: number
}

type DrawLine = {
    prevPoint: Point | null,
    currentPoint: Point,
    color: string,
    width: number
}

io.on('connection', (socket) => {
    console.log("User connected")

    socket.on("join-room", (room) => {
        socket.join(room)
        console.log(`User joined room: ${room}`)
    })

    socket.on("draw-line", ({ prevPoint, currentPoint, color, width, room }: DrawLine & { room: string }) => {
        socket.to(room).emit("draw-line", { prevPoint, currentPoint, color, width })
    })

    socket.on("disconnect", () => {
        console.log("User disconnected")
    })
})

server.listen(3001, () => {
    console.log("Server running on port 3001")
})
