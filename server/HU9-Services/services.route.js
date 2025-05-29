import Router from "express";
import service from "./model.service.js";

const router = Router();

router.get("/", async (req, res) => {
    const services = await service.find();
    res.json(services);
});

router.post("/", async (req, res) => {
    const { name, ID, direccion, description, startDate, endDate, estado, tipoDeServicio } = req.body;
    const newService = new service({name, ID, direccion, description, startDate, endDate, estado, tipoDeServicio})
    await newService.save();
    res.status(201).json(newService);
});

export default router;