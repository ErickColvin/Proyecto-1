import mongoose from "mongoose"

// La conexión se lee de la variable de entorno MONGODB_URI; nunca va escrita en el código
const URI = process.env.MONGODB_URI || "mongodb://localhost:27017/DataUp"

mongoose.connect(URI)

    .then(db=>console.log("DB conectada"))
    .catch(err => console.log(err))