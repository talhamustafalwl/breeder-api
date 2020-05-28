import {GET_TRANSACTION,GET_TRANSACTIONS} from '../_actions/types';

export default function(state={},action){
    switch(action.type){
        case GET_TRANSACTIONS:
            return {...state, transactions: action.payload }
        case GET_TRANSACTION:
            return {...state, transaction: action.payload }

            
        default:
            return state;
    }
}
