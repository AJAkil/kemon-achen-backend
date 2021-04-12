const moongoose = require('mongoose');

const connectDB = async () => {
    const conn = await moongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useCreateIndex : true,
        useFindAndModify : false,
        useUnifiedTopology: true
    });

    console.log(`MongoDb connected: ${conn.connection.host}`.cyan.bold)
}

module.exports = connectDB;