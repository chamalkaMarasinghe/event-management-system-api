const sendMail = require("../email/sendEmail");

exports.sendNotifications = ({
    isSendingEmail = true,
    emailOptions = null,
    type = null
}) => {

    // NOTE: sending the email as a part of the notification  
    if(isSendingEmail && emailOptions){
        sendMail(
            emailOptions?.email,//to
            emailOptions?.subject,//subject
            {//data
                topic: emailOptions?.topic,
                content: emailOptions?.content,
                booking: emailOptions?.booking,
                ics: emailOptions?.ics
            },
            //type
            type? type : null,
        )
    }

}