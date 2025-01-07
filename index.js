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
const customerRoute = require("./routes/customer/customer");
const orderRoute = require("./routes/customer/order");
const cartRoute = require("./routes/customer/cart");
const fileRoute = require("./routes/customer/file");


const PORT = process.env.PORT || 8070;
// Allow requests from the specified origin
const corsOptions = {
    origin: process.env.FRONTEND_URL, // Use the FRONTEND_URL from .env (FRONTEND_URL=http://localhost:5173)
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
app.use("/api/customer", customerRoute);
app.use("/api/order", orderRoute);
app.use("/api/cart", cartRoute);
app.use("/api/file", fileRoute);

console.log("Server is running on port:", process.env.PORT);
console.log("Connecting to MongoDB URL:", process.env.MONGODB_URL);
console.log("Frontend URL:", process.env.FRONTEND_URL);



app.listen(PORT,() =>{

    console.log(`Server is up and running on port number: ${PORT}`);
})