import {CREATE_ELEMENT,UPDATE_ELEMENT,DELETE_ELEMENT,GET_ELEMENT,GET_ELEMENTS,
    CREATE_FORM,UPDATE_FORM,DELETE_FORM,GET_FORM,GET_FORMS } from '../_actions/types';

export default function(state={},action){
    switch(action.type){
        case CREATE_ELEMENT:
            return {...state, createelement: action.payload }
        case UPDATE_ELEMENT:
            return {...state, updateelement: action.payload }
        case DELETE_ELEMENT:
            return {...state, deleteelement: action.payload }
        case GET_ELEMENT:
            return {...state, getelement: action.payload }
        case GET_ELEMENTS:
            return {...state, getelements: action.payload }

//ELEMENT LOGS
        case CREATE_FORM:
            return {...state, createform: action.payload }
        case UPDATE_FORM:
            return {...state, updateform: action.payload }
        case DELETE_FORM:
            return {...state, deleteform: action.payload }
        case GET_FORM:
            return {...state, getform: action.payload }
        case GET_FORMS:
            return {...state, getforms: action.payload }
        default:
            return state;
        }
    }
    