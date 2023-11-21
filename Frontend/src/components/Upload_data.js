import { Button, Card, CardContent, Container, CssBaseline, FormControl, FormHelperText, Input, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from "axios";
import { useNavigate} from "react-router-dom"
import logInWalpaper from "../assets/login-wallpaper.jpg"

export const Upload_data = () => {
    const userEmail = JSON.parse(sessionStorage.getItem("user"))
    const navigate = useNavigate()

    const [industry, setIndustry] = useState()
    const [audioLanguage, setAudioLanguage] = useState()
    const [meetingAgenda, setMeetingAgenda] = useState()
    const [email, set_email] = useState()
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        if(!userEmail) {
            console.log("USER NOT LOGGED IN");
            navigate("/login")
        }
    }, [])

    const handleIndustryUpdate = (event) => {
        setIndustry(event.target.value);
    };

    const handleAudioLanguageUpdate = (event) => {
        setAudioLanguage(event.target.value);
    };

    const handleMeetingAgendaUpdate = (event) => {
        setMeetingAgenda(event.target.value);
    };

    const handleEmailUpdate = (event) => {
        set_email(event.target.value);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData();
        data.append('email', email);
        data.append('agenda', meetingAgenda);
        data.append('industry', industry);
        data.append('audio_language', audioLanguage);
        data.append('filename', selectedFile.name);
        data.append('file', selectedFile);
        
        axios.post("http://127.0.0.1:5000/upload", data)

        .then(response => {
            // Handle the response as needed, without saving it in state
            console.log('POST Request Response:', response);
          })
          .catch(error => console.error('Error:', error)); 
        
            
        
    };

    return <Fragment>
        <div style={{
            height: 800, width: "100%", marginTop: -40,
            paddingTop: 40,
            backgroundImage: `url(${logInWalpaper})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center"
        }} >
        {/* reference: https://mui.com/material-ui/react-card/ */}
        <CssBaseline />
        <Card sx={{ minWidth: 275, marginLeft: "auto", marginRight: "auto", marginTop: 15, height: 500, maxWidth: 500, opacity: 0.85, boxShadow: "2px 2px 8px" }}>
            <CardContent>
                <Typography variant="h3" color="text.secondary" gutterBottom>
                    Upload Data
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Enter the below details to create Planner
                </Typography>
                <form onSubmit={handleSubmit} style={{ height: '23rem', display: 'flex', flexDirection: "column", justifyContent: "space-between" }}>
                    {/* reference: https://mui.com/material-ui/api/form-control/ */}
                    <FormControl variant='standard' sx={{ width: "100%" }}>
                        <InputLabel htmlFor="email">Email</InputLabel>
                        <Input type='email' required='true' onBlur={handleEmailUpdate} id="email" aria-describedby="email-helper-text" sx={{ width: "100%" }} />
                    </FormControl>
                    <FormControl variant='standard' sx={{ width: "100%" }}>
                        <InputLabel htmtlFor="meeting-agenda">Meeting Agenda</InputLabel>
                        <Input required='true' onBlur={handleMeetingAgendaUpdate} id="meeting-agenda" aria-describedby="meeting-agenda-helper-text" sx={{ width: "100%" }} />
                    </FormControl>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        {/* reference: https://mui.com/material-ui/react-select/ */}
                        <FormControl variant='standard' sx={{ width: "45%" }}>
                            <InputLabel id="industry-dropdown" htmlFor="industry-dropdown">Industry</InputLabel>
                            <Select
                                labelId="industry-dropdown"
                                id="industry-dropdown"
                                value={industry}
                                onChange={handleIndustryUpdate}
                                label="industry-dropdown"
                                required='true'
                            >
                                
                                <MenuItem value={"IT"}>IT</MenuItem>
                                <MenuItem value={"Education"}>Education</MenuItem>
                                
                            </Select>
                        </FormControl>
                        <FormControl variant='standard' sx={{ width: "45%" }}>
                            <InputLabel id="audio-language-dropdown" htmlFor="audio-language-dropdown">Audio Language</InputLabel>
                            <Select
                                labelId="audio-language-dropdown"
                                id="audio-language-dropdown"
                                value={audioLanguage}
                                onChange={handleAudioLanguageUpdate}
                                label="audio-language-dropdown"
                                required='true'
                            >
                                
                                <MenuItem value={"en-US"}>en-US</MenuItem>
                                <MenuItem value={"en-IN"}>en-IN</MenuItem>
                                <MenuItem value={"en-GB"}>en-GB</MenuItem>
                                <MenuItem value={"en-AU"}>en-AU</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    {/* reference: https://www.dhiwise.com/post/how-to-implement-react-mui-file-upload-in-your-applications */}
                    <div style={{ width: "100%", display: 'flex', flexDirection: "row", justifyContent: 'space-between' }}>
                        <input
                            type="file"
                            accept="audio/*, video/*"
                            style={{ display: 'none' }}
                            id="fileInput"
                            onChange={handleFileChange}
                            required="true"
                        />
                        <label htmlFor="fileInput">
                            <Button
                                variant="contained"
                                color="primary"
                                component="span"
                                startIcon={<CloudUploadIcon />}
                            >
                                Choose File
                            </Button>
                        </label>
                        {selectedFile && (
                            <Typography  >
                                {selectedFile.name}
                            </Typography>
                        )}
                    </div>
                    <Button type='submit' variant='contained'>submit</Button>
                </form>
            </CardContent>

        </Card>
        </div>
    </Fragment>
}