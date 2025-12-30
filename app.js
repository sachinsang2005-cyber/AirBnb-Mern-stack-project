const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const Listing = require("./models/listing.js");
const ejsmate=require("ejs-mate");
const ExpressError=require("./utils/expressError.js");

const app = express();

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine("ejs",ejsmate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/travel")
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));


// =================== ROUTES =================== //

// this is home route
app.get("/", (req, res) => {
    res.redirect("/listings");
});


// Home -> all listings
app.get("/listings", async (req, res) => {
    let alllisting = await Listing.find({});
    res.render("listings/index", { alllisting });
});

// New listing form
app.get("/listings/new", (req, res) => {
    res.render("listings/new");
});

// Create new listing
app.post("/listings", async (req, res, next) => {
    try {
        let newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    } catch (err) {
        next(err);
    }
});


// Show a single listing
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id);
    res.render("listings/show", { list });
});

// Edit form
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id);
    res.render("listings/edit", { list });
});

// Update listing
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing);
    res.redirect(`/listings/${id}`);
});

// Delete listing
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});


// Catch-all route (for all undefined paths)
app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

// Error-handling middleware (must be last)
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).send(message);
});



// Start server
app.listen(8080, () => {
    console.log("Server running on http://localhost:8080");
});

// upload this project to github
// git init
// git add .            to add all files
// git commit -m "initial commit"
// git branch -M main       
// git remote add origin <your-repo-url>
// git pull origin main --allow-unrelated-histories ----> to avoid error manage existing repo
// git push -u origin main