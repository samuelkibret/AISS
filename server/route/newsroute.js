import Express  from "express";
import { addnews, deletenews, getnews, getnewsbyuserid, updatenews } from "../controller/newscontroller.js";
import { upload } from "../controller/uploads.js";
import { authenticate } from "../middleware/authenticate.js";
const newsrouter=Express.Router();
//http://localhost:3000/addnews
newsrouter.post('/addnews',authenticate,upload.single('image'),addnews)
newsrouter.get('/getnews',getnews)
newsrouter.get('/getnewsbyuserid',authenticate,getnewsbyuserid)
newsrouter.put('/updatenews',authenticate,upload.single('image'),updatenews)
newsrouter.delete(`/deletenews/:id`,deletenews)
export default newsrouter;