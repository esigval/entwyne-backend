import { ObjectId } from 'mongodb';
import { connect } from '../db/db.js';
import dotenv from 'dotenv';
dotenv.config();

class User {
    constructor({
        _id,
        username,
        email,
        hashedPassword,
        createdAt,
        updatedAt,
        profile,
        settings,
        status,
        roles
    } = {}) {
        this._id = _id;
        this.username = username;
        this.email = email;
        this.hashedPassword = hashedPassword;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.profile = profile ? {
            firstName: profile.firstName,
            lastName: profile.lastName,
            avatarUrl: profile.avatarUrl,
            bio: profile.bio
        } : {};
        this.settings = settings ? {
            notifications: {
                email: settings.notifications.email,
                push: settings.notifications.push
            }
        } : {};
        this.status = status;
        this.roles = roles;
    }

    static async create(userData) {
        const db = await connect();
        const result = await db.collection('users').insertOne(userData);
        if (!result.insertedId) {
            throw new Error('User creation failed: No document was inserted');
        }
        return new User({ _id: result.insertedId, ...userData });
    }
    static async findByIdAndDelete(userId) {
        const db = await connect();
        const result = await db.collection('users').deleteOne({ _id: new ObjectId(userId) });
        if (result.deletedCount === 0) {
            throw new Error('No user found to delete');
        }
        return result;
    }

    static async findByIdAndUpdate(userId, updateData) {
        const db = await connect();
        const result = await db.collection('users').findOneAndUpdate(
            { _id: new ObjectId(userId) },
            { $set: updateData },
            { returnOriginal: false }
        );
        if (!result.value) {
            throw new Error('No user found to update');
        }
        return new User(result.value);
    }

    static async findById(userId) {
        const db = await connect();
        if (!(userId instanceof ObjectId)) {
            try {
                userId = new ObjectId(userId);
            } catch (error) {
                throw error;
            }
        }
        const result = await db.collection('users').findOne({ _id: userId });
        if (!result) {
            throw new Error('No user found');
        }
        return new User(result);
    }

    static async findAll() {
        const db = await connect();
        const result = await db.collection('users').find().toArray();
        return result.map(user => new User(user));
    }

}

export default User;