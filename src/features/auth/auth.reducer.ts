
import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import jwtDecode from "jwt-decode";
import axios from "axios";
import { message } from 'antd';


import ApiService from 'api/api.service'
import {ActionError, AuthModel, AuthState, AuthTokens} from "./auth.model";

import Routes from "../../Constants/routes";
import {LOG_g, Query, Status} from "../../utils/utils";
import {destroyToken, getAuthData, saveTokenToLocalStorage} from "../../api/jwt.service";


const initialState: AuthState= {
    authenticated: false,
    error:null,
    token:"",
    loadingStatus:Status.NORMAL,
    queryType:"",
    //user related
    isAdmin:false,
    currentLoggedInUser: {},
}

const auth = createSlice({
    name:'auth',
    initialState,
    reducers:{
        queryStart(state, action: PayloadAction<string>){
            state.loadingStatus=Status.LOADING
            state.queryType=action.payload
        },
        signUpSuccess(state, action: PayloadAction<AuthModel>) {
            // const { comments, issueId } = action.payload
            state.currentLoggedInUser=action.payload
            state.loadingStatus = Status.SUCCESS
            state.queryType=Query.SIGNUP
            state.error = null
        },
        loginSuccess(state, action: PayloadAction<AuthModel>) {
            // const { comments, issueId } = action.payload
            state.currentLoggedInUser=action.payload
            state.authenticated=true
            state.loadingStatus = Status.SUCCESS
            state.queryType=Query.LOGIN
            state.error = null
        },
        queryFailure(state, action: PayloadAction<ActionError>) {
            state.loadingStatus = Status.ERROR
            state.error = action.payload.error
            state.queryType=action.payload.queryType

        },
        logout(state){
            state=initialState
        }
    }
})

export const {
    queryStart,
    signUpSuccess,
    loginSuccess,
    queryFailure,
    logout
} = auth.actions

export default auth.reducer

const getResponseData=(value)=> {
    console.log("the data is", value.data)
    return value.data.user}
const getResponseToken=(value): AuthTokens=>value.data.authToken

export const login = (usr:AuthModel, history, checked:boolean) => async dispatch => {
    try {
        dispatch(queryStart(Query.LOGIN))
        //=============     Making api request
        const loginRes = await ApiService.post('auth/login', usr)
        dispatch(LOG_g("data", loginRes.data.toString()))

        let user:AuthModel=getResponseData(loginRes)
        const token = getResponseToken(loginRes)

        dispatch(loginSuccess(user))
        axios.defaults.headers.common['Authorization'] = token.accessToken;
        if (checked === true) {
            saveTokenToLocalStorage(token, user);
        }
        console.log("user is ", user)
        if (user.role === "admin") {
            console.log("user is admin", user)
            history.push(Routes.ADMIN)
        }
        else{history.push("/");}



    } catch (err) {
        dispatch(queryFailure(<ActionError>{error:err.message, queryType:Query.LOGIN}))
    }
}
// TODO Fix this Method signup and activate methods
export const signup = (usr:AuthModel) => async dispatch => {
    try {
        dispatch(queryStart(Query.SIGNUP))
        const signUpResp = await ApiService.post('auth/signup', usr)

        if (signUpResp.data=="true")
        {
            message.info(' a verification code is sent ');
        }

       

    } catch (err) {
        dispatch(queryFailure(<ActionError>{error:err.message, queryType:Query.SIGNUP}))
    }
}
export const activate = (codes, history) => async dispatch => {
    try {
        dispatch(queryStart(Query.SIGNUP))
        const activateResp = await ApiService.post('auth/activate', codes)

        if (activateResp.data.user)
        {
            dispatch(signUpSuccess(activateResp.data.user))
            history.push(Routes.LOGIN);
            message.success('You Are Verified Successfully, Please Login Using Your phone and Password');
        }else {
            message.error('some thing went wrong');
        }


    } catch (err) {
        dispatch(queryFailure(<ActionError>{error:err.message, queryType:Query.SIGNUP}))
    }
}

export const logoutUser = () => (dispatch) => {
    destroyToken()
    delete axios.defaults.headers.common['Authorization'];
    dispatch(logout());
    window.location.href = Routes.LOGIN;
};


export const CheckExpiredToken=()=>(dispatch) =>{
    const authData = getAuthData();

    dispatch(LOG_g("checking token", authData))
    if (authData) {
        try{
            const decodedToken = jwtDecode(authData.token.accessToken)
            let user:AuthModel=authData.user
            dispatch(LOG_g("decoded Token", decodedToken))
            // @ts-ignore
            if (decodedToken.exp * 1000 < Date.now()) {
                dispatch(logoutUser());
            } else {
                dispatch(loginSuccess(user));
                axios.defaults.headers.common['Authorization'] =authData.token.accessToken;
            }
        }catch (e){
            console.log("e", e)
        }

    }else {
        dispatch(logout());
    }
}
