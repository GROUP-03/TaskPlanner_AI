import { Button, Card, CardContent, FormControl, Input, InputLabel, Typography } from '@mui/material';
import React, { Fragment, useState } from 'react';
import axios from "axios";
import { useNavigate} from "react-router-dom"
import logInWalpaper from "../assets/login-wallpaper.jpg"

export const Login = () => {
    const navigate = useNavigate()

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
        axios.post("http://127.0.0.1:5000/login", { email: email, password: pass })
        .then(response => {
            // Handle the response as needed, without saving it in state
            console.log('POST Request Response:', response);//
            if(response['data']['Message']=='Success')
            {
            // add if condition response is success then 
            sessionStorage.setItem("user",JSON.stringify(email))
            navigate("/upload_data")}


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
        <Card  sx={{ minWidth: 275, marginLeft: "auto", marginRight: "auto", marginTop: 15, height: 500, maxWidth: 400, opacity: 0.85, boxShadow: "2px 2px 8px" }}>
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
                        <Input type='password' required='true' onChange={handlePassUpdate} id="password" aria-describedby="password-helper-text" sx={{ width: "100%" }} />
                    </FormControl>
                    <Button type='submit' variant='contained'>Login</Button>
                </form>
                <Typography>Don't have an account? <a href="/signup">Sign Up</a></Typography>
            </CardContent>
        </Card>
        </div>
    </Fragment>
}