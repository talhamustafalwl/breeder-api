import { combineReducers } from 'redux';
import user from './user_reducer';
import subscription from './subscription_reducer';
import transaction from './transaction_reducer';
import animal from './animal_reducer';

const rootReducer = combineReducers({
    user,subscription,transaction,animal
});

export default rootReducer;