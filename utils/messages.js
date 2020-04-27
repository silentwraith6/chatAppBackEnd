const generateMessage = (text,senderName) => {
    return ({
        "text":text,
        "sentBy":senderName,
        "createdAt":new Date().getTime()
    });
}

module.exports={
    generateMessage
}