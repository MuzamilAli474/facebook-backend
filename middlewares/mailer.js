
const nodemailer = require ('nodemailer');


// const generateRandomPassword = () => {
//     return crypto.randomBytes(8).toString('hex');  
// };


const  generateRandomPassword = (length = 6)=> {
    let password = '';
    for (let i = 0; i < length; i++) {
      // Generate a random digit between 0 and 9
      password += Math.floor(Math.random() * 10);
    }
    return password;
  }

const sendEmail = async (email, password) => {
  
    const transporter = nodemailer.createTransport({
        service: 'gmail',  
        auth: {
            user: 'muzamil.6aug24webgpt@gmail.com', 
            pass: 'cjcy cync rjsh srix' 
        }
    });

    const mailOptions = {
        from: 'muzamil.6aug24webgpt@gmail.com',
        to: email,
        subject: 'Your Account Registration Details',
        text: `Hello,

        Your account has been created successfully. Your login password is: ${password}
 and emil is this ${email}
        Please change your password after logging in for security reasons.

        Best regards,
        Muzamil ali`
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error.message);
    }
};


module.exports = {generateRandomPassword,sendEmail}
