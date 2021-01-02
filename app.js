const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');

dotenv.config({path: './.env'})

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public')); //No need of public folder for html
//parse url-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({extended: false}));
//parse JSON bodies (as sent by API clients)
app.use(express.json());
//for serup session
app.use(session({
    name: 'sid',
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true
    }
}
))

app.use((req, res, next)=>{
    console.log(req.originalUrl);
    next();
})

let auth = (req, res, next)=>{
    if(!req.session.user_id && !req.originalUrl.startsWith('/logs')){
        res.render('logs/login', {error: "login first"})
    }else{
        next();
    }
}

app.use('/auth', require('./routes/auth'));
app.use('/', auth, require('./routes/pages'));

app.listen(3000, ()=>{
    console.log("Server stated on port 3000");
});