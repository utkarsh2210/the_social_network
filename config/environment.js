

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
            user: '',
            pass: ''
        }
    },
    google_client_id: "886167792839-2i5in2lhbt46vb11niuuhpi8aft29mll.apps.googleusercontent.com",
    google_client_secret: "X6s0Up1cr9U7Moo1Aboj_K8Y",
    google_call_back_url: "http://localhost:8000/users/auth/google/callback",
    jwt_secret: 'thesocialnetwork',
}


const production = {
    name: 'production'
}


module.exports = development;