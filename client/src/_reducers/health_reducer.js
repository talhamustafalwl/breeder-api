import {CREATE_HEALTH,UPDATE_HEALTH,DELETE_HEALTH,GET_HEALTH,GET_HEALTHS,
    GET_ALL_HEALTH,DELETE_ALL_HEALTH} from '../_actions/types';

export default function(state={},action){
    switch(action.type){
        case CREATE_HEALTH:
            return {...state, create: action.payload }
        case UPDATE_HEALTH:
            return {...state, update: action.payload }
        case DELETE_HEALTH:
            return {...state, delete: action.payload }
        case GET_HEALTH:
            return {...state, get: action.payload }
        case GET_HEALTHS:
            return {...state, getall: action.payload }
        //admin
        case GET_ALL_HEALTH:
            return {...state, adminhealths: action.payload }
        case DELETE_ALL_HEALTH:
            return {...state, deletehealths: action.payload }
        default:
            return state;
        }
    }
    