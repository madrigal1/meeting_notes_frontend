import React, { useEffect, useState } from 'react';

import "./styles.scss";


import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

import DateTimePicker from '@mui/lab/DateTimePicker';
import { createMeeting, deleteMeeting, editMeeting, fetchAllMeetings, logIn } from '../../api';
import Meeting from './Meeting/Meeting';

const Dashboard = () => {
    const [meetingTitle, setMeetingTitle] = useState("");
    const [meetingDesc, setMeetingDesc] = useState("");
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [user, setUser] = useState({});

    const [allMeetings, setAllMeetings] = useState([]);
    const [isEdit, setIsEdit] = useState(-1);

    const handleSubmit = async () => {
        await createMeeting({ title: meetingTitle, desc: meetingDesc, start_time: startTime, end_time: endTime, initiator: user.email });
        window.location.reload();
    }
    const handleDelete = async (meeting_id) => {
        console.log(`meeting delted ${meeting_id}`);
        await deleteMeeting(meeting_id);
        window.location.reload();
    }

    const handleEdit = async (meeting) => {
        console.log(meeting);
        setMeetingTitle(meeting.title);
        setMeetingDesc(meeting.desc);
        setStartTime(meeting.start_time);
        setEndTime(meeting.end_time);
        const idx = allMeetings.findIndex((mArr) => mArr._id === meeting._id);
        console.log({ idx });
        setIsEdit(allMeetings.findIndex((mArr) => mArr._id === meeting._id));
    }
    const handleEditSubmit = async () => {
        if (isEdit === -1)
            return;
        let meeting = allMeetings[isEdit];
        console.log({
            _id: meeting._id,
            title: meetingTitle,
            desc: meetingDesc,
            start_time: startTime,
            end_time: endTime,
            initiator: meeting.initiator,
        })
        await editMeeting({
            _id: meeting._id,
            title: meetingTitle,
            desc: meetingDesc,
            start_time: startTime,
            end_time: endTime,
            initiator: meeting.initiator,
        });
        window.location.reload();
    }
    useEffect(() => {
        async function fetchData() {
            const { data: { data: { tokens, user } } } = await logIn();
            let userInfo = { tokens, user };
            setUser(user);
            localStorage.setItem(`profile`, JSON.stringify({ token: tokens.accessToken, user }));
            //console.log(`accessToken: ${tokens.accessToken}`)
            const am = await fetchAllMeetings();
            let allm = am?.data?.data?.allMeetings;
            setAllMeetings(allm);
        }
        fetchData()
    }, [])

    useEffect(() => {
        //console.log({ allMeetings });
    }, [allMeetings])
    return (
        <article className="dashboard">
            <header className="header"><h1>MeetingNotes.UI</h1></header>
            <section className="meeting">
                {
                    allMeetings.length == 0 ? (
                        <div className="progressContainer">
                            <CircularProgress />
                        </div>
                    ) : (
                        <div className="meeting__container">
                            {
                                allMeetings?.map((meeting, index) => (
                                    <Meeting key={index} meeting={meeting} handleDelete={handleDelete} handleEdit={handleEdit} />
                                ))
                            }
                        </div>
                    )
                }
            </section>
            <section className="new_meeting">
                <section className="new_meeting__container">
                    <h1>Create New Meeting</h1>
                    <div className="input_new_meeting">
                        <div className="input_ele">
                            <TextField value={meetingTitle} onChange={(e) => setMeetingTitle(e.target.value)} className="input_ele" id="meeting_title" label="Input Meeting Title" variant="standard" />
                            <TextField value={meetingDesc} onChange={(e) => setMeetingDesc(e.target.value)} className="input_ele" id="meeting_desc" label="Input Meeting Description" variant="standard" />
                            <DateTimePicker
                                renderInput={(props) => <TextField className="input_ele--date" {...props} />}
                                label="Start Time"
                                value={startTime}
                                onChange={(newValue) => {
                                    setStartTime(newValue);
                                }}
                            />
                            <DateTimePicker
                                renderInput={(props) => <TextField className="input_ele--date" {...props} />}
                                label="End Time"
                                value={endTime}
                                onChange={(newValue) => {
                                    setEndTime(newValue);
                                }}
                            />
                        </div>
                    </div>
                    <div className="new_meeting__container__submit" onClick={async () => (isEdit !== -1) ? await handleEditSubmit() : await handleSubmit()}>
                        <p>{isEdit !== -1 ? "Edit" : "Submit"}</p>
                    </div>
                </section>
            </section>
        </article>
    );
};

export default Dashboard;
