require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltOfRounds = 10;
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const cors = require("cors");
const multer = require("multer");
const bodyParser = require("body-parser");
const fs = require("fs");

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/uploads")
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
});

let upload = multer({storage: storage}).single("file");

const User = require("./models/User");
const Admin = require("./models/Admin");
const Product = require("./models/Product");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/uploads"));
app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true
}));

app.use(session({
    secret: process.env.SECRET_KEY_SESSION,
    saveUninitialized: false,
    resave: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, {
        id: user.id,
        role: user.role,
      });
    });
  });
  
passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
});

passport.use("user-auth", new LocalStrategy(async (username, password, cb) => {
  const user = await User.findOne({username: username});

  if(!user) {
    return cb(null, false, {message: "User not found"})
  } else {
    bcrypt.compare(password, user.password, (err, result) => {
      if(err) {
        return cb(err)
      } else {
        if(result) {
          return cb(null, user)
        } else {
          return cb(null, false, {message: "Invalid username or password"})
        }
      }
    })
  }

}))

mongoose.set("strictQuery", false);
mongoose.set("strictPopulate", false);

mongoose.connect(process.env.DB_URI)
.then(() => {
    console.log("Database Connected");
});

app.get("/", (req, res) => {
  res.send("SERVER RUNNING")
})

app.post("/v1/api/register", async (req, res, next) => {
  
  const hash = await bcrypt.hash(req.body.password, saltOfRounds);

  const user = new User({
    username: req.body.username,
    password: hash,
    role: "User"
  });

  try {
    await user.save();
  } catch(err) {
    return next(err);
  }

  passport.authenticate("user-auth", (err, user, info) => {
    if(err) {
      return next(err)
    } else {

      if(!user) {
        console.log("User not found");
        res.send({success: false, message: "User not found"})
      }

      req.logIn(user, (err) => {
        if(err) {
          return next(err)
        } else {
          return res.send({success: true, message: "authenticate succeeded"})
        }
      })

    }
  })(req, res, next);


})

app.post("/v1/api/login", (req, res, next) => {

  passport.authenticate("user-auth", (err, user, info) => {
    if(err) {
      return next(err)
    } else {

      if(!user) {
        console.log("User not found");
        res.send({success: false, message: "User not found"})
      }

      req.logIn(user, (err) => {
        if(err) {
          return next(err)
        } else {
          return res.send({success: true, message: "authenticate succeeded"})
        }
      })

    }
  })(req, res, next);
  
});

app.get("/v1/api/getauth", (req, res) => {
  if(req.isAuthenticated()) {
    return res.send({success: true, message: "User already login"});
  } else {
    return res.send({success: false, message: "User not login"});
  }
});

app.get("/v1/api/logout", (req, res, next) => {
  req.logOut((err) => {
    if(err) {
      return next(err)
    } else {
      return res.send({success: true, message: "User logout"})
    }
  })
});

app.post("/v1/api/checkusername", async (req, res) => {
  
  if(req.body.role === "user") {
    try {
      const user = await User.findOne({username: req.body.username});
  
    if(user) {
      return res.send({success: true, message: "Username already taken", usernameExist: true});
    } else {
      return res.send({success: true, message: "Username available", usernameExist: false});
    }
    } catch(err) {
      return res.send({success: false, message: "cannot check username"});
    }
  
  } else if(req.body.role === "admin") {
    try {
      const admin = await Admin.findOne({username: req.body.username});
  
    if(admin) {
      return res.send({success: true, message: "Username already taken", usernameExist: true});
    } else {
      return res.send({success: true, message: "Username available", usernameExist: false});
    }
    } catch(err) {
      return res.send({success: false, message: "cannot check username"});
    }
  
  }
  
})

app.post("/v1/api/checkemail", async (req, res) => {
  if(req.body.role === "user") {
    try {
      const user = await User.findOne({email: req.body.email});
  
    if(user) {
      return res.send({success: true, message: "Email already taken", emailExist: true});
    } else {
      return res.send({success: true, message: "Email available", emailExist: false});
    }
    } catch(err) {
      return res.send({success: false, message: "cannot check email"});
    }
  } else if(req.body.role === "admin") {
    try {
      const admin = await Admin.findOne({email: req.body.email});
  
    if(admin) {
      return res.send({success: true, message: "Email already taken", emailExist: true});
    } else {
      return res.send({success: true, message: "Email available", emailExist: false});
    }
    } catch(err) {
      return res.send({success: false, message: "cannot check email"});
    }
  }
})

app.post("/v1/api/user", async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, saltOfRounds);

  const user = new User({
    username: req.body.username,
    password: hash,
  });
  

  try {
    await user.save();
  } catch(err) {
    console.log(err);
    return res.send({success: false, message: "cannot add user"})
  }

  return res.send({success: true, message: "successfully added new user"});
});

app.get("/v1/api/user", async (req, res) => {

  if(Object.values(req.query).length !== 0) {
    const users = await User.find({username: {$regex: req.query.search, $options: "i"}});

    if(!users) {
      return res.send({success: false, message: "Users not found"})
    }
  
    return res.send({success: true, users: users});
  } else {
    const users = await User.find();

    if(!users) {
      res.send({success: false, message: "Users not found"})
    }

    return res.send({success: true, users: users});
  }
  
  
});

app.delete("/v1/api/user", async (req, res) => {

  try {
    await User.deleteMany({_id: {$in: req.body.selectedKeys}});
  } catch(err) {
    res.send({success: false, message: "Cannot delete user"})
  }

  res.send({success: true, message: "Successfully deleted users"});

});

app.patch("/v1/api/user", async (req, res) => {
  
  const id = req.body.id;
  const fieldUpdated = req.body.fieldUpdated;

  if(fieldUpdated.password) {
    const hash = await bcrypt.hash(fieldUpdated.password, saltOfRounds);
    fieldUpdated.password = hash;
  }

  try {
    await User.findByIdAndUpdate(id, fieldUpdated);
  } catch(err) {
    return res.send({success: false, message: "error updated user"});
  }

  return res.send({success: true, message: "Successfully updated user"});

})

app.get("/v1/api/admin", async (req, res) => {

  if(Object.values(req.query).length !== 0) {

    const admins = await Admin.find({username: {$regex: req.query.search, $options: "i"}});

    if(!admins) {
      res.send({success: false, message: "Admins not found"})
    }

    res.send({success: true, message: "successfully get admin data", admins: admins})

  } else {
    const admins = await Admin.find({});

    if(!admins) {
      res.send({success: false, message: "Admins not found"})
    }

    res.send({success: true, message: "successfully get admin data", admins: admins});
  }

})

app.post("/v1/api/admin", async (req, res) => {

  try {
    const hash = await bcrypt.hash(req.body.password, saltOfRounds);

    const admin = new Admin({
      username: req.body.username,
      role: req.body.role,
      password: hash,
    })

    await admin.save();

    res.send({success: true, message: "Successfully added new admin"});
  } catch(err) {
    res.send({success: false, message: "ERROR: " + err});
  }
});

app.delete("/v1/api/admin", async (req, res) => {
 
  try {
    await Admin.deleteMany({_id: {$in: req.body.selectedKeys}});

    res.send({success: true, message: "Successfully delete"});
  } catch(err) {
    res.send({success: false, message: "ERROR: " + err});
  }

});

app.post("/v1/api/image", async (req, res) => {
  await upload(req, res, (err) => {
    if(err) {
      console.log(err);
      res.send({success: false, message: "Something wrong"});
    }

    res.send({success: true, message: "successfully upload image"});
  })
});

app.delete("/v1/api/image", (req, res) => {
  const fileName = req.body.filename;
  const path = __dirname + "/uploads/" + fileName;

  fs.unlink(path, (err) => {
    if(err) {
      console.log(err);
      res.send({success: false, message: "failed to remove"})
    }

    res.send({success: true, message: "successfully removed image"});
  })
});

app.post("/v1/api/product", async (req, res) => {
  
  try {
    const newProduct = new Product(req.body);

    await newProduct.save();

    res.send({success: true, message: "successfully added new product"});
  } catch(err) {
    res.send({success: false, message: "ERROR: failed to add new product"})
  }
  
});

app.get("/v1/api/product", async (req, res) => {
  try {

    if(Object.values(req.query).length !== 0) {
      const products = await Product.find({title: {$regex: req.query.search, $options: "i"}});

      res.send({success: true, products: products})

    } else {
      const products = await Product.find({});

      res.send({success: true, products: products})
    }

    
  } catch (err) {
    res.send({success: false, message: "failed to get products"})
  }
});

app.delete("/v1/api/product", async (req, res) => {

  try {
    const rowSelectionKeys = req.body.rowSelectionKeys;

    await Product.deleteMany({_id: {$in: rowSelectionKeys}});
  
    res.send({success: true, message: "successfully deleted selected product"});
  } catch(err) {
    res.send({success: false, message: "failed to deleted selected product"});
  }

})

app.patch("/v1/api/product", async (req, res) => {
  try {
    const updated = {
      title: req.body.title,
      price: req.body.price,
      img: req.body.img,
      tags: req.body.tags
    };
    await Product.findByIdAndUpdate(req.body._id, updated);
  
    res.send({success: true, message: "successfully updated product"});
  } catch(err) {
    console.log(err);
    res.send({success: false, message: err});
  } 
})

app.listen(process.env.SERVER_PORT, () => {
    console.log("Server running on port " + process.env.SERVER_PORT);
});