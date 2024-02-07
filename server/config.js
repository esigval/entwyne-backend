import dotenv from 'dotenv';
dotenv.config();

// Config settings for Open AI models
export const modelVersion35 = `gpt-3.5-turbo-1106`;
export const modelVersion = `gpt-4-1106-preview`;

// Config settings for S3 buckets
export const config = {
  production: {
    EXTRACTION_BUCKET: process.env.PROD_EXTRACTION_BUCKET,
    NORMALIZATION_BUCKET: process.env.PROD_NORMALIZATION_BUCKET,
    CONCATENATION_BUCKET: process.env.PROD_CONCATENATION_BUCKET,
    TRANSITIONFX_BUCKET: process.env.PROD_TRANSITIONFX_BUCKET,
    MUSICAUDIO_BUCKET: process.env.PROD_MUSICAUDIO_BUCKET,
  },
  development: {
    EXTRACTION_BUCKET: process.env.DEV_EXTRACTION_BUCKET,
    NORMALIZATION_BUCKET: process.env.DEV_NORMALIZATION_BUCKET,
    CONCATENATION_BUCKET: process.env.DEV_CONCATENATION_BUCKET,
    TRANSITIONFX_BUCKET: process.env.DEV_TRANSITIONFX_BUCKET,
    MUSICAUDIO_BUCKET: process.env.DEV_MUSICAUDIO_BUCKET,
  }
};

export const env = process.env.NODE_ENV || 'development'; // Default to 'development' if NODE_ENV is not set

export const buckets = config[env];