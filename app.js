// Load dependencies
const path = require("path");
const express = require("express");
const userRoute = require("./routes/user");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const {
    checkForAuthenticationCookie,
} = require("./middlewares/authentication");
require("dotenv").config(); // Added to load environment variables

// Express instance
const app = express();
const PORT = process.env.PORT || 8000;

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log("MongoDB Connected");
        app.listen(PORT, () => {
            console.log(
                `Server started at PORT: ${PORT} in ${process.env.NODE_ENV || "development"
                } mode`
            );
        });
    })
    .catch((err) => console.error("MongoDB Connection Error:", err));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.join(__dirname, "public")));

// Home route
app.get("/", (req, res) => {
    res.render("home", {
        user: req.user || null,
    });
});

app.use("/user", userRoute);
