import {LOGIN_USER,REGISTER_USER,AUTH_USER,LOGOUT_USER,FORGET_PASSWORD,PASSWORD_CHANGE} from '../_actions/types';
export default function(state={},action){
    switch(action.type){
        case REGISTER_USER:
            return {...state, register: action.payload }
        case LOGIN_USER:
            return { ...state, loginSucces: action.payload }
        case AUTH_USER:
            if (action.payload.data){
                return {...state, userData: action.payload,username: action.payload.data.name,useremail: action.payload.data.email,userId:action.payload.data._id}
            }
            return {...state, userData: action.payload}
        case LOGOUT_USER:
            return {...state, logout: action.payload }
        case FORGET_PASSWORD:
            return {...state, forgetPassword: action.payload }
        case PASSWORD_CHANGE:
            return {...state, passwordChange: action.payload }
        default:
            return state;
    }
}
