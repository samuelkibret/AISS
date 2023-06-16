

import dotev from 'dotenv'
import mongoose from 'mongoose'
dotev.config()

export const CONNECTDB = async() => {
    try {
        const url = process.env.MONGO_URI
        const conn  = await mongoose.connect(url)
        console.log('Mongodb Connected !!!')
    } catch (error) {
        
        console.log(error)
        process.exit(1)
    }
}

export default CONNECTDB;

// mongoose.connect("mongodb+srv://melkamu:5vDrBMFP6Cy3FK8z@clusterone.ocze1ih.mongodb.net/?retryWrites=true&w=majority")
// .then(()=>{
//     app.listen(5000,()=>{
//         console.log("runnning");
//     })

// }).catch((e)=>{console.log('melkamu is here')})
