const assert = require('assert');
const User = require('../models/User');
const mongoose = require('mongoose');
const config = require('config');


// database connection
const dbURI = config.mongodbtest.uri;

mongoose.set('strictQuery', true);

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

describe('User Tests', () => {
    let userId;

    before(async () => {
        // Delete any previous test user records
        await User.deleteMany({});
    });

    it('should add a new user record to MongoDB', async () => {
        const userData = {
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123'
        };

        try {
            const user = await User.create(userData);
            userId = user._id;

            assert.strictEqual(user.username, userData.username);
            assert.strictEqual(user.email, userData.email);
        } catch (err) {
            throw new Error('Failed to add a new user record');
        }
    });

    it('should fail to add a new user with duplicate email', async () => {
        const userData = {
            username: 'testuser2',
            email: 'test@example.com',
            password: 'password456'
        };

        try {
            await User.create(userData);
            throw new Error('Duplicate email error was not thrown');
        } catch (err) {
            assert.strictEqual(err.code, 11000);
            assert.strictEqual(err.keyValue.email, userData.email);
        }
    });

    it('should log in successfully with the new user', async () => {
        const userData = {
            email: 'test@example.com',
            password: 'password123'
        };

        try {
            const user = await User.login(userData.email, userData.password);

            assert.strictEqual(user.email, userData.email);
            assert.strictEqual(user._id.toString(), userId.toString());
        } catch (err) {
            throw new Error('Failed to log in with the new user');
        }
    });

    after(async () => {
        // Clean up by deleting the test user record
        if (userId) {
            await User.findByIdAndDelete(userId);
        }
    });
});