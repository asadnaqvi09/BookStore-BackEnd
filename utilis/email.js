const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SEND_GRID_API_KEY)

module.exports.sendVerificationEmail = async (email, code) => {
  const msg = {
    to: email,
    from: process.env.SEND_GRID_SENDER,
    subject: 'Verify Your Account',
    text: `Your verification code is: ${code}`,
    html: `<p>Your verification code is: <strong>${code}</strong></p>`
  }

  try {
    await sgMail.send(msg)
    console.log('✅ Verification email sent to', email)
  } catch (err) {
    console.error('❌ SendGrid error:', err.message)

    // 👉 fallback for local development
    if (process.env.NODE_ENV === 'development') {
      console.log('DEV MODE: Pretending email was sent. Code:', code)
      return
    }

    throw new Error('Failed to send verification email')
  }
}


module.exports.sendResetEmail = async (email, token) => {
  const msg = {
    to: email,
    from: process.env.SEND_GRID_SENDER,
    subject: 'Reset Your Password',
    text: `Reset your password using this token: ${token}`,
    html: `<p>Reset your password using this token: <strong>${token}</strong></p>`
  }

  try {
    await sgMail.send(msg)
    console.log('Reset email sent to', email)
  } catch (err) {
    console.error('SendGrid error:', err)
     if (process.env.NODE_ENV === 'development') {
      console.log('DEV MODE: Pretending email was sent. Code:', code)
      return
    }
    console.log("SendGrid Key:", process.env.SEND_GRID_API_KEY?.slice(0, 10));
console.log("SendGrid Sender:", process.env.SEND_GRID_SENDER);

    throw new Error('Failed to send reset email')
  }
}