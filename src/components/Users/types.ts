export interface User {
    id: string
    username: string
    password: string
    role: string
}


export interface SignUpUser{
    userId:string,
    role:string
    timestamp:number
}

export type UserAdd = Omit<User, 'id'>
