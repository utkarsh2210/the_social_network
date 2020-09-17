const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');


const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
});


const development = {
    name: 'development',
    asset_path: '/assets',
    session_cookie_key: 'blahsomething',
    db: 'thesocialnetwork_development',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.THE_SOCIAL_NETWORK_GMAIL_USERNAME,
            pass: process.env.THE_SOCIAL_NETWORK_GMAIL_PASSWORD
        }
    },
    google_client_id: "886167792839-2i5in2lhbt46vb11niuuhpi8aft29mll.apps.googleusercontent.com",
    google_client_secret: "X6s0Up1cr9U7Moo1Aboj_K8Y",
    google_call_back_url: "http://localhost:8000/users/auth/google/callback",
    jwt_secret: 'thesocialnetwork',
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    }
}


const production = {
    name: 'production',
    asset_path: process.env.THE_SOCIAL_NETWORK_ASSET_PATH,
    session_cookie_key: process.env.THE_SOCIAL_NETWORK_SESSION_COOKIE_KEY,
    db: process.env.THE_SOCIAL_NETWORK_DB,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.THE_SOCIAL_NETWORK_GMAIL_USERNAME,
            pass: process.env.THE_SOCIAL_NETWORK_GMAIL_PASSWORD
        }
    },
    google_client_id: process.env.THE_SOCIAL_NETWORK_GOOGLE_CLIENT_ID,
    google_client_secret: process.env.THE_SOCIAL_NETWORK_GOOGLE_CLIENT_SECRET,
    google_call_back_url: process.env.THE_SOCIAL_NETWORK_GOOGLE_CALLBACK_URL,
    jwt_secret: process.env.THE_SOCIAL_NETWORK_JWT_SECRET,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }
}


module.exports = eval(process.env.THE_SOCIAL_NETWORK_ENVIRONMENT) == undefined ? development : eval(process.env.THE_SOCIAL_NETWORK_ENVIRONMENT);