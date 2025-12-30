const mongoose=require("mongoose");
const { title } = require("process");


const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    
    price: Number,
    location: String,
    description: String,
    image: {
        type: String,
        default: "https://via.placeholder.com/150"  // default image if none provided
    },
    country: String
})


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;



