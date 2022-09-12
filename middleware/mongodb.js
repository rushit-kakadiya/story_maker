import mongoose from 'mongoose'

function connectDB() {
    if (mongoose.connections[0].readyState) {
        console.log("alredy connected")
        return
    }
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    mongoose.connection.on('connected', () => {
        console.log("connected to mongodb")
    })
    mongoose.connection.on('error', (err) => {
        console.log("error connecting", err)
    })
}

export default connectDB;