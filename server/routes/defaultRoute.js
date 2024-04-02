import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js';
import { config } from '../config.js';
import dotenv from 'dotenv';
dotenv.config();

const environment = process.env.NODE_ENV || 'local';
const currentConfig = config[environment];

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        res.json({});
    } catch (error) {
        res.status(500).json({ error: 'Failed to get presigned URL' });
    }
});

export default router;