import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
//import data from "../assets/data.json"
import logInWalpaper from "../assets/login-wallpaper.jpg"
import { useNavigate} from "react-router-dom"
import axios from "axios";

export const Home = () => {
    const navigate = useNavigate()
    const [items, setItems] = useState([]);
    let counter = 0;
    const userEmail = JSON.parse(sessionStorage.getItem("user"))
    useEffect(() => {

        if(!userEmail) {
            console.log("USER NOT LOGGED IN");
            navigate("/login")
        }
        
        if(userEmail) {
            handleRefreshPage();
        
            console.log("Displayed created planner");
        }

        
    }, []);

    const handleUploadNew = () => {
        console.log("Handle Upload New");
        window.location.href = '/Upload_data'
    }

    const handleRefreshPage = () => {
        return axios
        .post("http://127.0.0.1:5000/displayallplanner", { email: userEmail})
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
            <Button variant='contained' onClick={handleRefreshPage} style={{height: "50px"}}>Refresh Page</Button>
            <Button variant='contained' onClick={handleUploadNew} style={{height: "50px", marginLeft: "20px"}}>Upload New</Button>
            </div>

            </div>
            <TableContainer component={Paper} sx={{ width:"90%", marginLeft: "auto", marginRight: "auto", maxWidth: "mb", opacity: 0.85, boxShadow: "2px 2px 8px" }}>
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
                        {items.map((item) => (
                            <TableRow key={counter++}>
                                <TableCell>{item.assignee}</TableCell>
                                <TableCell>{item.createdDate}</TableCell>
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