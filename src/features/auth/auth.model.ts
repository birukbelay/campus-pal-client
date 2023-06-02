


export interface BaseUser {
    _id?: string
    firstName?: string
    lastName?: string
    fullName?: string
    image?: {
        imageCover?: string
        suffix?: string
        imagePath?: string
    }
}
export interface AuthTokens{
    accessToken: string
    refreshToken: string
}
export interface AuthModel extends BaseUser{

    email?: string
    password?: string
    idToken?:string
    phone?:string
    userImages?:{
        id?:string
        profile?:string
    }



    role?:string


}

export interface AuthState {
    authenticated: boolean,
    token:string,


    //user related
    isAdmin:false,
    currentLoggedInUser?: AuthModel|{},

    loadingStatus: string,
    uploadStatus?:string
    error: Error|null,
    queryType: string,
}

export interface ActionError{
    error:Error,
    queryType:string
}
