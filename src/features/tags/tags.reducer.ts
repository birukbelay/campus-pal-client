// @ts-ignore
import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {AppThunk} from 'app/store'
import ApiService from 'api/api.service'

import {ActionError, TagsModel, TagsState} from "./tagsModel";
import {LOG_g, Query, Status, updateItem} from "../../utils/utils";
import { message } from 'antd';
import {log_Fun} from "../../utils/log";

const tagsApiUrl='tags'

const initialState: TagsState={
    tags:[],
    tag:{},
    loadingStatus:Status.NORMAL,
    uploadStatus:Status.NORMAL,
    error:null,
    queryType:"",
}



const tags = createSlice({
    name:'tags',
    initialState,
    reducers:{
            queryStart(state, action: PayloadAction<string>){
                state.loadingStatus=Status.LOADING
                state.queryType=action.payload
            },
            fetchTagsSuccess(state, action: PayloadAction<TagsModel[]>) {
                // const { comments, issueId } = action.payload
                state.tags=action.payload
                state.loadingStatus = Status.SUCCESS
                state.queryType=Query.FETCH
                state.error = null
            },
            getTagSuccess(state, action: PayloadAction<TagsModel>) {
                state.tag= action.payload
                state.loadingStatus = Status.SUCCESS
                state.queryType=Query.FETCH_ONE
                state.error = null
            },
           createTagSuccess(state, action: PayloadAction<TagsModel>) {
                // const { comments, issueId } = action.payload
                state.tags= state.tags.concat(action.payload)
                state.loadingStatus = Status.SUCCESS
                state.queryType=Query.CREATE
                state.error = null
            },
            updateTagSuccess(state, action: PayloadAction<TagsModel>){


                const itms=updateItem(state.tags, action.payload)
                state.tags=itms
                // let objIndex = state.tags.findIndex((obj => obj.id == action.payload.id));
                // state.tags[objIndex]=action.payload
                // state.tags= state.tags.map(tag=>arry.find(q=>q.id===tag.id)||tag)
                // state.tags= state.tags.map(ques=>action.payload.id===ques.id||ques)
                state.loadingStatus = Status.SUCCESS
                state.queryType=Query.UPDATE
                state.error = null
            },
            deleteSuccess(state, action: PayloadAction<string>) {
                state.tags= state.tags.filter(tag=>tag._id!==action.payload)
                state.loadingStatus = Status.SUCCESS
                state.queryType=Query.DELETE
                state.error = null
            },
            queryFailure(state, action: PayloadAction<ActionError>) {
                state.loadingStatus = Status.ERROR
                state.error = action.payload.error
                state.queryType=action.payload.queryType
            },
            setTag(state, action:PayloadAction<TagsModel>){

                state.tag=action.payload
            }

        }
})

export const {
    queryStart,
    fetchTagsSuccess,
    getTagSuccess,
    createTagSuccess,
    updateTagSuccess,
    deleteSuccess,
    queryFailure,
    setTag
} = tags.actions

export default tags.reducer

const getResponseData=(value)=> value.data


export const fetchTags = (): AppThunk => async dispatch => {
    try {
        dispatch(queryStart(Query.FETCH))
        // dispatch()
        const tags = await ApiService.query(tagsApiUrl,{})
        dispatch(LOG_g("Tags fetched", tags.data))
        // log_Fun("Tags Fetching", tags.data)
        let itms:TagsModel[]=getResponseData(tags).data

        dispatch(fetchTagsSuccess(itms))


    } catch (err) {
        dispatch(LOG_g("Tags Error", err.message))
        log_Fun("Tags Error", err.message)
        dispatch(queryFailure(<ActionError>{error:err.message, queryType:Query.FETCH}))
    }
}

export const getOne = (id:string): AppThunk => async dispatch => {
    try {
        dispatch(queryStart(Query.FETCH_ONE))
        const tags = await ApiService.get(tagsApiUrl, id)
        let questns:TagsModel=getResponseData(tags)
        dispatch(getTagSuccess(questns))
    } catch (err) {
        dispatch(queryFailure(<ActionError>{error:err.message, queryType:Query.FETCH_ONE}))
    }
}


export const createOne = (tag, cleanUp): AppThunk => async dispatch => {
    try {
        dispatch(queryStart(Query.CREATE))
        const tags = await ApiService.post(tagsApiUrl, tag)

        let itm:TagsModel=getResponseData(tags)

        dispatch(createTagSuccess(itm))
        message.success('Tag Created Succesfully');
        cleanUp()
    } catch (err) {
        dispatch(queryFailure(<ActionError>{error:err.message, queryType:Query.CREATE}))
        message.error(err.message);
    }
}

export const updateOne = (id:string, tag, cleanUp): AppThunk => async dispatch => {
    try {
        dispatch(queryStart(Query.UPDATE))
        const tags = await ApiService.update(tagsApiUrl, id, tag)
        let itm:TagsModel=getResponseData(tags)
        dispatch(updateTagSuccess(itm))
        message.success('Tag Updated Successfully');
        cleanUp()
    } catch (err) {
        dispatch(queryFailure(<ActionError>{error:err.message, queryType:Query.UPDATE}))
        message.error(err.message);
    }
}

export const deleteOne = (id:string): AppThunk => async dispatch => {
    try {
        dispatch(queryStart(Query.DELETE))
        const tag = await ApiService.delete(tagsApiUrl, id)
        dispatch(deleteSuccess(id))
        message.success('Tag Deleted Successfully');
    } catch (err) {
        dispatch(queryFailure(<ActionError>{error:err.message, queryType:Query.DELETE}))
        message.error(err.message);
    }
}

