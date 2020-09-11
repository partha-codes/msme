const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("./model/user")
const cors = require("cors");
const ejs = require("ejs");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 4000;
var conString = process.env.ATLAS_URI;
const { initPayment, responsePayment } = require("./paytm/services/index");

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/views"));
app.use("/assets", express.static(__dirname + "/assets"));
app.set("view engine", "ejs");

//connect to the database
mongoose.connect(conString, { useNewUrlParser: true }, () => {
    console.log("DB is connected");

})


//the routes go here
app.get("/", (req, res) => {
    res.render("index");
})



app.get("/policy", (req, res) => {
    res.render("returnpolicy.ejs")
})

app.get("/termsandcondition", (req, res) => {
    res.render("T&C.ejs")
})

app.get("/privacypolicy", (req, res) => {
    res.render("privacypolicy.ejs")
})



app.post("/register", (req, res) => {

    const user = new User(req.body);
    console.log(user)
    console.log("we are here ");

    //save the user
    user.save((err, user) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ msg: "Unable to save the  user" })
        }
        else {
            console.log("the user was saved");
            res.redirect("/paywithpaytm")
        }

    })
})





app.get("/paywithpaytm", (req, res) => {




    //initialize the payment
    initPayment().then(
        success => {
            res.render("paytmRedirect.ejs", {
                resultData: success,
                paytmFinalUrl: process.env.PAYTM_FINAL_URL
            });
        },
        error => {
            res.send(error);
        }
    );
});

app.post("/paywithpaytmresponse", (req, res) => {
    responsePayment(req.body).then(
        success => {
            res.render("response.ejs", { resultData: "true", responseData: success });
        },
        error => {
            res.send(error);
        }
    );
});

app.listen(PORT, () => {
    console.log("Running on " + PORT);
});
