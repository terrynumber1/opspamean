var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var opspa1Schema = new Schema({
    // google Mongoose data type
    pa: { type: Number, default: '' },
    source: { type: String, default: '' },
    client: { type: String, default: '' },
    note: { type: String, default: '' },
    update: { type: String, default: '' },
    initial: { type: String, default: '' }
});

var pamongo = mongoose.model('pa1', opspa1Schema);

module.exports = pamongo;