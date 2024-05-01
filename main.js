const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const multer = require("multer");
const checkAuth = require("./public/middlewares/CheckAuth.js");
const convertToHash = require("./method/ConvertToHash");


const MONGODB_CONNECT_URI ="mongodb+srv://sangam:fpE9OstDCJyOs79o@gofoodmern.00npwb5.mongodb.net/?retryWrites=true&w=majority&appName=GoFoodMern"

mongoose.connect(

  "mongodb+srv://sangam:fpE9OstDCJyOs79o@gofoodmern.00npwb5.mongodb.net/?retryWrites=true&w=majority&appName=GoFoodMern"
   // "mongodb://localhost:27017/ecom",
  // "mongodb+srv://parthiv:parthiv@stationary.m6zourd.mongodb.net/?retryWrites=true&w=majority&appName=stationary" 
    );



  const userSchema = new mongoose.Schema({
    name: String,
    password: Number,
    isVerified: Boolean,
  });
  
  const user = mongoose.model("user", userSchema);


  const productSchema = new mongoose.Schema({
    image: String,
    name: String,
    Price: Number,
    id: Number,
    quantity: Number,
  });
  const product = mongoose.model("product", productSchema);

 product.insertMany([
product.create([
  {
    image: "Artpencils.png",
    name: "Artpencils",
    Price: "48",
    id: 1,
    quantity: 5,
  },
  {
    image: "Calculator.png",
    name: "Calculator",
    Price: "499",
    id: 2,
    quantity: 10,
  },
  {
    image: "Eraser.png",
    name: "Eraser",
    Price: "9",
    id: 3,
    quantity: 3,
  },
  {
    image: "File.png",
    name: "File",
    Price: "148",
    id: 4,
    quantity: 5,
  },
  {
    image: "Highlighter.png",
    name: "Highlighter",
    Price: "99",
    id: 5,
    quantity: 7,
  },
  {
    image: "Journal.png",
    name: "Journal",
    Price: "399",
    id: 6,
    quantity: 3,
  },
  {
    image: "Magnifier.png",
    name: "Magnifier",
    Price: "410",
    id: 7,
    quantity: 6,
  },
  {
    image: "Markers.png",
    name: "Markers",
    Price: "50",
    id: 8,
    quantity: 10,
  },
  {
    image: "Notebooks3.png",
    name: "Notebooks3",
    Price: "600",
    id: 9,
    quantity: 5,
  },
  {
    image: "Notebooksmall.png",
    name: "Notebooksmall",
    Price: "200",
    id: 10,
    quantity: 8,
  },
  {
    image: "Notepad.png",
    name: "Notepad",
    Price: "349",
    id: 11,
    quantity: 5,
  },
  {
    image: "Paints.png",
    name: "Paints",
    Price: "400",
    id: 12,
    quantity: 9,
  },
  {
    image: "Paperclips.png",
    name: "Paperclips",
    Price: "300",
    id: 13,
    quantity: 6,
  },
  {
    image: "Pen.png",
    name: "Pen",
    Price: "10",
    id: 14,
    quantity: 7,
  },
  {
    image: "Pencil.png",
    name: "Pencil",
    Price: "10",
    id: 15,
    quantity: 8,
  },
  {
    image: "Penstand.png",
    name: "Penstand",
    Price: "140",
    id: 15,
    quantity: 8,
  },
  {
    image: "Planner.png",
    name: "Planner",
    Price: "100",
    id: 15,
    quantity: 8,
  },
  {
    image: "Punches.png",
    name: "Punches",
    Price: "90",
    id: 15,
    quantity: 8,
  },
  {
    image: "Scissor.png",
    name: "Scissor",
    Price: "60",
    id: 15,
    quantity: 8,
  },
  {
    image: "Stapler.png",
    name: "Stapler",
    Price: "54",
    id: 15,
    quantity: 8,
  },
  {
    image: "StickyNote.png",
    name: "StickyNote",
    Price: "90",
    id: 15,
    quantity: 8,
  },
  {
    image: "Tapedispenser.png",
    name: "Tapedispenser",
    Price: "199",
    id: 15,
    quantity: 8,
  },
  {
    image: "Whitner.png",
    name: "Whitner",
    Price: "25",
    id: 15,
    quantity: 8,
  },
], { bufferMaxEntries: 0 } )
]);


const cartSchema = new mongoose.Schema({
  id: Number,
  image: String,
  name: String,
  username: String,
  cart_quantity: Number,
  product_quantity: Number,
  price: Number,
});

const cart = mongoose.model("cart", cartSchema);


const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, `${__dirname}/public/profile_pics`);
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage: storage });


app.use(express.static("public")); // using express static for routing
app.use(express.static("public/profile_pics"));
app.use(express.static("product_images"));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); //for parsing the form data

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

app.set("view engine", "ejs");

app.get("/", checkAuth, (req, res) => {
  res.redirect("/user");
});



// route chaining
app
  .route("/login")
  .get((req, res) => {
    console.log(req.session);
    if (req.session.isloggedin === true) {
      res.redirect("/user");
      return;
    }
    //else
    res.render("login", { error: "" });
  })
  .post(async (req, res) => {
    try {
      const data = await user.find();
      if (data.length === 0) {
        res.render("login", { error: "Signup First" });
        return;
      }

      let match = false;
      let verified = false;

      let pass = convertToHash(req.body.password);
      data.forEach((el) => {
        if (el.name === req.body.Username && el.password === pass) {
          match = true;
          if (el.isVerified === true) verified = true;
        }
      });

      if (match && verified) {
        req.session.isloggedin = true;
        req.session.username = req.body.Username;
        //req.session.filename = img_name; // Assuming img_name is defined elsewhere
        req.session.index = 0;
        req.session.isVerified = true;
        console.log(req.session);

        res.redirect("/user");
        return;
      } else if (!match) {
        res.render("login", { error: "Either Username Or Password is Wrong!" });
      } else if (!verified) {
        res.render("login", { error: "Your Account is not verified" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  });



  



  app
  .route("/signup")
  .get((req, res) => {
    if (req.session.isloggedin === true) {
      res.redirect("/user");
      return;
    }
    res.render("signup", { error: "" });
  })
  .post(upload.single("profile_pic"), async (req, res) => {
    // checking that all fields are filled or not
    if (!req.body.Username || !req.body.password || !req.body.password) {
      res.render("signup", { error: "Please Fill All Fields" });
      return;
    }

    try {
      const data = await user.find();
      let username_found = false;
      data.forEach((el) => {
        if (el.name === req.body.Username) username_found = true;
      });

      if (username_found) {
        res.render("signup", { error: "Username is Already Taken!" });
      } else {
        let pass = convertToHash(req.body.password);
        console.log(pass);

        const new_user = new user({
          name: req.body.Username,
          password: pass,
          isVerified: true,
        });

        await new_user.save();
        res.redirect("/login");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  });


  app.get("/user", async (req, res) => {
    console.log(req.session);
    if (!req.session.isloggedin) {
      res.redirect("/");
      return;
    }
  
    try {
      const data = await product.find();
      let arr = [];
  
      if (req.session.index < data.length - 1) {
        for (let i = 0; i < req.session.index + 5; i++) {
          if (data.length > i) {
            arr.push(data[i]);
            continue;
          }
          break;
        }
  
        // console.log(arr);
  
        res.render("user", {
          username: req.session.username,
          products_data: arr,
          isloggedin: true,
          disc: "",
        });
        return;
      }
  
      res.render("user", {
        username: req.session.username,
        products_data: data,
        isloggedin: false,
        disc: "",
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  });
  



app.get("/loadmore", (req, res) => {
  req.session.index = req.session.index + 5;
  res.redirect("/user");
});



app.get("/logout", (req, res) => {
  console.log(req.session);
  req.session.destroy();
  res.redirect("/");
});



app.get("/cart", async (req, res) => {
  try {
    if (!req.session.username) {
      res.redirect("/login");
      return;
    }
    
    // reading cart file to get information regarding if the user has added to the cart or not
    const data = await cart.find({ username: req.session.username });
    let arr = data.filter((el) => el.username === req.session.username);

    if (arr.length === 0) {
      res.render("cart", {
        username: req.session.username,
        isloggedin: true,
        error: "Cart Is Empty!!!",
        quantity: "",
      });
      return;
    }

    res.render("cart", {
      username: req.session.username,
      isloggedin: true,
      error: "",
      cart_data: arr,
      quantity: "",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});





app.get("/product", async (req, res) => {
  try {
    req.session.index = 14;
    const data = await product.find();
    let arr = [];

    if (req.session.index < data.length - 1) {
      for (let i = 0; i < req.session.index + 5; i++) {
        if (data.length > i) {
          arr.push(data[i]);
          continue;
        }
        break;
      }
      res.render("user", {
        username: req.session.username,
        products_data: arr,
        isloggedin: true,
        disc: "",
      });
    } else {
      res.render("user", {
        username: req.session.username,
        products_data: data,
        isloggedin: false,
        disc: "",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});






app.get("/add_to_cart", async (req, res) => {
  console.log(req.session);
  if (!req.session.isloggedin) {
    res.redirect("/login");
    return;
  }

  const { product_id } = req.query;

  try {
    const data = await cart.findOne({ username: req.session.username, id: parseInt(product_id) });
    console.log(data);

    if (data !== null) {
      if (data.username === req.session.username && data.id === parseInt(product_id)) {
        console.log("true");
        user_Exist_cart = true;
        res.redirect("/user");
        return;
      } else {
        const productData = await product.findOne({ id: parseInt(product_id) });

        let add_item = new cart({
          id: productData.id,
          image: productData.image,
          product_name: productData.name,
          username: req.session.username,
          cart_quantity: 1,
          product_quantity: productData.quantity,
          price: productData.Price,
        });
        await add_item.save();
        res.redirect("/user");
      }
    } else {
      const productData = await product.findOne({ id: parseInt(product_id) });

      let add_item = new cart({
        id: productData.id,
        image: productData.image,
        product_name: productData.name,
        username: req.session.username,
        cart_quantity: 1,
        product_quantity: productData.quantity,
        price: productData.Price,
      });
      await add_item.save();
      res.redirect("/user");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});




app.get("/remove_product_id", async (req, res) => {
  try {
    const { product_id } = req.query; // this product_id will be in string format

    await cart.deleteOne({ id: parseInt(product_id), username: req.session.username });
    res.redirect("/cart");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/plus_quantity", async (req, res) => {
  try {
    const { product_id } = req.query;

    const data = await cart.find({
      username: req.session.username,
      id: parseInt(product_id)
    });

    data.forEach((el) => {
      let cartquantity = el.cart_quantity + 1;
      if (cartquantity <= el.product_quantity) {
        cart.updateOne(
          { username: req.session.username, id: parseInt(product_id) },
          { cart_quantity: cartquantity }
        ).exec(); // Executing the update operation
      }
    });

    res.redirect("/cart");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});




app.get("/minus_quanity", async (req, res) => {
  try {
    const { product_id } = req.query;

    const data = await cart.find({
      username: req.session.username,
      id: parseInt(product_id)
    });

    data.forEach((el) => {
      let cartquantity = el.cart_quantity - 1;
      if (cartquantity >= 0) {
        cart.updateOne(
          { username: req.session.username, id: parseInt(product_id) },
          { cart_quantity: cartquantity }
        ).exec(); // Executing the update operation
      }
    });

    res.redirect("/cart");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});



app.get("/checkout", async (req, res) => {
  try {
    if (!req.session.username) {
      res.redirect("/login");
      return;
    }

    let amount = 0;

    const data = await cart.find({ username: req.session.username });

    data.forEach((el) => {
      amount += el.price * el.cart_quantity;
    });

    console.log(amount);
    res.render("checkout", {
      username: req.session.username,
      isloggedin: req.session.isloggedin,
      bill: amount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});


app.get("/buy", async (req, res) => {
  try {
    if (!req.session.username) {
      res.redirect("/");
      return;
    }
    await cart.deleteMany({ username: req.session.username });
    res.render("thankyou", {
      username: req.session.username,
      isloggedin: req.session.isloggedin,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = process.env.PORT

app.listen(PORT || 8000, (err) => {
  console.log(`Port is Listening`);
});
