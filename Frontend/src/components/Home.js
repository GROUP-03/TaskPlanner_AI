import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';

import logInWalpaper from "../assets/login-wallpaper.jpg"
import { useNavigate } from "react-router-dom"
import axios from "axios";

export const Home = () => {
    const navigate = useNavigate()
    const [items, setItems] = useState([]);
    let counter = 0;
    const userEmail = JSON.parse(sessionStorage.getItem("user"))
    const newContent = JSON.parse(sessionStorage.getItem("newContent"))
    const [message, setMessage] = useState();
    useEffect(() => {

        if (!userEmail) {
            console.log("USER NOT LOGGED IN");
            navigate("/login")
        }
        console.log("newContent",newContent)
        console.log("sessionStorage",sessionStorage)

        if (userEmail) {
            handleRefreshPage();

            console.log("Display created planner");
        }
        if (newContent) {
            setMessage("Planner creation in progress click refresh button to check new plan after sometime")

        }


    }, []);

    const handleUploadNew = () => {
        console.log("Handle Upload New");
        navigate('/Upload_data')

    }

    const handlelogout = () => {
        sessionStorage.removeItem('user');
        console.log("User successfully logged out")
        navigate('/login')

    }

    const local_dt = (utcdate) => {
        
        const localDate = new Date(utcdate); 
        
          
        return localDate.toLocaleString();
    }


    


    const handleRefreshPage = () => {
        setMessage()
sessionStorage.removeItem('newContent');       
        return axios
            .post("http://13.59.232.212:5000/displayallplanner", { email: userEmail })
            .then(response => {
                // Handle the response as needed, without saving it in state
                console.log('POST Request Response:', response);
                //setItems(data["response"][0])
                console.log(response["data"]["response"])
                setItems(response["data"]["response"])

            })
            .catch(error => console.error('Error:', error));
    }

    return (

        <div style={{
            height: 1000, width: "100%",
            paddingTop: 40,
            backgroundImage: `url(${logInWalpaper})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center"
        }} >
            <div
                style={{
                    marginLeft: "auto", marginRight: "auto",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "95%"
                }}
            >
                <Typography variant="h3" color="white" gutterBottom fontWeight={"bold"}>
                    Created Schedules
                </Typography>

                <div>
                    <Button variant='contained' onClick={handleRefreshPage} style={{ height: "50px" }}>Refresh</Button>
                    <Button variant='contained' onClick={handleUploadNew} style={{ height: "50px", marginLeft: "20px" }}>Upload New</Button>
                    <Button variant='contained' onClick={handlelogout} style={{ height: "50px", marginLeft: "20px" }}>Logout</Button>
                </div>
                
            </div>
            {message && <Typography color={'black'}>{message}</Typography>}
            <TableContainer component={Paper} sx={{ width: "90%", marginLeft: "auto", marginRight: "auto", maxWidth: "mb", opacity: 0.85, boxShadow: "2px 2px 8px" }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ "& th": { fontWeight: "bold", color: "white", backgroundColor: "slateblue" } }}>
                            <TableCell>Assignee</TableCell>
                            <TableCell>Created Date</TableCell>
                            <TableCell>Deadline</TableCell>
                            <TableCell>Meeting Agenda</TableCell>
                            <TableCell>Task</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items && items.map((item) => (
                            <TableRow key={counter++}>
                                <TableCell>{item.assignee}</TableCell>
                                <TableCell>{local_dt(item.createdDate)}</TableCell>
                                <TableCell>{item.deadline}</TableCell>
                                <TableCell>{item.meetingagenda}</TableCell>
                                <TableCell>{item.task}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

