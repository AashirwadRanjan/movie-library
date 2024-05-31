// const mongoose = require('mongoose');

// mongoose.connect("mongodb+srv://vishal_chy01:pz5mwtg7NmHPY1Vu@cluster0.d8chuvr.mongodb.net/?retryWrites=true&w=majority").then(()=> {
//     console.log("Database Successfully connected");
// }).catch((err)=>{
//     console.log("Error connecting to Database");
//     console.log(err)
// })

const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

mongoose.connect("mongodb://0.0.0.0:27017/movlib").then(() => {
    console.log("Database Successfully connected");
}).catch((err) => {
    console.log(err);
})