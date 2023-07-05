import UsersManager from "../dao/mongoManager/userManager.js";

const userManager = new UsersManager()


export async function getUsers(){
    try {
        const users = await userManager.getAllUsers()
        return users
    } catch (error) {
        return error
    }
}

export async function getAUser(email){
    try {
        const user = await userManager.getUserBy(email)
        return user
    } catch (error) {
        return error
    }
}

export async function findUser(){
    try {
        const users = await userManager.findUsers()
        return users
    } catch (error) {
        return error
    }
}

export async function getUserById(id){
    try {
        const user = await userManager.findUserById(id)
        return user
    } catch (error) {
        return error
    }
}

export async function addOneUser(obj){
    try {
        const newUser = await userManager.addUser(obj)
        return newUser
    } catch (error) {
        return error
    }
}

export async function updateUserById(_id, obj){
    try {
        const updatedUser = await userManager.updateUser(_id, obj)
        return updatedUser
    } catch (error) {
        return error
    }
}

export async function deleteUserById(id){
    try {
        const deletedUser = await userManager.deleteUser(id)
        return deletedUser
    } catch (error) {
        return error
    }
}

export async function delInactiveUsers(_id){
    try {
        const user = await userManager.delInactUsers(_id)
        return user
    } catch (error) {
        return error
    }
}