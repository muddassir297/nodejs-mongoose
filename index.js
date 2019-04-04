const express = require('express'); //import express
const path = require('path');
const mongoose = require('mongoose'); //Import mongoose 
const port = process.env.PORT || 8080;  //setup server port
const apiRoutes = require("./api-routes"); // Import routes
const bodyParser = require('body-parser'); //Import body parser
const cors = require('cors'); // cros origin
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/connection');
var cookieParser = require('cookie-parser');
//------------------------------------------------------------------//
mongoose.Promise = global.Promise;
mongoose.connect(config.database, { useNewUrlParser: true }).then(
  () => {console.log('Database is connected') },
      err => { console.log('Can not connect to the database'+ err)}
);
let db = mongoose.connection;

// Check connection
db.once('open', function(){ 
    console.log('Connected to MongoDB');
});

// Check for DB errors
db.on('error', function(err){
    console.log(err);   
});
let app = express(); //initialize the app
// Load View Engine
//  app.set('views', path.join(__dirname, '/view-ng-material/src')); 
//  app.set('view engine', 'html');
// Set View Folder
// app.use(express.static(path.join(__dirname, 'view-ng-material/src')));
// app.use('/',express.static(path.join(__dirname, 'view-ng-material/src')));

app.use(bodyParser.urlencoded({  // Configure bodyparser to handle post requests
    extended: true
}));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
// Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: {
      expires: 600000
  }
  }));
  
  // Express Messages Middleware
  app.use(flash());
  app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
  });
  
  // Express Validator Middleware
  app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
  }));
  
  // Passport Config
  require('./config/passport')(passport);
  // Passport Middleware
  app.use(passport.initialize());
  app.use(passport.session());

//app.get('/', (req, res) => res.send('Hello World with Express by Muddassir Hussain')); // Send message for default URL
app.use('/api', apiRoutes); // Use Api routes in the App
app.listen(port, function(){ //launch app to listen to specific port
    console.log("Running Resthub on port:"+port);
});