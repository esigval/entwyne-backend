import dotenv from 'dotenv';
dotenv.config();

// Config settings for Open AI models
export const modelVersion35 = `gpt-3.5-turbo-1106`;
export const modelVersion = `gpt-4-1106-preview`;

export const tokenExpiration = `1h`;
export const refreshTokenExpiration = `30d`;

// Config settings for S3 buckets
export const config = {
  production: {

    // S3 Buckets
    EXTRACTION_BUCKET: process.env.PROD_EXTRACTION_BUCKET,
    NORMALIZATION_BUCKET: process.env.PROD_NORMALIZATION_BUCKET,
    CONCATENATION_BUCKET: process.env.PROD_CONCATENATION_BUCKET,
    TRANSITIONFX_BUCKET: process.env.PROD_TRANSITIONFX_BUCKET,
    MUSICAUDIO_BUCKET: process.env.PROD_MUSICAUDIO_BUCKET,
    THUMBNAIL_BUCKET: process.env.PROD_THUMBNAIL_BUCKET,
    AUDIO_BUCKET: process.env.PROD_AUDIO_BUCKET,
    
    // Database
    MONGODB_URI: process.env.PROD_MONGODB_URI,

    // ENVIROMENT
    PROD_ENV: process.env.PROD_ENV,

    SESSION_SECRET: process.env.PROD_SESSION_SECRET,
    REFRESH_TOKEN_SECRET: process.env.PROD_REFRESH_TOKEN_SECRET,
    SESSION_TRACKING_SECRET: process.env.PROD_SESSION_TRACKING_SECRET
    
  },
  development: {
    EXTRACTION_BUCKET: process.env.DEV_EXTRACTION_BUCKET,
    NORMALIZATION_BUCKET: process.env.DEV_NORMALIZATION_BUCKET,
    CONCATENATION_BUCKET: process.env.DEV_CONCATENATION_BUCKET,
    TRANSITIONFX_BUCKET: process.env.DEV_TRANSITIONFX_BUCKET,
    MUSICAUDIO_BUCKET: process.env.DEV_MUSICAUDIO_BUCKET,
    THUMBNAIL_BUCKET: process.env.DEV_THUMBNAIL_BUCKET,
    AUDIO_BUCKET: process.env.DEV_AUDIO_BUCKET,

    // Database
    MONGODB_URI: process.env.DEV_MONGODB_URI,

    // ENVIROMENT
    PROD_ENV: process.env.DEV_ENV,

    // 
    
    SESSION_SECRET: process.env.DEV_SESSION_SECRET,
    REFRESH_TOKEN_SECRET: process.env.DEV_REFRESH_TOKEN_SECRET,
    SESSION_TRACKING_SECRET: process.env.DEV_SESSION_TRACKING_SECRET
  },

  local: {

    // Database
    MONGODB_URI: process.env.LOCAL_MONGODB_URI,

    // ENVIROMENT
    PROD_ENV: process.env.LOCAL_ENV,

    // SESSION
    
    SESSION_SECRET: process.env.LOCAL_SESSION_SECRET,
    REFRESH_TOKEN_SECRET: process.env.LOCAL_REFRESH_TOKEN_SECRET,
    SESSION_TRACKING_SECRET: process.env.LOCAL_SESSION_TRACKING_SECRET
  }
};



export const env = process.env.NODE_ENV || 'development'; // Default to 'development' if NODE_ENV is not set

export const buckets = config[env];