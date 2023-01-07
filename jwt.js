const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const cookieParser = require('cookie-parser');


app.use(cookieParser());
//console.log(req.cookies.token)

app.get('/', (req, res) => {
    console.log(req.cookies.token)
    res.json('this is just a test to json webtoken authorization')
})

app.post('/post', varifyToken, (req, res) => {
    res.json({
        msg: 'you have successifully accessed'
    })
})

app.post('/login', (req, res) => {
    const user = {
        id: 1,
        name: 'rqy',
        email: 'rqy@gmail.com'

    }
    /* jwt.sign({user},'screatKey',{expiresIn:'1min'}, (err,token)=>{
         res.json({token})
     }*/

    jwt.sign({
        user
    }, 'screatKey', {
        expiresIn: '20min'
    }, (err, token) => {
        if (err) throw err;
        res.cookie('token', token, {
            maxAge: 1000 * 60 * 15,
            httpOnly: true,
            secure: false,
            sameSite: 'none'
        });

        res.json({
            msg: 'login is succesfully done',
            token
        })
    })


});


function varifyToken(req, res, next) {

    if (req.cookies.token) {


        jwt.verify(req.cookies.token, 'screatKey', (err, authData) => {
            if (err) {
                res.sendStatus(403);
                res.json({
                    message: 'authorization failed'
                })
            } else {
                  
             return   next();

            }
        })
        // return next()
    } else {
        res.sendStatus(403);
        res.send('authorization forbidden')
    }
}



const port = process.env.PORT || 2000;
app.listen(port, () => {
    console.log('server is running on localhost' + port)
})
