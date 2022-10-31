const mongoose = require('mongoose');


const connection = () => {
    mongoose.connect(process.env.DB_URL)
        .then(() => console.log('DB connected'))
        .catch(err => console.log(err, 'DB error'))
}

module.exports = connection;