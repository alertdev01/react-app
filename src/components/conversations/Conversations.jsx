import axios from 'axios';
import { useEffect, useState } from 'react'
import './conversations.css'

export default function Conversation({ conversation, currentUser }) {
    const [user, setUser] = useState([]);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER

    useEffect(() => {
        const api = process.env.REACT_APP_API;
        const friendId = conversation.members.find(member => member !== currentUser._id);

        const getUser = async () => {
            try {
                const res = await axios(`${api}/users?userId=` + friendId);
                setUser(res.data);
            }
            catch (err) {
                console.log(err);
            }
        }
        getUser()
    }, [currentUser, conversation])

    return (
        <div className='conversation'>
            <img className='conversationImg' src={user?.profilePicture ? user.profilePicture : PF + "person/noAvatar.png"} alt="description of"/>
            <span className='conversationName'>{user?.username}</span>
        </div>
    )
}

// 'https://cdn.pixabay.com/photo/2017/04/13/22/33/maine-coon-cat-2228866_960_720.jpg'