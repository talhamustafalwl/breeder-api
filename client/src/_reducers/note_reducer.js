import {CREATE_NOTE,UPDATE_NOTE,DELETE_NOTE,GET_NOTE,GET_NOTES,
    } from '../_actions/types';

export default function(state={},action){
    switch(action.type){
        case CREATE_NOTE:
            return {...state, create: action.payload }
        case UPDATE_NOTE:
            return {...state, update: action.payload }
        case DELETE_NOTE:
            return {...state, delete: action.payload }
        case GET_NOTE:
            return {...state, get: action.payload }
        case GET_NOTES:
            return {...state, getall: action.payload }
        default:
            return state;
        }
    }
    