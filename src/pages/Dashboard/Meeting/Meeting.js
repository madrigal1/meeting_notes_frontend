import React from 'react';
import './styles.scss';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const Meeting = ({ meeting, handleDelete, handleEdit }) => {
    const dateToString = (input) => {
        const d = new Date(input);
        return `${d.toDateString()} ${d.toLocaleTimeString()}`;
    }
    return (
        <section className="meetingCard">
            <h1>{meeting.title}</h1>
            <h3>About</h3>
            <p className="desc">{meeting.desc}</p>
            <div className="date"><p>{dateToString(meeting.start_time)}</p> <p>{dateToString(meeting.end_time)}</p></div>
            <footer>
                <EditIcon onClick={() => handleEdit(meeting)} />
                <DeleteIcon onClick={() => handleDelete(meeting._id)} />
            </footer>
        </section>
    );
};

export default Meeting;
