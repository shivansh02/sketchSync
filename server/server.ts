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
    color: string
}

io.on('connection', (socket) => {
    console.log("User connected")
    socket.on("draw-line", ({prevPoint, currentPoint, color}: DrawLine)  => {
        socket.broadcast.emit("draw-line", {prevPoint, currentPoint, color})
    })

})

server.listen(3001, () => {
    console.log("Server running on port 3001")
})