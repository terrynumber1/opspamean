var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var opspa1Schema = new Schema({
    pa: { type: String, default: 'default value pa' },
    source: { type: String, default: '' },
    client: { type: String, default: '' },
    note: { type: String, default: '' },
    update: { type: Date, default: '' },
    initial: { type: String, default: '' }
});

var pamongo = mongoose.model('pa1', opspa1Schema);

module.exports = pamongo;