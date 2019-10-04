const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
function connect() {
  mongoose.connect('mongodb://rasgo.iptime.org:27017/toapp6', function( err ) {
    if ( err ) {
      console.error('mongodb connection error', err);
    } else {
      console.log('mongodb connected');
    }
  });
}

module.exports = () => {
  connect();
  mongoose.connection.on('disconnected', connect);
};