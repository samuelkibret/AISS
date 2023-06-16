import Express  from "express";
import { addcrops, deleteCrop, deleteMarketData, getcrops, updateMarketData } from "../controller/marketcontroller.js";

const marketrouter=Express.Router();
//http://localhost:3000/addnews
marketrouter.post('/addcrops',addcrops)
marketrouter.get("/getcrop",getcrops)
marketrouter.delete("/deletecrop",deleteCrop)
marketrouter.put("/updatemarketdata",updateMarketData)
marketrouter.delete("/deletemarketdata",deleteMarketData)
export default marketrouter;