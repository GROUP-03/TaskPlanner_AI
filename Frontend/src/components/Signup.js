import { Button, Card, CardContent, FormControl, FormHelperText, Input, InputLabel, Typography } from '@mui/material';
import React, { Fragment, useState } from 'react';
import axios from "axios";
import logInWalpaper from "../assets/login-wallpaper.jpg"
import { useNavigate} from "react-router-dom"

export const Signup = () => {
    const navigate = useNavigate()
    const [resMessage, setResMessage] = useState()
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
        axios.post("http://13.59.232.212:5000/register", {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: pass,
        })
        .then(response => {
           
            console.log('POST Request Response:', response);//
            if(response['data']['Message']=='Success')
            {
            
            
            navigate("/login")}


          })
          .catch(error => {console.error('Error:', error)
          setResMessage('Internal Server Error')}); 
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
        <Card sx={{ minWidth: 275, marginLeft: "auto", marginRight: "auto", marginTop: 15, height: 500, maxWidth: 400, opacity: 0.85, boxShadow: "2px 2px 8px" }}>
            <CardContent>
                <Typography variant="h3" color="text.secondary" gutterBottom>
                    Signup
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
                        <Input type='password' required='true' onChange={handlePassUpdate} id="password" aria-describedby="password-helper-text" sx={{ width: "100%" }} />
                    </FormControl>

                    <FormControl variant='standard' sx={{ width: "100%" }}>
                        <InputLabel htmtlFor="re-pass">Re-type Password</InputLabel>
                        <Input id="re-pass" type='password' required='true' onChange={handleRePassUpdate} aria-describedby="re-pass-helper-text" sx={{ width: "100%" }} />
                        {!passMatch && <FormHelperText id="re-pass">Passwords did not match</FormHelperText>}
                    </FormControl>
                    {resMessage && <Typography color={'red'}>{resMessage}</Typography>}
                    <Button type='submit' variant='contained' display={passMatch} >Signup</Button>
                </form>
                <Typography>Have an account? <a href="/login">Login</a></Typography>
            </CardContent>
        </Card>
        </div>
    </Fragment>
}
