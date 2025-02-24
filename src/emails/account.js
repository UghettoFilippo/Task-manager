
const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");



const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_APIKEY
});

const sentFrom = new Sender("MS_H3JFTV@trial-v69oxl501drg785k.mlsender.net", "Your name");

async function sendWelcomeEmail (email,name){
   
   try {
    const recipients = [
        new Recipient(email,"yea")
      ];

   const emailParams = new EmailParams()
   .setFrom(sentFrom)
   .setTo(recipients)
   .setReplyTo(sentFrom)
   .setSubject("WELCOME TO TASK APP "+name)
   .setText("Welcome! We are happy for your subscription");
 
     await mailerSend.email.send(emailParams)

   } catch (error) {
    console.log("ERRORE MAILSENDER ->"+error.message)
   }
}


async function sendGBemail(email,name){
  try {
    const recipients=[new Recipient(email,'goodbye')]

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject('TASK APP - GOODBYE')
      .setText('We are sad '+name+'. See you soon.')

      await mailerSend.email.send(emailParams)
  } catch (error) {
    console.log("ERRORE MAILSENDER ->"+error)
  }
}

module.exports= {sendWelcomeEmail, sendGBemail}
