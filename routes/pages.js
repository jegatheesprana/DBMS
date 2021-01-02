const express = require('express');
const router = express.Router();

router.get('/', (req, res)=>{
    res.render('index');
});
router.get('/register', (req, res)=>{
    res.render('register');
});
router.get('/login', (req, res)=>{
    res.render('login');
});
router.get('/login/new', (req, res)=>{
    res.render('login/new');
});

/*router.get('/auth/login', (req, res)=>{
    res.send('normal')
})*/

router.get('/*', (req, res)=>{
    res.render('.'+req.originalUrl)
})

module.exports = router;