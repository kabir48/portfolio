const nodemailer = require('nodemailer');
const dotEnv = require('dotenv');
dotEnv.config({
    path: './config.env'
});

const EmailHelper = async({ EmailTo, EmailText, emailSubject }) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD
            }
        });

        let mailOptions = {
            from: process.env.MAIL_USER,
            to: EmailTo,
            subject: emailSubject,
            text: EmailText,
        };

        return await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

module.exports = EmailHelper;