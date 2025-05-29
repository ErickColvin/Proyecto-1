import { Schema, model } from "mongoose";

const serviceSchema = new Schema({
    nameService: { type: String},
    ID: { type: String, required: true },
    direccion: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String },       // was `estado`, now matches front-end
    tipoDeServicio: { type: String },
});

export default model("service", serviceSchema);