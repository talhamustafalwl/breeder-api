import {CREATE_CURRENCY,UPDATE_CURRENCY,DELETE_CURRENCY,GET_CURRENCY,GET_CURRENCIES} from '../_actions/types';

export default function(state={},action){
    switch(action.type){
        case CREATE_CURRENCY:
            return {...state, create: action.payload }
        case UPDATE_CURRENCY:
            return {...state, update: action.payload }
        case DELETE_CURRENCY:
            return {...state, delete: action.payload }
        case GET_CURRENCY:
            return {...state, get: action.payload }
        case GET_CURRENCIES:
            return {...state, getall: action.payload }
        default:
            return state;
        }
    }
    