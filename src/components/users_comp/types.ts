export interface User {
    id: string
    nickname: string
    username: string
    password: string
    profilePicture: string
    bio: string
    role: string
}


export interface SignUpUser{
    userId:string,
    role:string
    timestamp:number
}

export interface UpdateProfile{
    nickname?:string
    bio?: string,
    profilePicture?: string
}

export type UserAdd = Omit<User, 'id'>
