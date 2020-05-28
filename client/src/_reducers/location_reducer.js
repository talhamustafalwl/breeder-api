import {GET_CITIES,GET_STATES,GET_ZIPCODES,
    CREATE_LOCATION,UPDATE_LOCATION,GET_LOCATION,GET_LOCATIONS,DELETE_LOCATION,
    GET_ALL_LOCATIONS} from '../_actions/types';

export default function(state={},action){
    switch(action.type){
        case GET_CITIES:
            return {...state, cities: action.payload }
        case GET_STATES:
            return {...state, states: action.payload }
        case GET_ZIPCODES:
            return {...state, zipcodes: action.payload }


        case CREATE_LOCATION:
            return {...state, create: action.payload }
        case UPDATE_LOCATION:
            return {...state, update: action.payload }
        case GET_LOCATION:
            return {...state, get: action.payload }
        case GET_LOCATIONS:
            return {...state, getall: action.payload }
        case DELETE_LOCATION:
            return {...state, delete: action.payload }
        case GET_ALL_LOCATIONS://admin
            return {...state, alllocations: action.payload }
        default:
            return state;
    }
}
