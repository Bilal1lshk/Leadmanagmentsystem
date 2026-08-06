import mongoose from "mongoose"
async function connectdb(params) {
    const url = process.env.MONGODB_URI
    if (!url) {
        console.log("mongodb connection string is not defined")
        return
    }
    try {
        const connectdb = await mongoose.connect(url)
        console.log("Database:", mongoose.connection.name);
        console.log("Host:", mongoose.connection.host);
        if (!connectdb) console.log("database didnt connected")
        console.log("connected succesfully")
    }
    catch (err) {
        console.log(err.message, "failed")

    }
}
export default connectdb