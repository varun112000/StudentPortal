const express = require("express")
const app = express()
const mongoose = require('mongoose')
const model = require('./models/User')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const initializePassport = require("./passport-config")
initializePassport(passport)

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended : true}))

mongoose.connect("mongodb://localhost/users",{ useNewUrlParser : true, useUnifiedTopology : true})
mongoose.connection
    .once("open",function(){    console.log("Connected To DataBase")    })
    .on("error",function(){ console.log("Error To Connect DataBase")    })

const user1 = new model({
})

app.use(flash())
app.use(session({
    secret: 'secret',
    resave:false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

app.get('/',checkAuthenticated,function(req,res){
    if(req.user.Email ==="admin@admin.com"){
        model.find({},function(err,user){
            if(err){
                res.send("Something has happened")
                next()
            }
            return res.render("admin",{models:user})
            res.end()
        })
    }else{
        return res.render("index",{Name:req.user.Name})
    }
})
app.get('/admin',function(req,res){
    res.render("admin",{models:model.find({})})
})
app.get('/login',checkNotAuthenticated,function(req,res){
    res.render("login",)
})
app.post('/login',passport.authenticate('local',{
    successRedirect:'/',
    failureRedirect:'/login',
    failureFlash: true
})
)
app.get('/sign-up',checkNotAuthenticated,function(req,res){ 
    res.render("sign-up")
})
app.post('/sign-up',checkNotAuthenticated,async function(req,res){
    try{  
            const hashedPassword = await bcrypt.hash(req.body.Password, 10)
            user1.Name = req.body.Name
            user1.Number = req.body.Number
            user1.Email = req.body.Email
            user1.Password = hashedPassword        
            res.redirect('/login')
    }catch{
        res.redirect('/sign-up')
    }
    user1.save(function(err,user){
        if(err){
            console.log(err)
        }
        else{
            console.log("saved")
        }
    })
})
function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()) {
        return next()
    }
    return res.redirect('/login')
}
function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()) {
        return res.redirect('/login')
    }
    return next()
}
app.get('/logout',function(req,res){
    req.session.destroy(function (err) {
        res.redirect('/')
      })
})
app.listen(3040,function(){
    console.log("App Has Been Started")
})