import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


import "./styles.scss";


import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import DateTimePicker from '@mui/lab/DateTimePicker';
import { createMeeting, deleteMeeting, editMeeting, fetchAllMeetings, fetchAllMeetingsByUser, logIn } from '../../api';
import Meeting from './Meeting/Meeting';

const Dashboard = () => {
    const [meetingTitle, setMeetingTitle] = useState("");
    const [meetingDesc, setMeetingDesc] = useState("");
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [user, setUser] = useState({});

    const [allMeetings, setAllMeetings] = useState([]);
    const [isEdit, setIsEdit] = useState(-1);
    const [noMeetings, setNoMeeting] = useState(false);

    const naviagte = useNavigate();
    const handleSubmit = async () => {
        console.log({ user });
        await createMeeting({ title: meetingTitle, desc: meetingDesc, start_time: startTime, end_time: endTime, initiator: user.email });
        //window.location.reload();
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

    const handleLogout = async () => {
        localStorage.removeItem("profile");
        naviagte("/");
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
            const userCache = localStorage.getItem("profile");
            console.log(userCache);
            if (!userCache) {
                console.log("no user cache")
                alert("Error login first")
                return;
            };
            const { user } = JSON.parse(userCache);
            console.log({ user });
            setUser(user);
            //console.log(`accessToken: ${tokens.accessToken}`)
        }
        fetchData()
    }, [])

    useEffect(() => {
        if (!user?._id)
            return;
        async function setMeeting() {
            console.log(user._id);
            const am = await fetchAllMeetingsByUser(user._id);
            let allm = am?.data?.data?.allMeetings;
            setAllMeetings(allm);
        }
        setMeeting()
            .catch(err => setNoMeeting(true));
    }, [user])

    useEffect(() => {
        //console.log({ allMeetings });
    }, [allMeetings])
    return (
        <article className="dashboard">
            <header className="header">
                <h1>MeetingNotes.UI</h1>
                <Button onClick={handleLogout} className="logout" variant="contained">Logout</Button>
            </header>
            <section className="meeting">
                {
                    allMeetings.length == 0 ? (
                        <div className="progressContainer">
                            {
                                noMeetings ?
                                    (
                                        <h1>No Meetings on Schedule ...</h1>
                                    ) : <CircularProgress />
                            }
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
