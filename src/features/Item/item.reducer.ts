
import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {AppThunk} from 'app/store'
import ApiService  from 'api/api.service'

import {ActionError, ItemFilter, ItemModel, ItemState} from "./itemModel";
import {LOG_g, Query, RemoveEmptyFields, Status, updateItem} from "../../utils/utils";
import { message } from 'antd';
import {ItemsAdminLimit} from "../../Constants/constants";



const bookApiUrl='article'


const initialState: ItemState= {
    questionFilter: {
        type: "question",
        tags: [],
        page: 1,
        lastPageReached: false,
    },
    questions: [],
    items: [],
    latestItems: [],
    item: {
        _id: "",
        title: "",
    },
    filter: {
        type: "",
        tags: [],
        page: 1,
        lastPageReached: false,
    },
    loadingStatus: Status.NORMAL,
    uploadStatus: Status.NORMAL,
    error: null,
    queryType: "",

}



const items = createSlice({
    name:'items',
    initialState,
    reducers:{
            queryStart(state, action: PayloadAction<string>){
                state.loadingStatus=Status.LOADING
                state.queryType=action.payload
            },
            setFetchItemsSuccess(state, action: PayloadAction<ItemModel[]>) {
                // const { comments, issueId } = action.payload
                state.items=action.payload
                state.loadingStatus = Status.SUCCESS
                state.queryType=Query.FETCH
                state.error = null
            },mergeItemsSuccess(state, action: PayloadAction<ItemModel[]>) {
                // const { comments, issueId } = action.payload
                state.items=[...state.items, ...action.payload]
                state.loadingStatus = Status.SUCCESS
                state.queryType=Query.FETCH
                state.error = null
            },mergeLatestItemsSuccess(state, action: PayloadAction<ItemModel[]>) {
                // const { comments, issueId } = action.payload
                state.latestItems=[...state.latestItems, ...action.payload]
                state.loadingStatus = Status.SUCCESS
                state.queryType=Query.FETCH
                state.error = null
            },
            setFilter(state, action: PayloadAction<ItemFilter>) {
                state.filter=action.payload
            },setId(state, action: PayloadAction<string>) {
                state.item._id=action.payload
            },
            getItemSuccess(state, action: PayloadAction<ItemModel>) {
                state.item= action.payload
                state.loadingStatus = Status.SUCCESS
                state.queryType=Query.FETCH_ONE
                state.error = null
            },
           createItemsSuccess(state, action: PayloadAction<ItemModel>) {
                console.log("-------",action.payload)
               let arr=[...state.items,action.payload]
                state.items= arr
                state.loadingStatus = Status.SUCCESS
                state.queryType=Query.CREATE
                state.error = null
            },
            updateItemsSuccess(state, action: PayloadAction<ItemModel>){


                const itms=updateItem(state.items, action.payload)
                state.items=itms
                // let objIndex = state.items.findIndex((obj => obj.id == action.payload.id));
                // state.items[objIndex]=action.payload
                // state.items= state.items.map(item=>arry.find(q=>q.id===item.id)||item)
                // state.items= state.items.map(ques=>action.payload.id===ques.id||ques)
                state.loadingStatus = Status.SUCCESS
                state.queryType=Query.UPDATE
                state.error = null
            },
            deleteItemsSuccess(state, action: PayloadAction<string>) {
                state.items= state.items.filter(item=>item._id!==action.payload)
                state.loadingStatus = Status.SUCCESS
                state.queryType=Query.DELETE
                state.error = null
            },
            queryFailure(state, action: PayloadAction<ActionError>) {
                state.loadingStatus = Status.ERROR
                state.error = action.payload.error
                state.queryType=action.payload.queryType
            },
            setItem(state, action:PayloadAction<ItemModel>){
                state.item=action.payload
            }

        }
})

export const {
    queryStart,
    setFetchItemsSuccess,
    mergeItemsSuccess,
    getItemSuccess,
    setId,
    createItemsSuccess  ,
    updateItemsSuccess,
    deleteItemsSuccess,
    queryFailure,
    setItem,
    setFilter,
    mergeLatestItemsSuccess
} = items.actions

export default items.reducer

const getResponseData=(value)=> value.data

export const loadMore=(query): AppThunk => async dispatch => {
    try{
        dispatch(queryStart(Query.FETCH))
        const newQuery=RemoveEmptyFields(query)
        const queryString = new URLSearchParams(newQuery).toString()
    }catch (e){

    }
}

export const fetchLatestItems=(query ): AppThunk => async dispatch => {
    try {
        dispatch(queryStart(Query.FETCH))
        const itms=await fetchItemsData(query)
        dispatch(mergeLatestItemsSuccess(itms))
    } catch (err) {
        dispatch(queryFailure(<ActionError>{error:err.message, queryType:Query.FETCH}))
    }
}
export const fetchItemsData=async (query ) => {
    try {
        const newQuery=RemoveEmptyFields(query)
        const queryString = new URLSearchParams(newQuery).toString()
        console.log("query=",query, queryString)
        const items = await ApiService.query(bookApiUrl+`?${queryString}`, {})
        let itms:ItemModel[]=getResponseData(items).data
       return itms
    } catch (err) {
        throw new Error(err.message())
    }
}
export const fetchItems = (query , setModal, resetPages=true): AppThunk => async dispatch => {
    try {
        dispatch(queryStart(Query.FETCH))

        const itms=await fetchItemsData(query)

        //if the items have reached last page, set last page reached to toue
        if(itms.length<ItemsAdminLimit){
            query.lastPageReached=true
        }
        //for local state mgmt
        dispatch(setFilter(query))
        if(resetPages) dispatch(setFetchItemsSuccess(itms))
        else dispatch(mergeItemsSuccess(itms))
        setModal()
    } catch (err) {
        dispatch(queryFailure(<ActionError>{error:err.message, queryType:Query.FETCH}))
    }
}

export const getItem = (id:string): AppThunk => async dispatch => {
    console.log("fetching ---- items----->")
    try {
        dispatch(queryStart(Query.FETCH_ONE))
        const items = await ApiService.get(bookApiUrl, id)
        let itms:ItemModel=getResponseData(items)
        dispatch(getItemSuccess(itms))
    } catch (err) {
        dispatch(queryFailure(<ActionError>{error:err.message, queryType:Query.FETCH_ONE}))
    }
}


export const createItems = (item, cleanUp): AppThunk => async dispatch => {
    try {
        dispatch(queryStart(Query.CREATE))
        dispatch(LOG_g("items Create start *****", item))
        const items = await ApiService.post(bookApiUrl, item)

        let itm:ItemModel=getResponseData(items)
        dispatch(LOG_g("items fetched *****", itm))
        dispatch(createItemsSuccess(itm))
        dispatch(LOG_g("item Dispatched *****", itm))
        message.success('Created Succesfully');
        cleanUp()
    } catch (err) {
        dispatch(LOG_g("items ERROR *****", err.message))
        dispatch(queryFailure(<ActionError>{error:err.message, queryType:Query.CREATE}))
        message.error(err.message);
    }
}

export const updateItems = (id:string, item, cleanUp): AppThunk => async dispatch => {
    try {
        dispatch(queryStart(Query.UPDATE))
        const items = await ApiService.update(bookApiUrl, id, item)
        let itm:ItemModel=getResponseData(items)
        //TO remove teh cashed version of the poster from browser
        caches.open('v1').then(function(cache) {
            cache.delete(itm.coverImage).then(function(response) {
                window.URL.revokeObjectURL(itm.coverImage)
            });
        })


        dispatch(updateItemsSuccess(itm))
        message.success('Updated Successfully');
        cleanUp()
    } catch (err) {
        dispatch(queryFailure(<ActionError>{error:err.message, queryType:Query.UPDATE}))
        message.error(err.message);
    }
}

export const deleteItems = (id:string): AppThunk => async dispatch => {
    try {
        dispatch(queryStart(Query.DELETE))
        const item = await ApiService.delete(bookApiUrl, id)
        dispatch(deleteItemsSuccess(id))
        message.success('Deleted Successfully');
    }catch (err){
        dispatch(queryFailure(<ActionError>{error:err.message, queryType:Query.DELETE}))
        message.error(err.message);
    }
}

