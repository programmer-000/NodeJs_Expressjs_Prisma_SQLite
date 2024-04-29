import process from 'process'; // Importing process module to access environment variables
import * as nodemailer from 'nodemailer'; // Importing nodemailer for email sending

/**
 * Handles sending emails using nodemailer.
 * @param existingUser The existing user object.
 * @param email The recipient email address.
 * @param subject The subject of the email.
 * @param htmlContent The HTML content of the email.
 * @param text The plain text content of the email.
 */
export async function handlerEmailSending(existingUser: any, email: string, subject: any, htmlContent: any, text: any) {
    // To resolve - error "self-signed certificate in certificate chain"
    // This line of code needs to be added
    // process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    // Or this object
    // tls: {
    //     rejectUnauthorized: false
    // }

    try {
        // Creating a transporter with nodemailer
        const transporter = await nodemailer.createTransport({
            host: process.env.HOST, // SMTP host
            service: process.env.SERVICE, // SMTP service name
            port: 465, // SMTP port
            secure: true, // Using TLS
            tls: {
                rejectUnauthorized: false // Disabling certificate validation (for self-signed certificates)
            },
            auth: {
                user: process.env.MAIL_USER, // Email user
                pass: process.env.MAIL_PASSWORD, // Email password
            },
        });

        // Sending email using the transporter
        const infoSendMail = await transporter.sendMail({
            from: process.env.MAIL_USER, // Sender email address
            to: email, // Recipient email address
            subject: subject, // Email subject
            html: htmlContent, // HTML content of the email
            // text: text // Plain text content of the email (optional)
        });
        console.log('Message sent successfully: %s', infoSendMail);
    } catch (error) {
        // Handling errors during email sending
        console.error('Error sending email: ', error);
    }
}
