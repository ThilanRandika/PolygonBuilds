const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const app = express(); 
require("dotenv").config();


// Import admin routes
const customizationRoute = require("./routes/admin/customization");
const adminOrderRoute = require("./routes/admin/order");

// Import customer routes
const orderRoute = require("./routes/customer/order");
const cartRoute = require("./routes/customer/cart");


const PORT = process.env.PORT || 8070;
// Allow requests from the specified origin
const corsOptions = {
    origin: 'http://localhost:5173', // Change this to your frontend URL
    credentials: true, // Include credentials (cookies, authorization headers, etc.)
  };
  
app.use(cors(corsOptions));
app.use(bodyParser.json());


const URL = process.env.MONGODB_URL;

mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //useCreateIndex: true, 
    //useFindAndModify: false
});


const connection = mongoose.connection;
connection.once("open", ()=> {
    console.log("Mongodb Connection Success!");

})


// Use admin routs
app.use("/api/customization", customizationRoute);
app.use("/api/adminOrder", adminOrderRoute);

// Use customer routs
app.use("/api/order", orderRoute);
app.use("/api/cart", cartRoute);


app.listen(PORT,() =>{

    console.log(`Server is up and running on port number: ${PORT}`);
})