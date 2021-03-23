const axios = require('axios');
const functions = require("firebase-functions");
const app = require('express')()
const port = 3000
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json()
const firebase = require('firebase')

// Firebase Config
const config = {
    apiKey: "AIzaSyCzVY1v5Qvv2KRvB9o9HaeW9WJrfZM3wxk",
    authDomain: "caleb-a4836.firebaseapp.com",
    projectId: "caleb-a4836",
    storageBucket: "caleb-a4836.appspot.com",
    messagingSenderId: "187408082079",
    appId: "1:187408082079:web:4052c7fef76d626101aeaa",
    measurementId: "G-HV1210833J"
};

// Base Axios Config
const instance = axios.create({
    baseURL: 'https://rest.coinapi.io/v1/',
    timeout: 10000,
    headers: {
        'X-CoinApi-Key': 'D71E56F3-01B1-421A-9C44-0DA82A28483C',
        'Accept': 'application/json',
        'Accept-Encoding': 'deflate',
    }
});

firebase.initializeApp(config);

// signup route
app.post('/signup', jsonParser, (req,res) =>{
    const newUser = {
        email: req.body.email,
        password: req.body.password,
    }
    firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then(data => {
        return res.status(201).json({message: 'user registered', user: data.user.id})
    }).catch(e => {
        return res.send({message : 'error while registering the user ', errorMessage: e})
    })
})

// Test user login
app.post('/login',jsonParser, (req,res) =>{

    const user = {
        email: req.body.email,
        password: req.body.password,
    }
    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then((userCredential) => {
        var user = userCredential.user;
        res.send({message: 'Success user succesfully Logged In', credentials: user})
    }).catch(e => {
        res.send({error: e})
    })
})



// Routes
app.get('/BTC/USD', (req, res) => {
    instance.get('/exchangerate/BTC/USD')
    .then((response) =>{
        res.send(response.data)
        
    })
    .catch(function (error) {
        console.log(error.message);
    })
})

app.get('/quote', (req, res) => {
    instance.get('/quotes/current')
    .then((response) =>{
        res.send(response.data)
    })
    .catch(function (error) {
        console.log(error.message);
    })
})

app.get('/BTC', (req, res) => {
    instance.get('/exchangerate/BTC')
    .then((response) =>{
        res.send(response.data)
    })
    .catch(function (error) {
        console.log(error.message);
    })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

