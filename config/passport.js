const LocalStrategy = require('passport-local').Strategy;
const Contact = require('../model/contactModel');
const config = require('../config/connection');
const bcrypt = require('bcryptjs');

module.exports = function(passport){
  // Local Strategy
  passport.use(new LocalStrategy(function(username, password, done){
    // Match Username
    let query = {username:username};
    Contact.findOne(query, function(err, contact){
      if(err) 
        return done(err);
      if(!contact){
        return done(null, false, {message: 'No user found'});
      }

      // Match Password
      bcrypt.compare(password, contact.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
            console.log(contact.username+ " final "+ contact.password);
          return done(null, contact);
        } else {
          return done(null, false, {message: 'Wrong password'});
        }
      });
    });
  }));

  passport.serializeUser(function(contact, done) {
    done(null, contact.id);
  });

  passport.deserializeUser(function(id, done) {
    Contact.findById(id, function(err, contact) {
      done(err, contact);
    });
  });
}