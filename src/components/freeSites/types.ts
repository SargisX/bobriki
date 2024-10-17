
export interface TopLevel {
    Websites: Website[]
}

export interface Website {
    id: string
    name: string
    image: string
    description: string
    author: string
    technologies: string[]
    category: string
    status: Status[]
    platform: string[]
    dateAdded: string
    tags: string[]
}

const enum Status {
    Active,
    Inactive,
    Archived
}
