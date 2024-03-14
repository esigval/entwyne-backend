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
        refreshToken,
        emailVerifiedToken
    } = {}) {
        this._id = _id;
        this.username = username;
        if (!validator.isEmail(email)) {
            throw new Error('Invalid email format');
        }
        this.email = email;
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
        this.refreshToken = refreshToken;
        this.emailVerifiedToken = emailVerifiedToken;
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

    static async deletePasswordAndReplaceWithHash(userId, password) {
        console.log(`Starting password update for user: ${userId}`);
        const db = await connect();
        console.log('userId:', userId);
        console.log('password', password);

        // Hash the password
        console.log('About to hash password');
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Finished hashing password');

        // Update the user's passwordy
        const result = await db.collection('users').updateOne(
            { _id: new ObjectId(userId) },
            { $set: { password: hashedPassword } }
        );

        console.log(`Update operation result: ${JSON.stringify(result.result)}`);

        if (result.modifiedCount === 0) {
            console.error('No user found with this id');
            throw new Error('No user found with this id');
        }

        console.log('Password update successful');
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

    static async storeEmailChangeToken(userId, token) {
        const db = await connect();
    
        // Store the email change token
        const result = await db.collection('users').updateOne(
            { _id: new ObjectId(userId) },
            { $set: { emailVerifiedToken: token } }
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
    
        // Check if username or email already exists in the database
        const existingUser = await db.collection('users').findOne({
            $or: [
                { username: updateData.username },
                { email: updateData.email }
            ]
        });
    
        if (existingUser && existingUser._id.toString() !== userId) {
            throw new Error('Username or email already exists');
        }
    
        await db.collection('users').findOneAndUpdate(
            { _id: new ObjectId(userId) },
            { $set: updateData }
        );
    
        const updatedUser = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    
        if (!updatedUser) {
            throw new Error('No user found to update');
        }
    
        return new User(updatedUser);
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
            console.error('Invalid user ID:', error);
            return null; // return null if userId is not a valid ObjectId
        }
    }
    const result = await db.collection('users').findOne({ _id: userId });
    if (!result) {
        return null; // return null if no user is found
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