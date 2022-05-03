import './messenger.css';
import Topbar from '../../components/topbar/Topbar';
import Conversation from '../../components/conversations/Conversations';
import Message from '../../components/message/Message';
import ChatOnline from '../../components/chatOnline/ChatOnline';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { io } from 'socket.io-client';

export default function Messanger() {
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const socket = useRef();
    const { user } = useContext(AuthContext)
    const scrollRef = useRef()

    useEffect(() => {
        const api = process.env.REACT_APP_SOCKET;
        socket.current = io("https://alert21-api.herokuapp.com/");
        socket.current.on("getMessage", data => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now()
            })
        })
    }, [])

    useEffect(() => {
        arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) &&
            setMessages((prev)=>[...prev, arrivalMessage])
    }, [arrivalMessage, currentChat])

    useEffect(() => {
        socket.current.emit("addUser", user._id)
        socket.current.on("getUsers", users => {
            setOnlineUsers(user.followings.filter(f=>users.some(u => u.user_id === f)));
        })
    }, [user])
    
    useEffect(() => {
        const api = process.env.REACT_APP_API;
        const getConversations = async () => {
            try {
                const res = await axios.get(`${api}/conversations/` + user._id)
                setConversations(res.data)
            }
            catch (err) {
                console.log(err)
            }
        };
        getConversations();
    }, [user._id])

    useEffect(() => {
        const api = process.env.REACT_APP_API;
        const getMessages = async () => {
            try {
                const res = await axios.get(`${api}/messages/` + currentChat?._id)
                setMessages(res.data)
            }
            catch (err) {
                console.log(err)
            }
        }
        getMessages()
    }, [currentChat])

    // Sends new message
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Message constructor
        const message = {
            sender: user._id,
            text: newMessage,
            conversationId: currentChat._id
        }

        const recieverId = currentChat.members.find(member => member !== user._id)

        socket.current.emit("sendMessage", {
            senderId: user._id,
            recieverId,
            text: newMessage
        })

        try {
            const api = process.env.REACT_APP_API;
            const res = await axios.post(`${api}/messages`, message)
            setMessages([...messages, res.data]) // Update the client side with the new message
            setNewMessage("") // Empty the text area
        }
        catch (err) {
            console.log(err)
        }
    }

    useEffect(() => { 
        scrollRef.current?.scrollIntoView({behavior: "smooth"})
    }, [messages])
    
    return (
        <>
            <Topbar />
            
            <div className="messenger">
                <div className="chatMenu">
                    <div className="chatMenuWrapper">
                        <input placeholder='Search for friends' className='chatMenuInput' />
                        {conversations.map((c) => (
                            <div onClick={() => setCurrentChat(c)}>
                                <Conversation conversation={c} currentUser={ user }/>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="chatBox">
                    <div className="chatBoxWrapper">
                        {
                            currentChat ? 
                        
                            <>
                                <div className="chatBoxTop">
                                    {messages.map(m => (
                                        <div ref={scrollRef}>
                                            <Message message={m} own={m.sender === user._id} />
                                        </div>    
                                    ))}

                                </div>
                                <div className="chatBoxBottom">
                                        <textarea
                                            className="chatMessageInput"
                                            placeholder="Write something..."
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            value={newMessage}
                                        ></textarea>
                                    <button className='chatSubmitButton' onClick={handleSubmit}>Send</button>
                                </div>
                            </>
                            : <span className='noConversationText'>Open a conversation to start a chat.</span>
                        }
                    </div>
                </div>
                <div className="chatOnline">
                    <div className="chatOnlineWrapper">
                        <ChatOnline
                            onlineUsers={onlineUsers}
                            currentId={user._id}
                            setCurrentChat={setCurrentChat} />
                    </div>
                </div>
            </div>
        </>
    )
}