
export interface ItemFilter{
    search?:string



    type?:string
    tags?:string[]
    active?:boolean



    //pagination related
    page:number
    lastPageReached:boolean
    limit?:number

    ctgId?:string
}
/*
    Creating Variables
    -------------------
    - name, description, images,
    - tags, tags :- Needs Tags & tags list
    - donors-- needs users List

    - language, page, amount,Type, published date,

    - authors

 */

export interface ItemModel{
    _id: string
    title: string
    body?:string
    ownerId?:string
    tags?:string[]
    type?:string
    coverImage?:string

    language?: string


}



export interface ItemState {
    filter:ItemFilter
    questionFilter: ItemFilter,
    items: ItemModel[],
    questions: ItemModel[]
    item?: ItemModel ,
    latestItems?:ItemModel[],


    loadingStatus: string,
    uploadStatus?:string
    error: Error|null,
    queryType: string,
}

export interface ActionError{
    error:Error,
    queryType:string
}


