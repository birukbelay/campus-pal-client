
import { AuthState} from "./auth.model";

export const selectAuth = (state) => {
    return state.auth;
}
export const IsAuthenticated = (state):AuthState => {
    console.log("user is >>>", selectAuth(state).authenticated)
    return selectAuth(state).authenticated;
}

