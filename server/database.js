import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

// La conexión se lee de server/.env (ver server/.env.example); nunca va escrita en el código
const URI = process.env.MONGODB_URI || "mongodb://localhost:27017/DataUp"

mongoose.connect(URI)

    .then(db=>console.log("DB conectada"))
    .catch(err => console.log(err))