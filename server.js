const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("./model/user")
//const nodemailer = require("nodemailer")
const cors = require("cors");
//const expressValidator = require("express-validator")
const app = express();
// const transporter = require("./paytm/services/msg")
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
const urlencodedPersor = bodyParser.urlencoded({ extended: false })

//connect to the database
mongoose.connect(conString, { useNewUrlParser: true }, () => {
    console.log("DB is connected");

})


//the routes go here
app.get("/", (req, res) => {
    var err = null;
    res.render("index", { errmsg: err });
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

    //lets save the user first
    const user = new User(req.body)
    user.save((err, user) => {
        if (err) {
            console.log(err);
            res.render("index", { errmsg: err })
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