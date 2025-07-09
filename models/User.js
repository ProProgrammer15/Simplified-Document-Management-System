const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: async function(value) {
                const user = await this.constructor.findOne({ email: value });
                if (user) {
                    throw new Error('Email already exists');
                }
            },
            message: 'Email already exists'
        }
    },
    password: {
        type: String,
        required: true,    
    },
    role: {
        type: String,
        enum: ['regular_user', 'admin'],
        default: 'regular_user',
    },
}, {
    timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}
}
);

// Password hashing middleware
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
