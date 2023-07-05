export default class UserDTO {
    static getUserFrom = (user) =>{
        const userDto = {
            name: `${user[0].first_name} ${user[0].last_name}`,
            email: user[0].email,
            role: user[0].role
        }
        return userDto
    }
    static getUsersFrom = (user) =>{
        const dto = []
        user.forEach(u => {
            const users = {
                name: `${u.first_name} ${u.last_name}`,
                email: u.email,
                role: u.role
            }
            dto.push(users)
        });
        return dto
    }
}