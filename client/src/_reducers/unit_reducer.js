import {CREATE_UNIT,UPDATE_UNIT,DELETE_UNIT,GET_UNIT,GET_UNITS} from '../_actions/types';

export default function(state={},action){
    switch(action.type){
        case CREATE_UNIT:
            return {...state, create: action.payload }
        case UPDATE_UNIT:
            return {...state, update: action.payload }
        case DELETE_UNIT:
            return {...state, delete: action.payload }
        case GET_UNIT:
            return {...state, get: action.payload }
        case GET_UNITS:
            return {...state, getall: action.payload }
        default:
            return state;
        }
    }
    