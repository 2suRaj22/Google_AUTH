const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
// mongoose.connect(process.env.MONGODB_URI,
//    { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Connected to Database'))
//   .catch(err => console.log('Error connecting to database', err));


// mongoose.connect('mongodb://127.0.0.1/AUTH');

mongoose.connect(process.env.MONGO_URL);
const db= mongoose.connection;

//error
db.on('error', function(err) { console.log(err.message); });

//up and running then print the message
db.once('open', function() {
  
    console.log("Successfully connected to the database");

});