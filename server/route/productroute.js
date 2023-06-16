import Express  from "express";
import { upload } from "../controller/uploads.js";
import { addproduct, deleteproduct, getproduct, getproductbyuserid, updateproduct } from '../controller/productcontroller.js'
import { authenticate } from "../middleware/authenticate.js";
const productrouter=Express.Router();
//http://localhost:3000/addnews
productrouter.post('/addproduct',authenticate,upload.single('image'),addproduct)
productrouter.get("/getproductbyuserid/",authenticate,getproductbyuserid)
productrouter.get('/getproducts',authenticate,getproduct)
productrouter.put('/updateproduct/:id',authenticate,upload.single('image'),updateproduct)
productrouter.delete('/deleteproduct/:id',authenticate,deleteproduct)
export default productrouter;