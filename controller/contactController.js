const bcrypt = require('bcryptjs');
const passport = require('passport');
const Contact = require('../model/contactModel');
const flash = require('connect-flash');
// Handle index actions
exports.index = function (req, res) {
    Contact.get(function (err, contacts) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        //console.log(contacts);
        res.json({
            status: "success",
            message: "Contacts retrieved successfully",
            data: allContacts(contacts)
        });
    });
};
// Handle create contact actions
exports.new = function (req, res) {
    var contact = new Contact();
    const fname = req.body.fname ? req.body.fname : contact.fname;
    const lname = req.body.lname;
    const gender = req.body.gender;
    const email = req.body.email;
    const phone = req.body.phonenumber;
    const username = req.body.username;
    const password = req.body.password;
    const address = req.body.address;
    let user = "";
    if(username == "muddassir297" && email == "hussainmuddassir297@gmail.com" && fname == "Muddassir" && lname == "Hussain"){
        user = "admin";
    }else{
        user = "user";
    }

    req.checkBody('fname', 'Name is required').notEmpty();
    req.checkBody('lname', 'Name is required').notEmpty();
    req.checkBody('gender', 'Gender is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('phonenumber', 'Phone is required').notEmpty();    
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    //req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
    req.checkBody('address', 'Address is required').notEmpty();

    let errors = req.validationErrors();

    if(errors){
        // res.render('register', {
        //   errors:errors
        // });
        //console.log(`Error! ${errors}`);
        res.send(errors);
        return;
      } else {
        contact.fname = fname,
        contact.lname = lname,
        contact.phone = phone,
        contact.email = email,
        contact.gender = gender,
        contact.username = username,
        contact.password = password,
        contact.address = address,
        contact.role = user

        bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(contact.password, salt, function(err, hash){
              if(err){
                //console.log(err);
                res.json({
                    success: false,
                    error: err
                });
                //res.send(err);
                return;
              }
              contact.password = hash;
              // save the contact and check for errors
              contact.save(function(err){
                if(err){
                    res.json({
                        success: false,
                        error: err
                    });
                   // res.send(err);
                    return;
                }
                //req.flash('success','You are now registered and can log in');
                console.log(contact);
                res.json({
                    status: "200",
                    success:true,
                    message: "New Contact addedd",
                    data: contactDataFilter(contact)
                });
                
              });
            });
          });
      }

    
    };

   
// Handle view contact info
exports.view = function (req, res) {
    Contact.findById(req.params.contact_id, function (err, contact) {
        if (err)
            res.send(err);
        res.json({
            message: 'Contact details loading..',
            data: contactDataFilter(contact)
        });
    });
};
// Handle update contact info
exports.update = function (req, res) {
    Contact.findById(req.params.contact_id, function (err, contact) {
        if (err){
            res.send(err);
        }            
        const fname = req.body.fname ? req.body.fname : contact.fname;
        const lname = req.body.lname;
        const gender = req.body.gender;
        const email = req.body.email;
        const phone = req.body.phonenumber;
        const username = req.body.username;
        const password = req.body.password;
        const address = req.body.address;
        let user = "";
        if(username == "muddassir297" && email == "hussainmuddassir297@gmail.com" && fname == "Muddassir" && lname == "Hussain"){
            user = "admin";
        }else{
            user = "user";
        }
        req.checkBody('fname', 'Name is required').notEmpty();
        req.checkBody('lname', 'Name is required').notEmpty();
        req.checkBody('gender', 'Gender is required').notEmpty();
        req.checkBody('email', 'Email is required').notEmpty();
        req.checkBody('email', 'Email is not valid').isEmail();
        req.checkBody('phonenumber', 'Phone is required').notEmpty();
        req.checkBody('username', 'Username is required').notEmpty();
        req.checkBody('password', 'Password is required').notEmpty();
        //req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
        req.checkBody('address', 'Address is required').notEmpty();

        let errors = req.validationErrors();

        if(errors){
            // res.render('register', {
            // errors:errors
            // });
            console.log(`Error! ${errors}`);
            res.send(errors);
            return;
        } else {
            contact.fname = fname,
            contact.lname = lname,
            contact.phone = phone,
            contact.email = email,
            contact.gender = gender,
            contact.username = username,
            contact.password = password,
            contact.address = address,
            contact.role = user
            bcrypt.genSalt(10, function(err, salt){
                bcrypt.hash(contact.password, salt, function(err, hash){
                if(err){
                    console.log(err);
                }
                contact.password = hash;
                // save the contact and check for errors
                contact.save(function(err){
                    if(err){
                        console.log(err);
                        return;
                    } else {
                        req.flash('success','You are now registered and can log in');
                        //res.redirect('/users/login');
                        res.json({
                            status: "success",
                            message: "Contact updated successfully",
                            data: contactDataFilter(contact)
                        });
                    }
                });
                });
          });
      }
    });
};

// Login Form
// exports.getLogin = function (req, res) {
//     //res.render('login');
// }
  // Login Process
exports.postLogin = function (req, res, next) {
    passport.authenticate('local', function(err, user, info){
        
        //successRedirect:'/api/contacts',
        // failureRedirect:'/api/login', //uncoment once ui is ready
        // failureFlash: 
        console.log(user)
        if (err) {
            return next(err); // will generate a 500 error
        }
        if (!user) {
            return res.send({status:401, success : false, message : `Authentication failed username or password is incorrect` });
        }
        req.login(user, loginErr => {
            if (loginErr) {
              return next(loginErr);
            }
            return res.send({ status: 200, success : true, message : 'Authentication succeeded',redirectUrl:'/home', 
            username:`${user.username}`, name:`${user.fname}" "${user.lname}`, userRole: user.role});
          });      
        
    })(req, res, next)
}
// logout
exports.logout = function (req, res) {
    req.logout();
    req.flash('success', 'You are logged out');
    return res.send({ status: 200, success : true, message : 'Logged out', redirectUrl:'/login'})
}

// Handle delete contact
exports.delete = function (req, res) {
    Contact.findOneAndDelete({username: req.params.contact_id},
        function (err, contacts) {
        if (err)
            res.send(err);
        //console.log(contacts)
        Contact.find({}, function(err, users){
            if (err)
                res.send(err);
            res.json({
                status: "200",
                success:true,
                message: "Contact deleted succefully",
                data: allContacts(users)
            });  
        })        
    });
};

function allContacts(contacts){
    return contact = contacts.map(person => ({ 
        fname: person.fname, 
        lname: person.lname,
        email: person.email,
        phone: person.phone,
        username: person.username,
        address: person.address,
        gender: person.gender,
        role: person.role,
        date: person.create_date
    }));
}

function contactDataFilter(myObject){
    return respData = {
        fname: myObject.fname,
        lname: myObject.lname,
        email: myObject.email,
        phone: myObject.phone,
        username: myObject.username,
        address: myObject.address,
        gender: myObject.gender,
        role: myObject.role,
        date: myObject.create_date
    }
}