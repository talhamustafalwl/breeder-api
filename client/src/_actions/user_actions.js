import axios from 'axios';
import {LOGIN_USER,REGISTER_USER,AUTH_USER,LOGOUT_USER,FORGET_PASSWORD,PASSWORD_CHANGE} from './types';



export function registerUser(dataToSubmit){
    const request = axios.post(`user/register`,dataToSubmit)
        .then(response => response.data);
    
    return {
        type: REGISTER_USER,
        payload: request
    }
}


export function loginUser(dataToSubmit){
    const request = axios.post(`user/login`,dataToSubmit)
                .then(response => response.data);
   
    return {
        type: LOGIN_USER,
        payload: request
    }
}


export function auth(){
    const request = axios.get(`user/auth`)
    .then(response => response.data);

    return {
        type: AUTH_USER,
        payload: request
    }
}


export function logoutUser(){
    const request = axios.get(`user/logout`)
    .then(response => response.data);
    return {
        type: LOGOUT_USER,
        payload: request
    }
}



export function forgetPassword(dataToSubmit){
    const request =axios.post(`user/forgetpassword`,dataToSubmit)
        .then(response => response.data)
    
    return {
        type: FORGET_PASSWORD,
        payload: request
    }
}


export function passwordChange(dataToSubmit,passwordstr){ 
    console.log(passwordstr)
    const request = axios.post(`user/forgetpassword/${passwordstr}`,dataToSubmit)
        .then(response => response.data);
    console.log(request)
    return {
        type: PASSWORD_CHANGE,
        payload: request
    }
}
