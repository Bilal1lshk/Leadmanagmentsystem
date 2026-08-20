import mongoose from "mongoose"
async function connectdb() {
    const url = process.env.MONGODB_URI
    if (!url) {
        throw new Error("Missing MongoDB connection string")
    }
    try {
        if (mongoose.connection.readyState === 1) return mongoose.connection
        return await mongoose.connect(url)
    }
    catch (err) {
        console.log(err.message, "failed")
        throw err
    }
}
export default connectdb
