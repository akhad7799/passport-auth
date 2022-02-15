import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    _id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
    googleID: string
}

const schema = new Schema<IUser>(
    {
        firstName: {
            type: String,
            required: [true, 'First Name is required'],
        },
        lastName: {
            type: String || null,
        },
        phoneNumber: {
            type: String,
            unique: [true, 'This phone number already exists'],
            lowercase: true,
        },
        email: {
            type: String,
            unique: [true, 'This email already exists'],
        },
        password: {
            type: String,
            minlength: 8,
            select: false,
        },
        googleID: String || null,
        telegramId: String || null
    },
    { timestamps: true },
);

schema.index({ phoneNumber: 1, email: 1 });

schema.pre('save', async function (/* this: Model<IUser>, */ next) {
    console.log(this.isModified('password'))
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    console.log(this.password, "password")
    next();
});

schema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};


export default mongoose.model<IUser>('User', schema);
