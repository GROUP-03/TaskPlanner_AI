import { Button, Card, CardContent, FormControl, FormHelperText, Input, InputLabel, Typography } from '@mui/material';
import React, { Fragment, useState } from 'react';
import axios from "axios";

export const Signup = () => {
    const [firstName, setFirstName] = useState()
    const [lastName, setLastName] = useState()
    const [email, setEmail] = useState()
    const [pass, setPass] = useState()
    const [re_pass, setRe_pass] = useState()
    const [passMatch, setPassMatch] = useState(false)


    const handleFirstNameUpdate = (event) => {
        setFirstName(event.target.value);
    };

    const handleLastNameUpdate = (event) => {
        setLastName(event.target.value);
    };

    const handleEmailUpdate = (event) => {
        setEmail(event.target.value);
    };

    const handlePassUpdate = (event) => {
        setPass(event.target.value);
    };

    const handleRePassUpdate = (event) => {
        setRe_pass(event.target.value);
        setPassMatch(pass == event.target.value)
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post("http://localhost:8000/signup", {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: pass,
        });
    };

    return <Fragment>
        <Card sx={{ minWidth: 275, margin: 5, height: 500 }}>
            <CardContent>
                <Typography variant="h3" color="text.secondary" gutterBottom>
                    Login
                </Typography>
                <form onSubmit={handleSubmit} style={{ height: '23rem', display: 'flex', flexDirection: "column", justifyContent: "space-between" }}>
                    {/* reference: https://mui.com/material-ui/api/form-control/ */}
                    <FormControl variant='standard' sx={{ width: "100%" }}>
                        <InputLabel htmlFor="firstName">First Name</InputLabel>
                        <Input required='true' onChange={handleFirstNameUpdate} id="firstName" aria-describedby="firstName-helper-text" sx={{ width: "100%" }} />
                    </FormControl>
                    <FormControl variant='standard' sx={{ width: "100%" }}>
                        <InputLabel htmlFor="lastName">Last Name</InputLabel>
                        <Input required='true' onChange={handleLastNameUpdate} id="lastName" aria-describedby="lastName-helper-text" sx={{ width: "100%" }} />
                    </FormControl>
                    <FormControl variant='standard' sx={{ width: "100%" }}>
                        <InputLabel htmlFor="email">Email</InputLabel>
                        <Input type='email' required='true' onChange={handleEmailUpdate} id="email" aria-describedby="email-helper-text" sx={{ width: "100%" }} />
                    </FormControl>
                    <FormControl variant='standard' sx={{ width: "100%" }}>
                        <InputLabel htmtlFor="password">Password</InputLabel>
                        <Input type='pass' required='true' onChange={handlePassUpdate} id="password" aria-describedby="password-helper-text" sx={{ width: "100%" }} />
                    </FormControl>

                    <FormControl variant='standard' sx={{ width: "100%" }}>
                        <InputLabel htmtlFor="re-pass">Re-type Password</InputLabel>
                        <Input id="re-pass" type='re-pass' required='true' onChange={handleRePassUpdate} aria-describedby="re-pass-helper-text" sx={{ width: "100%" }} />
                        {!passMatch && <FormHelperText id="re-pass">Passwords did not match</FormHelperText>}
                    </FormControl>

                    <Button type='submit' variant='contained' display={passMatch} >Signup</Button>
                </form>
                <Typography>Have an account? <a href="/login">Login</a></Typography>
            </CardContent>
        </Card>
    </Fragment>
}