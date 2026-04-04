const sgMail = require('@sendgrid/mail');

if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

/**
 * Email Service for user notifications and automated farming reports.
 */

const sendEmail = async (to, subject, text, html) => {
    if (!process.env.SENDGRID_API_KEY) {
        console.warn('SendGrid API key not found. Skipping email.');
        return;
    }

    const msg = {
        to,
        from: process.env.EMAIL_FROM || 'noreply@agrisense.com',
        subject,
        text,
        html
    };

    try {
        await sgMail.send(msg);
        console.log(`Email sent successfully to ${to}`);
    } catch (error) {
        console.error('SendGrid Email Error:', error.message);
        if (error.response) {
            console.error(error.response.body);
        }
    }
};

const sendWelcomeEmail = async (user) => {
    const subject = 'Welcome to AgriSense AI - Smart Farming Awaits';
    const text = `Hello ${user.name},\n\nWelcome to AgriSense! Your farm, ${user.farmName || 'Profile'}, is now connected to our AI network. Start by uploading a soil report or chatting with our AI expert.`;
    const html = `<h1>Welcome to AgriSense AI, ${user.name}!</h1><p>Start your smart farming journey today by uploading your first soil report or setting up your crop profiles.</p>`;
    
    await sendEmail(user.email, subject, text, html);
};

const sendAnalysisCompleteEmail = async (user, report) => {
    const subject = `Soil Analysis Complete: ${report.fileName}`;
    const text = `Hello ${user.name},\n\nYour soil analysis is complete. Your health score is ${report.results.healthScore}/100. Check the dashboard for full recommendations.`;
    const html = `<h2>Soil Analysis Complete!</h2><p>Health Score: <strong>${report.results.healthScore}/100</strong></p><p>View full results <a href="${process.env.CLIENT_URL}/dashboard">here</a>.</p>`;

    await sendEmail(user.email, subject, text, html);
};

const sendWeeklyDigestEmail = async (user, data) => {
    const subject = 'AgriSense Weekly Farming Digest';
    const text = `Hello ${user.name}, your weekly farm report is ready. You have ${data.unreadAlerts} unread alerts. Current average crop health is ${data.avgHealth}%.`;
    const html = `<h2>Weekly Farm Digest</h2><ul><li>Unread Alerts: ${data.unreadAlerts}</li><li>Avg Crop Health: ${data.avgHealth}%</li></ul>`;

    await sendEmail(user.email, subject, text, html);
};

module.exports = {
    sendWelcomeEmail,
    sendAnalysisCompleteEmail,
    sendWeeklyDigestEmail
};
