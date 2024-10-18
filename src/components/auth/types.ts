export interface User {
    id: string
    username: string
    password: string
    role: string
}

export type SignUpUser = Omit<User, 'role' | 'id'>
