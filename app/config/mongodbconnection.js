import mongoose  from "mongoose"
async function connectdb(params) {
    try {
        const connectdb = await mongoose.connect(process.env.mongodbsecret)
        if (!connectdb) console.log("database didnt connected")
        console.log("connected succesfully")
    }
    catch (err) {
        console.log(err.message,"failed")

    }
}
export default connectdb