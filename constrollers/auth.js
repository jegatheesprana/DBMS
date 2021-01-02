const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE
});

db.connect( error=> {
    if(error)console.log(error);
    else console.log("mysql connected");
});

exports.register = (req, res)=>{
    const {username, password} = req.body;
    db.query('select username from users where username=?', [email], async (error, result)=>{
        if(error) console.log('mysql error', error);
        else {
            if( result.length > 0 ){
                return res.render('register', {
                    message: 'That email is already in use'
                })
            }
            let hashedPassword = await bcrypt.hash(password, 8);
            console.log(hashedPassword);
            db.query('insert into users set ?',{username: email, password: hashedPassword}, (error, result)=>{
                if(error) console.log(error);
                else{
                    console.log(result);
                    return res.render('register', {
                        message: 'User registered'
                    });
                }
            });
        }
    });
}
exports.login = async (req, res)=>{
    try {
        const {email, password, remember_me} = req.body;
        if( !email || !password ){
            return res.status(400).render('./logs/login', {
                error: 'Please provie an email and password'
            })
        }
        db,query('select * from users where email=?',[email], async (error, result)=>{
            if(error) console.log(error);
            else{
                if( !result || !(await bcrypt.compare(password, results[0].password) ) ){
                    res.status(401).render('login', {
                        message: 'Email or password incorrect!'
                    });
                } else{
                    const id = result[0].id;
                    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                        expiresIn: process.env.JWT_EXPIRES_IN
                    });
                    console.log('The token is '+token);
                    const cookieOptions = {
                        expires: new Date(
                            Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60
                        ),
                        httpOnly: true
                    }
                    res.cookie('jwt', token, cookieOptions);
                    res.status(200).redirect('/');
                }
            }
        })
    } catch (error) {
        console.log(error);
    }
}