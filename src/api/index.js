import axios from "axios";

const API = axios.create({ baseURL: 'https://meeting-notes-gokul.herokuapp.com/v1' });

API.interceptors.request.use((req) => {
    const profile = JSON.parse(localStorage.getItem('profile'));
    if (profile?.token) {
        req.headers.authorization = `Bearer ${profile.token}`
    }
    return req;
});


export const fetchAllMeetings = () => (API.get(`/meeting/fetch/all`));
export const deleteMeeting = (id) => (API.delete(`/meeting/delete/${id}`));
export const editMeeting = (meeting) => (API.put(`/meeting/update`, meeting));
export const createMeeting = (meeting) => (API.post(`/meeting/new`, meeting));
export const logIn = () => (API.post(`/user/login`, { email: "kurupgokul11@gmail.com", pwd: "test" }));

