import Router from "express";
import Service from "./model.service.js";

const router = Router();

router.get("/", async (req, res) => {
    const services = await Service.find();
    res.json(services);
});

router.post("/", async (req, res) => {
    const { nameService, ID, direccion, description, startDate, endDate, status, tipoDeServicio } = req.body;
    const newService = new Service({nameService, ID, direccion, description, startDate, endDate, status, tipoDeServicio});
    await newService.save();
    res.status(201).json(newService);
});

export default router;