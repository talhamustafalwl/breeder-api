import axios from 'axios';
import {GET_TRANSACTION,GET_TRANSACTIONS} from './types';



export function getTransaction(id){
    const request = axios.get(`/transaction/${id}`)
        .then(response => response.data);
    
    return {
        type: GET_TRANSACTION,
        payload: request
    }
}


export function getTransactions(){
    const request = axios.get(`/transaction`)
        .then(response => response.data);
    
    return {
        type: GET_TRANSACTIONS,
        payload: request
    }
}