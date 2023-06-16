import Express  from "express";
import {changePassword, getAllUsers, getUserById, login, logout, register, removeAccount, updateAccount, updateUserRole} from "../controller/usercontroller.js";
import { authenticate } from "../middleware/authenticate.js";
import { upload } from "../controller/uploads.js";
const userrouter=Express.Router();
userrouter.post('/register',upload.single('image'),register)
userrouter.get('/getallusers',getAllUsers)
userrouter.get('/getuserbyid',authenticate,getUserById)
userrouter.delete('/removeuser/:id',authenticate,removeAccount)
userrouter.post('/updateuser/:id',upload.single('image'),updateAccount)
userrouter.post('/login',login)
userrouter.post('/changepassword',authenticate,changePassword)
userrouter.post('/updateuserole',authenticate,updateUserRole)
userrouter.post('/api/logout', authenticate,logout)
export default userrouter;