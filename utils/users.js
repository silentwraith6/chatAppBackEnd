const users = []

const addUser = ({id,userName,roomName}) =>{
    if(!userName || !roomName){
        return {error:'Username and room are required'}
    }
    userName = userName.trim()
    roomName = roomName.trim()

    if(!userName || !roomName){
        return {error:'Username and room are required'}
    }
    if(userName ==='admin'){
        return {error:"Username not valid"}
    }

    const existingUser = users.find((user)=>{
        return user.roomName===roomName && user.userName===userName
    })

    if(existingUser){
        return {error: 'Username already exists in room'}
    }

    user={
        id,userName,roomName
    }
    users.push(user)
    return { user }
}

const removeUser = (id) =>{
    const index = users.findIndex((user)=>{
        return user.id===id
    })

    if(index!==-1)
        return users.splice(index,1)[0]
}

const getUser = (id) =>{
    if(!id)
        return undefined
    const user = users.find((user)=>{
        return id===user.id
    })

    if(!user)
        return undefined
    return user
}

const getUsersInRoom =(roomName)=>{
    return users.filter((user)=>{
        return user.roomName===roomName
    })
}

module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}

console.log(getUsersInRoom("manav"))