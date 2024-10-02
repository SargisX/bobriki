export interface IState {
    memes: Meme[]
}

export interface Meme {
    id: string
    photo: string
    participants: string[]
    likes: number
    rating: number
    category: string
    location: string
    comments: any[]
}
