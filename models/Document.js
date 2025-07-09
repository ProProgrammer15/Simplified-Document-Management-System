const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const documentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxLength: 255
    },
    content: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}
}
)

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
