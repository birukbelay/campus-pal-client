import {TagsModel, TagsState} from "./tagsModel";


export const tagsState = (state):TagsState => {
    return state.tags;
}

export const selectItems = (state):TagsModel[] => {
    return tagsState(state).tags;
}
