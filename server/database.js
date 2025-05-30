import mongoose from "mongoose"

const URI = "mongodb+srv://benjaminberrios:ds3P808U5eZhY8Kx@cluster0.4h6c4n8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(URI)

    .then(db=>console.log("DB conectada"))
    .catch(err => console.log(err))