const mongoose =  require('mongoose');

const DBconnection = (url)=>{
    console.log('database is trying to connect');
    mongoose.set({'debug':true});
    return mongoose.connect(url);
}
module.exports = DBconnection;