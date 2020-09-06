const nodeMailer = require('../config/nodemailer');

exports.resetPassword = (token) => {
    
    nodeMailer.transporter.sendMail({
        from: 'thesocialnetwok@social.com',
        to: token.user.email,
        subject: "Reset Password",
        html: `<h2> Dear ${ token.user.name }, </h2><br><br>
        <h3> Click on the following link to reset your password </h3>
        <p> https://localhost:8000/reset_password/reset/${token.access_token}</p>`
     }, (err, info) => {
         if (err){
             console.log('Error in sending mail', err);
             return;
         }
 
         console.log('Message sent', info);
         return;
     });
}