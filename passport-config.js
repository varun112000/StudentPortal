const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const model = require('./models/User')
const bcrypt = require('bcrypt')

function initialize(passport){
        passport.use(
            new LocalStrategy({usernameField:'email'},function(email, password, done){
                model.findOne({Email:email})
                    .then(user=>{
                        if(!user){
                            return done(null, false, { message: 'The email is not registered'})
                        }
                        bcrypt.compare(password, user.Password, function(err,isMatch){
                            if(err) {
                                return done(err)
                            }
                            if(isMatch){
                                const name = user.Name
                                return done(null, user,{ message:'Welcome'+name})
                            }
                            else{
                                return done(null, false, { message: 'passport not matched'})
                            }
                        })
                    })
                    .catch(err=>console.log(err))
            })
        ) 
        passport.serializeUser(function(user, done) {
            done(null, user.id);
          })
          
        passport.deserializeUser(function(id, done) {
            model.findById(id, function(err, user) {
              done(err, user);
            })
          })
}
module.exports = initialize