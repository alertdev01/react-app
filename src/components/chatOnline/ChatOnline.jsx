import axios from 'axios';
import { useEffect, useState } from 'react'
import './chatOnline.css'

export default function ChatOnline({onlineUsers, currentId, setCurrentChat}) {
    const [friends, setFriends] = useState([]);
    const [onlineFriends, setOnlineFriends] = useState([]);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    useEffect(() => {
        const getFriends = async () => {
            const res = await axios.get("/users/friends/" + currentId);
            setFriends(res.data)
        };
        getFriends()
    },[currentId])

    useEffect(() => {
        setOnlineFriends(friends.filter(friend => onlineUsers.includes(friend._id)))
    },[friends, onlineUsers])

    return (
        <div className='chatOnline'>
            {onlineFriends.map(online=>(
                <div className="chatOnlineFriend">
                    <div className="chatOnlineImgContainer">
                        <img className="chatOnlineImg"
                            src={online?.profilePicture ? PF+online.profilePicture : PF+"person/noAvatar.png" } />
                        <div className="chatOnlineBadge"></div>
                    </div>

                    <span className="chatOnlineName">{online?.username}</span>
                </div>
            ))}
        </div>
    )
}