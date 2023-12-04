const users = []

function userJoin(id,username, room){
    const user = {id,username,room}
    users.push(user)
    return user
}

// getting current user
function getCurrentUser(id){
    return users.find(user => user.id === id)
}

// when user leaves chat
function userLeaves(id){
    const index = users.findIndex(user => user.id === id)
    if(index != -1)
        return users.splice(index,1)[0]
}

//getting room members
function getRoomUsers(room){
    return users.filter(user => users.room === room)
}

module.exports = {
    userJoin, 
    getCurrentUser,
    userLeaves,
    getRoomUsers
}