import { ObjectId } from 'mongodb';
import { connect } from '../db/db.js';
import dotenv from 'dotenv';
import validator from 'validator';
import bcrypt from 'bcrypt';

dotenv.config();

class User {
    constructor({
        _id,
        username,
        email,
        password,
        createdAt,
        updatedAt,
        profile,
        settings,
        status,
        roles,
        userId,
        refreshToken
    } = {}) {
        this._id = _id;
        this.username = username;
        if (!validator.isEmail(email)) {
            throw new Error('Invalid email format');
        }
        this.password = password;
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
        this.userId = userId;
        this.refreshToken = refreshToken;
    }

    static async create(userData) {
        const db = await connect();
    
        // Check if a user with the given username or email already exists
        const existingUser = await db.collection('users').findOne({
            $or: [
                { username: userData.username },
                { email: userData.email }
            ]
        });
    
        if (existingUser) {
            throw new Error('User creation failed: Username or email already exists');
        }
    
        const result = await db.collection('users').insertOne(userData);
        if (!result.insertedId) {
            throw new Error('User creation failed: No document was inserted');
        }
        return new User({ _id: result.insertedId, ...userData });
    }

    static async deleteRefreshToken(userId) {
        const db = await connect();
    
        // Delete the refresh token
        const result = await db.collection('users').updateOne(
            { _id: new ObjectId(userId) },
            { $unset: { refreshToken: "" } }
        );
    
        if (result.modifiedCount === 0) {
            throw new Error('No user found with this id');
        }
    }

    static async findUserAndCompareToken(userId, refreshToken) {
        const db = await connect();
    
        // Find the user
        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    
        if (!user) {
            throw new Error('No user found');
        }
    
        // Compare the given refresh token with the stored hashed refresh token
        const match = await bcrypt.compare(refreshToken, user.refreshToken);
    
        if (!match) {
            throw new Error('Invalid refresh token');
        }
    
        // If the tokens match, return the user
        return new User(user);
    }
    
    static async findUserIdAndUpdateTokenStatus(userId, refreshToken) {
        console.log('userId:', userId);
        const db = await connect();
    
        // Hash the refresh token
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    
        const result = await db.collection('users').findOneAndUpdate(
            { _id: new ObjectId(userId) },
            { $set: { refreshToken: hashedRefreshToken } },
            { returnOriginal: false, projection: { password: 0 } }
        );
    
        if (!result) {
            throw new Error('No user found to update');
        }
        return new User(result);
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

    static async findByUsernameOrEmail(login) {
        console.log('login:', login);
        const db = await connect();
        const query = {
            $or: [
                { username: login },
                { email: login }
            ]
        };
    
        const result = await db.collection('users').findOne(query);
        if (!result) {
            throw new Error('User not found');
        }
        // Return the user with the password
        return new User(result);
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
        return new User(userWithoutPassword);
    }

    static async findAll() {
        const db = await connect();
        const result = await db.collection('users').find().toArray();
        return result.map(user => new User(user));
    }

}

export default User;