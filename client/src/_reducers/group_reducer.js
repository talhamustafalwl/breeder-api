import {CREATE_GROUP,UPDATE_GROUP,DELETE_GROUP,GET_GROUP,GET_GROUPS,
    CREATE_GROUP_LOG,UPDATE_GROUP_LOG,DELETE_GROUP_LOG,GET_GROUP_LOG,GET_GROUP_LOGS } from '../_actions/types';

export default function(state={},action){
    switch(action.type){
        case CREATE_GROUP:
            return {...state, create: action.payload }
        case UPDATE_GROUP:
            return {...state, update: action.payload }
        case DELETE_GROUP:
            return {...state, delete: action.payload }
        case GET_GROUP:
            return {...state, get: action.payload }
        case GET_GROUPS:
            return {...state, getall: action.payload }

//GROUP LOGS
        case CREATE_GROUP_LOG:
            return {...state, createlog: action.payload }
        case UPDATE_GROUP_LOG:
            return {...state, updatelog: action.payload }
        case DELETE_GROUP_LOG:
            return {...state, deletelog: action.payload }
        case GET_GROUP_LOG:
            return {...state, getlog: action.payload }
        case GET_GROUP_LOGS:
            return {...state, getlogs: action.payload }
        default:
            return state;
        }
    }
    