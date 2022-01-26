import React, { useState } from 'react';
import "./styles.scss";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { CircularProgress, TextField } from '@mui/material';
import { logIn, register } from '../../api';
import { useNavigate } from 'react-router-dom';



function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


const Login = () => {
    const [value, setValue] = useState(0);
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleLogin = async () => {
        try {
            setLoading(true);
            const { data: { data: { tokens, user } } } = await logIn({ email, pwd });
            await localStorage.setItem(`profile`, JSON.stringify({ token: tokens.accessToken, user }));
            await navigate("/home", 500);
        } catch (err) {
            alert("Sign in failed");
            console.log(err);
            setLoading(false);
        }
    }
    const handleRegister = async () => {
        try {
            setLoading(true);
            const { data: { data: { tokens, user } } } = await register({ email, pwd });
            localStorage.setItem(`profile`, JSON.stringify({ token: tokens.accessToken, user }));
            setTimeout(() => navigate("/home"), 500)
        } catch (err) {
            alert("Registration failed");
            console.log(err);
            setLoading(false);
        }
    }

    return (
        <article className="login">
            <section className="login__loginContainer">
                <h1>MeetingNotes.UI</h1>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Login" {...a11yProps(0)} />
                    <Tab label="Register" {...a11yProps(1)} />
                </Tabs>
                <br />
                <TextField value={email} onChange={(e) => setEmail(e.target.value)} className="input_ele" id="email" label="Input your email" variant="standard" /> <br />
                <TextField value={pwd} onChange={(e) => setPwd(e.target.value)} className="input_ele" id="pwd" label="Input your password" variant="standard" />
                <br />
                <TabPanel className={loading ? "submitBtn" : ""} value={value} index={0} onClick={async () => await handleLogin()} >
                    {loading ? <CircularProgress /> : <div className="submit">Login</div>}
                </TabPanel>
                <TabPanel className={loading ? "submitBtn" : ""} value={value} index={1} onClick={async () => await handleRegister()}>
                    {loading ? <CircularProgress /> : <div className="submit" >Register</div>}
                </TabPanel>
            </section>
        </article >
    );
};


export default Login;
