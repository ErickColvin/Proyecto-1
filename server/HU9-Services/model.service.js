import { Schema, model } from "mongoose";

const serviceSchema = new Schema({
    name:{type:String, required:true},
    ID:{type:String, required:true}, 
    direccion:{type:String, required:true}, 
    description:{type:String, required:true}, 
    startDate:{type:Date, required:true}, 
    endDate:{type:Date, required:true}, 
    estado:{type:String, required:true}, 
    tipoDeServicio:{type:String, required:true}, 
});

export default model("service", serviceSchema);