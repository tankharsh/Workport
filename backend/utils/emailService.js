// const nodemailer = require("nodemailer");

// // Configure the email transporter
// const transporter = nodemailer.createTransport({
//     service: "Gmail", // You can change it to Outlook, SMTP, etc.
//     auth: {
//         user: process.env.EMAIL_USER, // Your email
//         pass: process.env.EMAIL_PASS  // Your email password or app password
//     }
// });

// // Function to send an email
// const sendEmail = async (to, status, serviceName, providerName) => {
//     try {
//         let subject, htmlContent;

//         // Define subject and message based on status
//         if (status === "Approved") {
//             subject = "🎉 Your Service Booking is Confirmed!";
//             htmlContent = `
//                 <h2 style="color: green;">✅ Booking Approved!</h2>
//                 <p>Hello,</p>
//                 <p>Your service request for <strong>${serviceName}</strong> by <strong>${providerName}</strong> has been <strong style="color: green;">Approved</strong>.</p>
//                 <p>Thank you for choosing our service!</p>
//                 <p>Best Regards,</p>
//                 <p><strong>Our Service Team</strong></p>
//             `;
//         } else if (status === "Rejected") {
//             subject = "❌ Your Service Request Was Not Approved";
//             htmlContent = `
//                 <h2 style="color: red;">⚠️ Booking Rejected</h2>
//                 <p>Hello,</p>
//                 <p>We regret to inform you that your request for <strong>${serviceName}</strong> by <strong>${providerName}</strong> has been <strong style="color: red;">Rejected</strong>.</p>
//                 <p>You can try another service or contact the provider for more details.</p>
//                 <p>Best Regards,</p>
//                 <p><strong>Our Service Team</strong></p>
//             `;
//         } else {
//             subject = "📌 Your Service Inquiry is Pending";
//             htmlContent = `
//                 <h2 style="color: orange;">⏳ Inquiry Pending</h2>
//                 <p>Hello,</p>
//                 <p>Your inquiry for <strong>${serviceName}</strong> by <strong>${providerName}</strong> is currently <strong style="color: orange;">Pending</strong>.</p>
//                 <p>We will notify you once it is reviewed.</p>
//                 <p>Best Regards,</p>
//                 <p><strong>Our Service Team</strong></p>
//             `;
//         }

//         // Send email
//         await transporter.sendMail({
//             from: process.env.EMAIL_USER,
//             to,
//             subject,
//             html: htmlContent
//         });

//         console.log(`✅ Email sent successfully to ${to}`);
//     } catch (error) {
//         console.error(`❌ Error sending email: ${error.message}`);
//     }
// };

// module.exports = { sendEmail };


const nodemailer = require("nodemailer");

// Configure the email transporter
const transporter = nodemailer.createTransport({
    service: "Gmail", // You can change it to Outlook, SMTP, etc.
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS  // Your email password or app password
    }
});

// Function to send an email
// const sendEmail = async (to, status, serviceName = "Not Found", providerShopName = "Not Found", date = "Not Provided", time = "Not Provided", message = "No additional message") => {

//     console.log(serviceName , providerShopName)
//     try {
//         let subject, htmlContent;

//         if (status === "Approved") {
//             subject = "🎉 Your Service Booking is Confirmed!";
//             htmlContent = `
//                 <h2 style="color: green;">✅ Booking Approved!</h2>
//                 <p>Hello,</p>
//                 <p>Your service request for <strong>${serviceName}</strong> at <strong>${providerShopName}</strong> has been <strong style="color: green;">Approved</strong>.</p>
//                 <p><strong>Date:</strong> ${date}</p>
//                 <p><strong>Time:</strong> ${time}</p>
//                 <p><strong>Message:</strong> ${message}</p>
//                 <p>Thank you for choosing our service!</p>
//                 <p>Best Regards,</p>
//                 <p><strong>Our Service Team</strong></p>
//             `;
//         } else if (status === "Rejected") {
//             subject = "❌ Your Service Request Was Not Approved";
//             htmlContent = `
//                 <h2 style="color: red;">⚠️ Booking Rejected</h2>
//                 <p>Hello,</p>
//                 <p>We regret to inform you that your request for <strong>${serviceName}</strong> at <strong>${providerShopName}</strong> has been <strong style="color: red;">Rejected</strong>.</p>
//                 <p><strong>Message:</strong> ${message}</p>
//                 <p>Best Regards,</p>
//                 <p><strong>Our Service Team</strong></p>
//             `;
//         } else {
//             subject = "📌 Your Service Inquiry is Pending";
//             htmlContent = `
//                 <h2 style="color: orange;">⏳ Inquiry Pending</h2>
//                 <p>Hello,</p>
//                 <p>Your inquiry for <strong>${serviceName}</strong> at <strong>${providerShopName}</strong> is currently <strong style="color: orange;">Pending</strong>.</p>
//                 <p><strong>Message:</strong> ${message}</p>
//                 <p>Best Regards,</p>
//                 <p><strong>Our Service Team</strong></p>
//             `;
//         }

//         await transporter.sendMail({
//             from: process.env.EMAIL_USER,
//             to,
//             subject,
//             html: htmlContent
//         });

//         console.log(`✅ Email sent successfully to ${to}`);
//     } catch (error) {
//         console.error(`❌ Error sending email: ${error.message}`);
//     }
// };

// module.exports = { sendEmail };


const sendEmail = async (to, status, serviceName, providerName, date, time, message) => {
    try {
        if (!serviceName) serviceName = "Unknown Service";
        if (!providerName) providerName = "Unknown Provider";
        if (!date) date = "Not Specified"; // ✅ Default value
        if (!time) time = "Not Specified"; // ✅ Default value
        if (!message) message = "No additional details"; // ✅ Default value

        let subject, htmlContent;

        if (status === "Approved") {
            subject = "🎉 Your Service Booking is Confirmed!";
            htmlContent = `
                <h2 style="color: green;">✅ Booking Approved!</h2>
                <p>Hello,</p>
                <p>Your service request for <strong>${serviceName}</strong> at <strong>${providerName}</strong> has been <strong style="color: green;">Approved</strong>.</p>
                <p><strong>Date:</strong> ${date}</p>
                <p><strong>Time:</strong> ${time}</p>
                <p><strong>Message:</strong> ${message}</p>
                <p>Thank you for choosing our service!</p>
                <p>Best Regards,</p>
                <p><strong>Our Service Team</strong></p>
            `;
        } else if (status === "Rejected") {
            subject = "❌ Your Service Request Was Not Approved";
            htmlContent = `
                <h2 style="color: red;">⚠️ Booking Rejected</h2>
                <p>Hello,</p>
                <p>We regret to inform you that your request for <strong>${serviceName}</strong> at <strong>${providerName}</strong> has been <strong style="color: red;">Rejected</strong>.</p>
                <p>You can try another service or contact the provider for more details.</p>
                <p>Best Regards,</p>
                <p><strong>Our Service Team</strong></p>
            `;
        } else {
            subject = "📌 Your Service Inquiry is Pending";
            htmlContent = `
                <h2 style="color: orange;">⏳ Inquiry Pending</h2>
                <p>Hello,</p>
                <p>Your inquiry for <strong>${serviceName}</strong> at <strong>${providerName}</strong> is currently <strong style="color: orange;">Pending</strong>.</p>
                <p>We will notify you once it is reviewed.</p>
                <p>Best Regards,</p>
                <p><strong>Our Service Team</strong></p>
            `;
        }

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            html: htmlContent
        });

        console.log(`✅ Email sent successfully to ${to}`);
    } catch (error) {
        console.error(`❌ Error sending email: ${error.message}`);
    }
};



module.exports = { sendEmail };