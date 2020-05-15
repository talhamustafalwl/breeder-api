import { combineReducers } from 'redux';
import user from './user_reducer';
import subscription from './subscription_reducer';
import transaction from './transaction_reducer';
import animal from './animal_reducer';
import business from './business_reducer';
import location from './location_reducer';
import category from './category_reducer';
import feed from './feed_reducer';
import cleaning from './cleaning_reducer';
import vacination from './vacination_reducer';
import currency from './currency_reducer';
import unit from './unit_reducer';
import health from './health_reducer';
import group from './group_reducer';

const rootReducer = combineReducers({
    user,subscription,transaction,animal,business,location,
    category,currency,unit,health,
    feed,cleaning,vacination,
    group
});

export default rootReducer;