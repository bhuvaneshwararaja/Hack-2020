require("dotenv").config();
const express = require("express");

const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const multer = require("multer");
const path = require("path");
const md5 = require("md5");
const encrypt = require("mongoose-encryption");
var cloudinary = require("cloudinary").v2;
const fileupload = require("express-fileupload");
const app = express();
const session = require("express-session");
const passport = require("passport");
const passportlocalmongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate')
var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
    port: 465,
  service: 'gmail',
  auth: {
    user: "mail@gmail.com",
    pass:'password'
  }
});
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(fileupload({
  useTempFiles: true
}));
app.use(session({
  secret:"our little secret.",
  resave:false,
  saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());

cloudinary.config({
  cloud_name: '',
  api_key:  '',
  api_secret: ''
});
mongoose.connect("mongodb+srv://bhuvan:bhuvanesh007@cluster0-lzpan.mongodb.net/Eventregistration",{ useNewUrlParser: true , useUnifiedTopology: true,useFindAndModify:false  });
mongoose.set("useCreateIndex", true);
const regSchema = new mongoose.Schema({
  reg:String,
  name:String,
  contact:Number,
  email:String,
  image:String,
  type:String,
  event_type:String,
  ticket:Number,
  date:String
});
const adminSchema = new mongoose.Schema({
  name:String,
  password:String,
  admin_type:String

});
const querySchema = new mongoose.Schema({
  email:String,
  doubts:String,
  reply:String
});
adminSchema.plugin(passportlocalmongoose);
adminSchema.plugin(findOrCreate);
const Registration = new mongoose.model("Registration", regSchema);
const Admin = new mongoose.model("Admin", adminSchema);
const Query = new mongoose.model("Query", querySchema);
passport.use(Admin.createStrategy());
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  Admin.findById(id, function(err, user) {
    done(err, user);
  });
});
app.listen(process.env.PORT || 3000, function(req,res){
  console.log("server start at port 3000" );
});

app.get("/regform", function(req,res){

  res.render("index",{failuremessage:""});
})
app.get("/test",(req,res) => {
  res.render("test");
})

app.post("/register",function(req,res){
  var file = req.files.myimage;

  cloudinary.uploader.upload(file.tempFilePath, function(err, result){
    const name = req.body.username;
    const mob = req.body.number;
    const email = req.body.email;
    const type = req.body.regtype;
    const ticket  = req.body.ticket;
    const image = result.secure_url;
    const eventtype = req.body.eventtype;
    var d = new Date();
    var m = d.getMonth() + 1
    var date = d.getDate() + "/" + m +"/" + d.getFullYear()
    var slice = []
    var s = mob.toString();
    for(var i=s.length-1; i>=7; i--){
      slice.push(s[i])
    }

    var reg = "20EVR" + type[0] + eventtype[0] + slice.join("");

    const newregistration = new Registration({
      reg:reg.toUpperCase(),
      name:name,
      contact:mob,
      email:email,
      image:image,
      type:type,
      event_type:eventtype,
      ticket:ticket,
      date:date

    });
    Registration.findOne({email:email}, function(err,found){
      if(!found){
        newregistration.save(function(err){
          if(err){
            console.log(err);
          }
          else{
            var mailOptions = {
              from: 'name@gmail.com',
              to: req.body.email,
              subject: "no-reply Hack-2020",
              text: `Thank you for register in Hack2020
              To Download Your Ticket
              Click Link below
            https://hack-2020-event.herokuapp.com/check/`+reg.toUpperCase()


            }
            transporter.sendMail(mailOptions, function(err, info){
              if(!err){
                  res.render("success",{success:"Registration No :" + " "+ reg.toUpperCase()})
              }
              else{
                console.log(err);
              }
            })

          }
        })
      }
      else{
        res.render("index",{failuremessage:"This email Id already Register Please register with diffrent Email Id"})
      }
    })

  });
/*  upload(req ,res, (err) => {

  })*/




})
app.get("/success",function(req,res){

    res.render("success")
})
app.get("/check/:reg",function(req,res){
  const reg = req.params.reg
  Registration.findOne({reg:reg},function(err,found){
    if(found){
      res.render("details",{reg:found})
    }
  })
})
app.get("/user/:regId", function(req,res){
  const id = req.params.regId;
  Registration.findOne({_id: id}, function(err, user){
    res.render("registermembers", {onereg: user})
  });
})
app.get("/dashboard",function(req,res){
  if(req.isAuthenticated()){
    console.log(req.session.passport.user)
    Registration.countDocuments({type:"self"},function(err,count){
    Registration.countDocuments({type:"group"},function(err,count1){
    Registration.countDocuments({type:"corporate"},function(err,count2){
    Registration.countDocuments({type:"others"},function(err,count3){
    Registration.countDocuments({},function(err,length){
    Registration.countDocuments({event_type:"front-end"},function(err,count01){
    Registration.countDocuments({event_type:"back-end"},function(err,count02){
    Registration.countDocuments({event_type:"python"},function(err,count03){
    Registration.countDocuments({event_type:"javascript"},function(err,count04){
    Registration.find({},function(err,mem){
      Admin.findById(req.session.passport.user,function(err,current){
        Query.countDocuments({reply: {$ne:"replied"}},function(err,querycount){
              res.render("chart",{query:querycount,success:current.username ,self:count,group:count1,corporate:count2,others:count3,total:length,front:count01,back:count02,py:count03,js:count04,members:mem});
        })

      })

    })

   })})})})})})})})});
}
else{
  res.redirect("/panellogin");
}
})

app.get("/type/:typeofreg",function(req,res){
  if(req.isAuthenticated()){
    const typeofreg = req.params.typeofreg;

  Registration.find({type:typeofreg},function(err,reg){
    Query.countDocuments({reply: {$ne:"replied"}}, function(err, querycount){
        res.render("type",{query:querycount,regtype:reg});
    })

  });
}
  else{
    res.redirect("/panellogin")
  }


})

app.get("/registertype",function(req,res){
  if(req.isAuthenticated()){
    const typeofreg = req.params.typeofreg;


  Registration.find({},function(err,reg){
    Query.countDocuments({reply: {$ne:"replied"}}, function(err, querycount){
      res.render("reg_type",{query:querycount,regtype:reg});
    })

  });

  }
  else {
    res.redirect("/panellogin")
  }
})
app.get("/createuser",function(req,res){

    Query.countDocuments({reply: {$ne: "replied"}}, function(err, querycount){
          res.render("createuser", {query:querycount});
    })

  

})

app.post("/adminregister",function(req,res){
  Admin.register({username:req.body.username,admin_type:req.body.admintype},req.body.password, function(err,user){
  if(err){
    console.log(err);
    res.redirect("/createuser");
  }
  else{
    passport.authenticate("local")(req,res,function(){
      res.redirect("/settings");
    });
  }
});
})
app.get("/settings",function(req,res){
  Admin.find({},function(err,admin){
    Query.countDocuments({reply: {$ne: "replied"}}, function(err, querycount){
        res.render("settings",{query: querycount,adminlist:admin});
    })

  })

})

app.post("/updatepassword",function(req,res){
  const name = req.body.username;
  const password = req.body.password;
  Admin.update({name:name},{$set:{password: md5(password)}},function(err){
    if(!err){
      res.redirect("/settings");
    }
  })
})
app.get("/manageuser",function(req,res){

    Admin.find({},function(err,admin){
      Query.countDocuments({reply: {$ne:"replied"}},function(err, querycount){
        res.render("manageuser",{query:querycount,adminlist:admin});
      })

    })


});
app.post("/deleteuser",function(req,res){
  Admin.findByIdAndRemove(req.body.check,function(err){
    if(err){
      console.log(err);
    }
    else{
      console.log("deleted successfull");
      res.redirect("/manageuser");
    }
  });
});
app.get("/panellogin",function(req,res){
  res.render("login");
})
app.post("/login",function(req,res){
  const email = req.body.username;
  const password = md5(req.body.password);

  Admin.findOne({name: email},function(err,founduser){
    if(err){
      console.log(err);
    }
      else if(founduser){
      if(founduser.password === password){
        if(founduser.admin_type === "main"){
          res.redirect("/dashboard");
        }
        else{
            res.redirect("/teammates/dashboard");
        }

      }
    }

  });
})
app.get("/teammates/dashboard",function(req,res){
  if(req.isAuthenticated()){
    Registration.countDocuments({type:"self"},function(err,count){
    Registration.countDocuments({type:"group"},function(err,count1){
    Registration.countDocuments({type:"corporate"},function(err,count2){
    Registration.countDocuments({type:"others"},function(err,count3){
    Registration.countDocuments({},function(err,length){
    Registration.countDocuments({event_type:"front-end"},function(err,count01){
    Registration.countDocuments({event_type:"back-end"},function(err,count02){
    Registration.countDocuments({event_type:"python"},function(err,count03){
    Registration.countDocuments({event_type:"javascript"},function(err,count04){
    Registration.find({},function(err,mem){
    Admin.findById(req.session.passport.user,function(err,current){
        Query.countDocuments({reply: {$ne:"replied"}},function(err,querycount){
            res.render("teammates/dashboard",{count:querycount,success:current.username ,self:count,group:count1,corporate:count2,others:count3,total:length,front:count01,back:count02,py:count03,js:count04,members:mem});
        })

      })

    })

   })})})})})})})})});
  }
else{
  res.redirect("/panellogin")
}

})
app.get("/teammates/query", function(req,res){
  Query.find({}, function(err,found){
    Query.countDocuments({reply: {$ne: "replied"}}, function(err,querycount){
        res.render("teammates/query",{count:querycount,query:found})
    })

  })
})
app.post("/replyusermail",function(req,res){

  var mailOptions = {
    from: 'bhuvaneshraja113@gmail.com',
    to: req.body.toemail,
    subject: req.body.subject,
    text: req.body.reply
  }
  transporter.sendMail(mailOptions, function(err, info){
    if(!err){
      console.log("email sent" + info.response)
    }
    else{
      console.log(err);
    }
  })


 Query.updateMany({email:req.body.toemail},{reply: "replied"},function(err){
    if(!err){
      res.redirect("/teammates/query")
    }
    else{
      console.log(err);
    }
  })

})
app.get("/uquery/:queryno", function(req,res){
  var queryno = req.params.queryno;
  console.log(queryno)
  Query.findById(queryno,function(err, fetch){
      res.render("teammates/reply",{query:fetch});
  })

})
app.post("/registrationdetailsopen", (req,res) => {
  const reg = req.body.regno;
  Registration.findOne({reg:reg},function(err,found){
    if(found){
      res.render("details",{reg:found})
    }
  })
})
app.post("/queries", (req,res) => {
  const newquery = new Query({
    email: req.body.email,
    doubts: req.body.text,
    reply: "not replied"
  });
  newquery.save((err) => {
    if(!err){
      res.redirect("/regform");
    }
  })
})
app.post("/adminlogin",function(req,res){
  const user = new Admin({
  username: req.body.username,
  password:req.body.password
});
req.login(user, function(err){
  if(err){
    console.log(err);
  }
  else{
    passport.authenticate("local")(req,res,function(){
      if(req.user.admin_type === "main"){
        res.redirect("/dashboard");
      }
      else{
        res.redirect("/teammates/dashboard")
      }

    });
  }
});
})
app.get("/logout",function(req,res){
  req.logout();
  res.redirect("/hack2020");
});
app.get("/query/:queryno", function(req,res){
  var queryno = req.params.queryno;
  console.log(queryno)
  Query.findById(queryno,function(err, fetch){
      res.render("replyqueries",{query:fetch});
  })

})
app.post("/replymail",function(req,res){

  var mailOptions = {
    from: 'name@gmail.com',
    to: req.body.toemail,
    subject: req.body.subject,
    text: req.body.reply
  }
  transporter.sendMail(mailOptions, function(err, info){
    if(!err){
      console.log("email sent" + info.response)
    }
    else{
      console.log(err);
    }
  })


 Query.updateMany({email:req.body.toemail},{reply: "replied"},function(err){
    if(!err){
      res.redirect("/userquery")
    }
    else{
      console.log(err);
    }
  })

})
app.get("/userquery", function(req,res){
  Query.find({}, function(err,found){
    Query.countDocuments({reply: {$ne: "replied"}}, function(err,querycount){
        res.render("userquery",{count:querycount,query:found})
    })

  })
})
app.get("/hack2020",function(req,res){
  res.render("landing")
})
