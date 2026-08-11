import mongoose from "mongoose"
async function connectdb(params) {
    const url = process.env.MONGODB_URI
    if (!url) {
        console.log("mongodb connection string is not defined")
        return
    }
    try {
        const connectdb = await mongoose.connect(url)
        if (!connectdb) return
    }
    catch (err) {
        console.log(err.message, "failed")

    }
}
export default connectdb