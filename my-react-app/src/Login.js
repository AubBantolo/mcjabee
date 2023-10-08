import './Login.css';
import AdminDashboard from './AdminDashboard.js';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import { BrowserRouter, Routes, Route, Link, useNavigate, ConditionalLink } from "react-router-dom";

const baseURL = "http://localhost:8080";

function Test(){

    const [user, setUser] = React.useState(null);
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    const navigate = useNavigate();

    const handleUsername = (event) => {
        setUsername(event.target.value);
    };

    const handlePassword = (event) => {
        setPassword(event.target.value);
    };

    //this gets the api
    useEffect(() => {
        if (username) {
          axios.get(baseURL + "/api/login/" + username)
            .then((response) => {
              setUser(response.data);
            })
            .catch((error) => {
              console.error(error);
            });
        }
    }, [username]);

    const checkUsername = () => { // Specify the desired username here
       console.log(user.name);
       console.log(user.role);
       console.log(user.password);
       console.log(user);

       if (username == user.name && user.role == "admin" && password == user.password) {
            navigate("/adminDashboard",
            { state: {user} });
            console.log('Username is admin!');x
       } else {
            navigate("/menu",{ state: {user} });
            console.log('Username is not admin!');
       }
    };



    return (
    <div class="overallBody">
      <div class="box">
            <form>
                <h2> Sign In </h2>
                <div class = "inputBox">
                    <input id="username" type="text" required="required" value={username} onChange={handleUsername}/>
                    <span>Username</span>
                    <i></i>
                </div>
                <div class = "inputBox">
                    <input type="password" type="password" required="required" value={password} onChange={handlePassword}/>
                    <span>Password</span>
                    <i></i>
                </div>
                <div class = "links">

                </div>
                <input class="login" type="submit" value="Login" onClick={checkUsername}/>
            </form>
        </div>
    </div>
    );
}

function callDashboard(){
     return (
            <div>
            <h2> test </h2>
            <AdminDashboard />
            </div>
        );
}


export default Test;
