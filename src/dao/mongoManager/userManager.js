import { usersModel } from "../models/users.model.js";

export default class UsersManager{

    async getAllUsers(){
        try {
            const users = await usersModel.find()
            return users
        } catch (error) {
            return error
        }
    }

        async getUserBy(email){
        try {
            const user = await usersModel.find({email})
            return user
        } catch (error) {
            return error
        }
    }

    async findUsers(email, password){
        try {
            const user = await usersModel.find({email:email, password:password})
            return user
        } catch (error) {
            return error
        }
    }

    async findUserById(id){
        try {
            const user = await usersModel.findById({_id: id})
            return user
        } catch (error) {
            return error
        }
    }

    async addUser(obj){
        try {
            const newUser = await usersModel.create(obj)
            return newUser
        } catch (error) {
            return error
        }
    }

    async updateUser(_id, obj){
        try {
            const updatedUser = await usersModel.findByIdAndUpdate(_id, obj)
            return updatedUser
        } catch (error) {
            return error
        }
    }

    async deleteUser(id){
        try {
            const deletedUser = await usersModel.findByIdAndDelete(id)
            return deletedUser
        } catch (error) {
            return error
        }
    }

    async delInactUsers(_id){
        try {
            const user = await usersModel.findById(_id)
            if(user){
                const del = await usersModel.deleteOne({_id: _id})
                if(del){
                    return del
                }
            }
        } catch (error) {
            return error
        }
    }
}