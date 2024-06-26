"use client"

import { FC, useState, useEffect } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

import {useRouter} from 'next/navigation'

interface pageProps { }


const page: FC<pageProps> = ({ }) => {
    const router = useRouter()
    const [open, setOpen] = useState(false);
    const [roomId, setRoomId] = useState<string>("")
    const [inputRoom, setInputRoom] = useState<string>("")
    const [inputUsername, setInputUsername] = useState<string>("")
    const openModal = () => {
        setOpen(true)
    }

    useEffect (() => {
        setRoomId(generateRoomId())
    },[])    

    const generateRoomId = () => {
        const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        let result = ""
        for (let i = 0; i < 6; i++) {
            result += charset.charAt(Math.floor(Math.random() * charset.length))
        }
        return result
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(roomId)
        toast.success('Room ID copied to clipboard!')


    }

    const handleCreate = () => {
        console.log("submitted")
        router.push(`/room/${roomId}`)
    }

    const handleJoin = () => {
        console.log("submitted")
        router.push(`/room/${inputRoom}`)
    }

    const handleRoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputRoom(e.target.value)
    }

    return (
        <div className="w-screen h-screen bg-white flex justify-center items-center">
            <Card>
                <CardHeader>
                    <CardTitle>SketchSync</CardTitle>
                    <CardDescription>Draw with your friends in real-time.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Label htmlFor="username">Username</Label>
                    <Input type="text" id="username" placeholder="johndoe" className="mb-4 mt-2"/>
                    <Label htmlFor="roomId" className="mt-0">Room ID</Label>
                    <div className="flex w-64 max-w-sm items-start space-x-2">
                        <Input type="text" placeholder="roomID" className="mb-4 mt-2" value={roomId} readOnly/>
                        <Button type="submit" variant="secondary" onClick={handleCopy}>Copy</Button>
                    </div>
                    <Button type="submit" variant="default" className="w-full" onClick={handleCreate}>Create Room</Button>
                    <div className="flex items-center my-6">
                        <hr className="flex-grow border-t border-gray-300" />
                        <Label className="px-2 text-gray-500">OR</Label>
                        <hr className="flex-grow border-t border-gray-300" />
                    </div>
                    <Button type="submit" variant="outline" className="w-full" onClick={openModal}>Join Room</Button>
                    {/* <Dialog>
                        <DialogTrigger >
                        <Button type="submit" variant="outline" className="">Join Room</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Are you absolutely sure?</DialogTitle>
                                <DialogDescription>
                                    This action cannot be undone. This will permanently delete your account
                                    and remove your data from our servers.
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog> */}
                    <Dialog open={open} onOpenChange={setOpen} >
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogTitle>
                                Join a room
                            </DialogTitle>
                            <Input type="text" id="username" placeholder="johndoe"/>
                            <Input type="text" id="roomId" placeholder="room-ID" onChange={handleRoomChange}
/>
                            <Button type="submit" variant="default" onClick={handleJoin}>Join Room</Button>
                        </DialogContent>
                    </Dialog>
                </CardContent>
                <CardFooter>
                </CardFooter>
            </Card>
            <Toaster position="top-center" />
        </div>
    )
}

export default page