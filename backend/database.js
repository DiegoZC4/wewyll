const mongoose = require('mongoose');
const connection = "mongodb+srv://Diego:eKN4KgcFPF796gp@wewyll.oeoce.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(connection,{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
    .then(() => console.log("Database Connected Successfully"))
    .catch(err => console.log(err));