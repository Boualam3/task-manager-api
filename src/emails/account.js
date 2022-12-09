const sgMail = require("@sendgrid/mail")

sgMail.setApiKey(process.env.API_KEY)

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "boualamelghali@hotmail.com",
    subject: "Thanks for joining in!",
    text: `Welcome to the app, ${name}. Let me know how you get along with the app.`,
    html: ``,
  })
}

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "boualamelghali@hotmail.com",
    subject: "Sorry to see you go!",
    text: `Good Bye ${name}. I hope to see back sometime soon. `,
  })
}

module.exports = { sendWelcomeEmail, sendCancelationEmail }
