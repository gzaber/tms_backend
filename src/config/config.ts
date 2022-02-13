import dotenv from 'dotenv';

dotenv.config();
// =============================================================================
const MONGO_OPTIONS = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    socketTimeoutMS: 30000,
    keepAlive: true,
    retryWrites: false
};
const MONGO_URL = process.env.MONGO_URL as string;

const MONGO = {
    url: MONGO_URL,
    options: MONGO_OPTIONS
};
// =============================================================================
const EMAIL_HOST = process.env.EMAIL_HOST as string;
const EMAIL_USER = process.env.EMAIL_USER as string;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD as string;
const EMAIL_SENDER = process.env.EMAIL_SENDER as string;
const EMAIL_VERIFICATION_EXPIRE_TIME = process.env.EMAIL_VERIFICATION_EXPIRE_TIME as string;

const EMAIL = {
    hostname: EMAIL_HOST,
    username: EMAIL_USER,
    password: EMAIL_PASSWORD,
    sender: EMAIL_SENDER,
    verification: { expireTime: EMAIL_VERIFICATION_EXPIRE_TIME }
};
// =============================================================================
const SERVER_PORT = process.env.SERVER_PORT as string;
const SERVER_HOST = process.env.SERVER_HOST as string;
const SERVER_LOGIN_TOKEN_EXPIRETIME = process.env.SERVER_LOGIN_TOKEN_EXPIRETIME as string;
const SERVER_CONFIRMATION_TOKEN_EXPIRETIME = process.env
    .SERVER_CONFIRMATION_TOKEN_EXPIRETIME as string;
const SERVER_TOKEN_ISSUER = process.env.SERVER_TOKEN_ISSUER as string;
const SERVER_TOKEN_SECRET = process.env.SERVER_TOKEN_SECRET as string;

const SERVER = {
    host: SERVER_HOST,
    port: SERVER_PORT,
    token: {
        loginExpireTime: SERVER_LOGIN_TOKEN_EXPIRETIME,
        confirmationExpireTime: SERVER_CONFIRMATION_TOKEN_EXPIRETIME,
        issuer: SERVER_TOKEN_ISSUER,
        secret: SERVER_TOKEN_SECRET
    }
};
// =============================================================================
const config = {
    server: SERVER,
    mongo: MONGO,
    email: EMAIL
};

export default config;
