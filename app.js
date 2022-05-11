const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require("body-parser");
var cors = require('cors')
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const jwt = require("jsonwebtoken")

//const userListRouter = require('./routes/users/list');
const userAddRouter = require('./routes/users/add');
//const userUpdateRouter = require('./routes/users/update');
const userGetRouter = require('./routes/users/get');
const userRequestPasswordRouter = require('./routes/users/request-password');
const userResetPasswordRouter = require('./routes/users/reset-password');
const checkAuth = require('./routes/users/check-auth');
const loginRouter = require('./routes/users/login');
const app = express();
app.use(cors())
app.use(logger('dev'));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.all('*', validateToken);
//app.use('/', indexRouter);

//app.use('/users/list', userListRouter);
app.use('/users/add', userAddRouter);
app.use('/users/get', userGetRouter);
//app.use('/users/update', userUpdateRouter);
app.use('/users/request-password', userRequestPasswordRouter);
app.use('/users/reset-password', userResetPasswordRouter);
app.use('/users/login', loginRouter);
app.use('/users/check-auth', checkAuth);

app.set('port', process.env.PORT || 3000);

const server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
});
function validateToken(req, res, next) {
    console.log("validateToken")
    const token = req.headers["authorization"]
    if (req.path === '/users/login' || 
        req.path === '/users/request-password' ||
        req.path === '/users/reset-password'||
        req.path === '/users/check-auth' ) return next();
    console.log("hehehehe")
    //the request header contains the token "Bearer <token>", split the string and use the second value in the split array.
    if (token == null) res.status(400).json({error:"Authorization not present"})
    console.log("huhuhuhuh")
    jwt.verify(token, process.env.API_SECRET, (err, user) => {
        if (err) {
            res.status(403).json({error:"Authorization not valid"})
        }
        else {
            next() //proceed to the next action in the calling function
        }
    }) //end of jwt.verify()*/
}