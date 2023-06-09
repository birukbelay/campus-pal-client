import JwtService from "./jwt.service";
import axios, { AxiosRequestConfig } from "axios";

import {API_ROOT} from "../Constants/constants";

export const axiosClient = axios.create({
  baseURL: API_ROOT
});

const ApiService = {
  setHeader() {
    axiosClient.defaults.headers[
        "Authorization"
        ] = `Bearer ${JwtService.getToken().token}`;
  },

  query(resource: string, params: AxiosRequestConfig | undefined) {
    return axiosClient.get(resource, params).catch((error) => {
      // throw new Error(error);
      throw new Error(`[NETWORK]  ${error} Please try again`);
    });
  },

  get(resource, slug = "") {
    return axiosClient.get(slug ? `${resource}/${slug}` :`${resource}`).catch((error) => {

      throw new Error(`[NETWORK] Service ${error} Please try again`);
    });
  },

  post(resource, params?: any) {
    return axiosClient.post(`${resource}`, params).catch((error) => {

      throw new Error(`[NETWORK]  ${error} Please try again`);
    });
  },

  update(resource, slug, params) {
    return axiosClient.patch(`${resource}/${slug}`, params).catch((error) => {
      throw new Error(`[NETWORK]  ${error} Please try again`);
    });
  },

  put(resource, params) {
    return axiosClient.put(`${resource}`, params).catch((error) => {
      throw new Error(`[NETWORK] Service ${error} Please try again`);
    });
  },

  delete(resource, id) {
    return axiosClient.delete(`${resource}/${id}`).catch((error) => {
      throw new Error(`[NETWORK] Service ${error} Please try again`);
    });
  }
};

export default ApiService;

export const TagsService = {
  get:()=> ApiService.get("tags") };

export const AuthService={
  login: info=>ApiService.post('auth/login', info),
  signup: info=>ApiService.post('auth/register', info),
  signupWithPhone: info=>ApiService.post('auth/phoneRegister', info),
}

const users = {
  delete: id => ApiService.delete(`/users/`, id),
  get: id => ApiService.get(id ? `/users/${id}` : '/users'),
  update: (id, updates) => ApiService.put(`/users/${id}`, updates),
  create: user => ApiService.post('/users', user),
}



const book="books"
export const ItemService = {
  fetch(params) {
    return ApiService.query(book, params)
  },
  get:(slug) => ApiService.get(book, slug),
  create:(params) =>  ApiService.post(book, params),
  update:(slug, params)=> ApiService.update(book, slug, params),
  delete:(slug) => ApiService.delete(`${book}`, slug),
};

