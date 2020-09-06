const queue = require('../config/kue');

const resetPassMailer = require('../mailers/reset_password_mailer');

queue.process('reset_pass_email', function(job, done){
    console.log('Emails worker is processing a job', job.data);

    resetPassMailer.resetPassword(job.data);

    done();
});