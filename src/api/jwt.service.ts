import {USER_TOKEN} from "../Constants/constants";
import Cookies from "js-cookie";

import {AuthModel, AuthTokens} from "../features/auth/auth.model";

interface AuthData {
  user:AuthModel,
  token:AuthTokens
}

export const getAuthData = ():AuthData => {
  let jsonToken = window.localStorage.getItem(USER_TOKEN)
  return JSON.parse(jsonToken)
};

export const saveTokenToLocalStorage = (token:AuthTokens, user) => {

  // document.cookie = `token=${res.data.token};${expires};path=/`;
  try{
    console.log("saving to local Storage")
    let authData=JSON.stringify({
      user,
      token,
    })
    Cookies.set(
        USER_TOKEN,
        authData
    );
    console.log("authdata==", authData)
    window.localStorage.setItem(USER_TOKEN, authData);
  }catch (e){
    console.log("saving failed", e.message)
  }


};

export const destroyToken = () => {
  window.localStorage.removeItem(USER_TOKEN);
};


export default { getToken: getAuthData, saveToken: saveTokenToLocalStorage, destroyToken };
