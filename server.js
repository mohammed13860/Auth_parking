
require("dotenv").config();
const express = require("express");
const connectDB = require("./config/dbConnect");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const corsOptions = require("./config/corsOptions");
const cookieparser = require("cookie-parser"); //middleware
const app = express();
app.use(cors(corsOptions));
app.use(cookieparser());
app.use(express.json());
const authRoutes = require('./routes/authRoutes');
const users = require('./routes/userRoutes');
app.use("/users",users);

app.use("/", express.static(path.join(__dirname, "public")));
app.use("/", require("./routes/root"));
app.use('/auth', authRoutes);  // Make sure authRoutes is a middleware function, not an object

app.all("*", (req, res)=>{
    res.status(404);
    if (req.accepts("html")){
        res.sendFile(path.join(__dirname, "views", "404.html"));
    } else if (req.accepts("json")){
        res.json({message: "404 not found"});
    } else {
        res.type("txt").send("404 not found");
    }
});

// Define routes

// app.use("/api/auth", require("./routes/auth"));
// app.use("/api/users", require("./routes/users"));
// app.use("/api/posts", require("./routes/posts"));
// app.use("/api/comments", require("./routes/comments"));
// app.use("/api/likes", require("./routes/likes"));
// app.use("/api/notifications", require("./routes/notifications"));



const port = process.env.PORT || 3000;

connectDB();

mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    app.listen(port , ()=> {
    console.log(`Server is running on port ${port}`);
   });
});
mongoose.connection.on("error", (err) => {
    console.log(err);
});
