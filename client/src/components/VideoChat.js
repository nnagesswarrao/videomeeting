import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import { v4 as uuidv4 } from 'uuid';

const VideoChat = () => {
    const [stream, setStream] = useState(null);
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState('');
    const [callerSignal, setCallerSignal] = useState();
    const [callAccepted, setCallAccepted] = useState(false);
    const [roomId, setRoomId] = useState('');

    const userVideo = useRef();
    const partnerVideo = useRef();
    const socketRef = useRef();
    const connectionRef = useRef();

    useEffect(() => {
        socketRef.current = io.connect('http://localhost:5001');
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                setStream(stream);
                if (userVideo.current) {
                    userVideo.current.srcObject = stream;
                }
            });

        socketRef.current.on('user-connected', userId => {
            connectToNewUser(userId, stream);
        });

        socketRef.current.on('user-disconnected', userId => {
            if (connectionRef.current) {
                connectionRef.current.destroy();
            }
        });

        return () => {
            if(stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            if(socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    const createRoom = () => {
        const id = uuidv4();
        setRoomId(id);
        socketRef.current.emit('join-room', id, socketRef.current.id);
    };

    const joinRoom = () => {
        if (roomId) {
            socketRef.current.emit('join-room', roomId, socketRef.current.id);
        }
    };

    const connectToNewUser = (userId, stream) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream,
        });

        peer.on('signal', data => {
            socketRef.current.emit('sending signal', { userToSignal: userId, signal: data });
        });

        peer.on('stream', stream => {
            if (partnerVideo.current) {
                partnerVideo.current.srcObject = stream;
            }
        });

        connectionRef.current = peer;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Video Chat
                    </h1>
                </div>
                
                <div className="flex gap-4">
                    <button 
                        className="btn btn-primary"
                        onClick={createRoom}
                    >
                        Create Room
                    </button>
                    <button 
                        className="btn btn-secondary"
                        onClick={joinRoom}
                    >
                        Join Room
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Video</h2>
                        <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                            <video 
                                playsInline 
                                muted 
                                ref={userVideo} 
                                autoPlay 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Partner Video</h2>
                        <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                            <video 
                                playsInline 
                                ref={partnerVideo} 
                                autoPlay 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>

                {roomId && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <p className="text-blue-800">
                            Room ID: <span className="font-mono font-medium">{roomId}</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoChat;
