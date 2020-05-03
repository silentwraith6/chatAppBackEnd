let messages = []

const generateMessage = (msgObject,roomName) => {
    msgObject.sentFromServerAt=new Date().getTime()
    msgObject.status = "sentFromServer"
    msgObject.roomName = roomName

    addMsg(msgObject)

    // console.log(messages)

    return msgObject
}

const generateAdminMessage = (id,msg,roomName)=>{
    const msgobject = {
        message:msg,
        sentFromServerAt:new Date().getTime(),
        senderName:'admin',
        status:'sentFromServer',
        id:id,
        roomName:roomName
    }
    // addMsg(msgobject)
    return msgobject
}

const addMsg=(msgObject) =>{
    messages.push(msgObject)
}

const getMsgsInRoom = (roomName)=>{
    return messages.filter((msg)=>{
        return msg.roomName===roomName
    })
}

const getLeftOverMessages = (roomName,id) =>{
    const msgInRoom = getMsgsInRoom(roomName)
    let i;
    for(i=0;i<msgInRoom.length;i++){
        if(msgInRoom[i].id===id)
            break;
    }
    return msgInRoom.slice(i+1)
}

const removeMsgsInRoom=(roomName)=>{
    messages = messages.filter((element)=>{
        return element.roomName!==roomName
    })
    console.log('all messages:',messages)
}

module.exports={
    generateMessage,
    getLeftOverMessages,
    getMsgsInRoom,
    removeMsgsInRoom,
    generateAdminMessage
}