import { combineReducers } from 'redux'
import  itemReducer from "../features/Item/item.reducer"
import {ItemModel, ItemState} from "../features/Item/itemModel";
import authReducer from '../features/auth/auth.reducer'
import {AuthState} from "../features/auth/auth.model";
import {TagsState} from "../features/tags/tagsModel";
import tagReducer from '../features/tags/tags.reducer'




const rootReducer = combineReducers({

    auth:authReducer,
    tags: tagReducer,
    items:itemReducer,

})

export interface RootS{
    auth:AuthState
    tags: TagsState
    items:ItemState


}

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer