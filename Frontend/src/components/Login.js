import { Button, Card, CardContent, FormControl, Input, InputLabel, Typography } from '@mui/material';
import React, { Fragment, useState } from 'react';
import axios from "axios";

export const Login = () => {
    const [email, setEmail] = useState()
    const [pass, setPass] = useState()


    const handleEmailUpdate = (event) => {
        setEmail(event.target.value);
    };

    const handlePassUpdate = (event) => {
        setPass(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post("http://localhost:5000/login", { email: email, password: pass });
    };

    return <Fragment>
        <Card sx={{ minWidth: 275, margin: 5, height: 500 }}>
            <CardContent>
                <Typography variant="h3" color="text.secondary" gutterBottom>
                    Login
                </Typography>
                <form onSubmit={handleSubmit} style={{ height: '15rem', display: 'flex', flexDirection: "column", justifyContent: "space-between", padding: "10%" }}>
                    {/* reference: https://mui.com/material-ui/api/form-control/ */}
                    <FormControl variant='standard' sx={{ width: "100%" }}>
                        <InputLabel htmlFor="email">Email</InputLabel>
                        <Input type='email' required='true' onChange={handleEmailUpdate} id="email" aria-describedby="email-helper-text" sx={{ width: "100%" }} />
                    </FormControl>
                    <FormControl variant='standard' sx={{ width: "100%" }}>
                        <InputLabel htmtlFor="password">Password</InputLabel>
                        <Input type='pass' required='true' onChange={handlePassUpdate} id="password" aria-describedby="password-helper-text" sx={{ width: "100%" }} />
                    </FormControl>
                    <Button type='submit' variant='contained'>Login</Button>
                </form>
                <Typography>Don't have an account? <a href="/signup">Sign Up</a></Typography>
            </CardContent>
        </Card>
    </Fragment>
}