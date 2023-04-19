import { combineReducers } from 'redux'


import authReducer from '../features/auth/auth.reducer'
import {AuthState} from "../features/auth/auth.model";





const rootReducer = combineReducers({

    auth:authReducer,


})

export interface RootS{
    auth:AuthState


}

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer