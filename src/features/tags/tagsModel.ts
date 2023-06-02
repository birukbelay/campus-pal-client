

export interface TagsModel {
    _id: string
    name: string
    type: string

    coverImage?: string
    image?: {
        images?: string[]
        imageCover?:string
        suffix?:string
        imagePath?:string
    }

    description?:string


    count?:number
}

export interface TagsState {

    tags?: TagsModel[],
    tag?: TagsModel | {},

    loadingStatus: string,
    uploadStatus?:string
    error: Error|null,
    queryType: string,
}

export interface ActionError{
    error:Error,
    queryType:string
}


