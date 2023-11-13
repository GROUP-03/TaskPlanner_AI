import { Button, Card, CardContent, Container, CssBaseline, FormControl, FormHelperText, Input, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import React, { Fragment, useState } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export const Upload_data = () => {
    const [industry, setIndustry] = useState()
    const [audioLanguage, setAudioLanguage] = useState()
    const [meetingAgenda, setMeetingAgenda] = useState()
    const [email, set_email] = useState()
    const [selectedFile, setSelectedFile] = useState(null);

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
        console.log({
            email: email,
            agenda: meetingAgenda,
            industry: industry,
            audio_language: audioLanguage,
            filename: selectedFile.name,
            file: selectedFile
        })
    };

    return <Fragment>
        {/* reference: https://mui.com/material-ui/react-card/ */}
        <CssBaseline />
        <Card sx={{ minWidth: 275, margin: 5, height: 500 }}>
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
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={"One Thing"}>One Thing</MenuItem>
                                <MenuItem value={"Other Thing"}>Other Thing</MenuItem>
                                <MenuItem value={"Something"}>Something</MenuItem>
                                <MenuItem value={"Something Else"}>Something Else</MenuItem>
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
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={"English"}>English</MenuItem>
                                <MenuItem value={"Spanish"}>Spanish</MenuItem>
                                <MenuItem value={"Japanise"}>Japanise</MenuItem>
                                <MenuItem value={"Chinise"}>Chinise</MenuItem>
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
    </Fragment>
}