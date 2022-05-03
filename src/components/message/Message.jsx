import './message.css';
import { format } from 'timeago.js';

export default function Message({message, own }) {
    return (
        <div className={own ? "message own" : "message"}>
            <div className="messageTop">
                <img className='messageImg' src="https://cdn.pixabay.com/photo/2017/04/13/22/33/maine-coon-cat-2228866_960_720.jpg" alt="description of"/>
                <p className='messageText'>
                    {message.text}
                </p>
            </div>
            <div className="messageBottom">{format(message.createdAt)}</div>
        </div>
    )
}