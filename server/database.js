import mongoose from "mongoose"

const URI = "mongodb://localhost:27017"

mongoose.connect(URI)

    .then(db=>console.log("DB conectada"))
    .catch(err => console.log(err))