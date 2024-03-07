import dotenv from 'dotenv';
import sendMessage from '../utils/sendSESMEssage.js';
import User from '../models/userModel.js';
import { config } from '../config.js';
import jwt from 'jsonwebtoken';