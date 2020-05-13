import { combineReducers } from 'redux';
import user from './user_reducer';
import subscription from './subscription_reducer';
import transaction from './transaction_reducer';
const rootReducer = combineReducers({
    user,subscription,transaction
});

export default rootReducer;