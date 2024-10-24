
export interface IBobrNews {
    id: string
    title: string
    description: string
    photo: string
    members: string[]
    date: number
    likes: string[]
    comments: string[]
}

export type CreateBobrNews = Omit<IBobrNews,'id'>

export interface ILikes {
}
export interface IComents {
}