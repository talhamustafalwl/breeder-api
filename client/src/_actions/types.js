export const LOGIN_USER = 'login_user';
export const REGISTER_USER = 'register_user';
export const AUTH_USER = 'auth_user';
export const LOGOUT_USER = 'logout_user';
export const FORGET_PASSWORD='forget_password'
export const PASSWORD_CHANGE='password_change'

//------subscription package-------
//admin
export const CREATE_SUBSCRIPTION = 'create_subscription';
export const UPDATE_SUBSCRIPTION= 'update_subscription';
export const DELETE_SUBSCRIPTION= 'delete_subscription';
export const DELETE_SUBSCRIPTIONS= 'delete_subscriptions';
export const GET_SUBSCRIPTIONS= 'get_subscriptions';
export const GET_SUBSCRIPTION= 'get_subscription';
//---
export const UPDATE_SUBSCRIBER = 'update_subscriber';
export const DELETE_SUBSCRIBERS= 'delete_subscribers';
export const GET_SUBSCRIBER= 'get_subscriber';
export const GET_SUBSCRIBERS= 'get_subscribers';
export const DELETE_SUBSCRIBER= 'delete_subscriber';
///

export const CREATE_SUBSCRIBER_STRIPE = 'create_subscriber_stripe';//breeder


/// transaction --admin
export const GET_TRANSACTIONS = 'get_transactions';
export const GET_TRANSACTION = 'get_transaction';


///----animal----
//admin
export const GET_ALL_ANIMALS = 'get_all_animals';
export const DELETE_ALL_ANIMALS = 'delete_all_animals';
//
export const CREATE_ANIMAL = 'create_animal';
export const UPDATE_ANIMAL= 'update_animal';
export const DELETE_ANIMAL= 'delete_animal';
export const GET_ANIMAL= 'get_animal';
export const GET_ANIMALS= 'get_animals';
export const FILTER_ANIMALS= 'filter_animals';


///breeder business profile
export const CREATE_BUSINESS = 'create_business';
export const UPDATE_BUSINESS= 'update_business';
export const GET_BUSINESS= 'get_business';
export const DELETE_BUSINESS= 'delete_business';

//location ,-------city,state,zipcode---------
export const CREATE_LOCATION = 'create_location';
export const UPDATE_LOCATION= 'update_location';
export const GET_LOCATION= 'get_location';
export const GET_LOCATIONS= 'get_locations';
export const GET_ALL_LOCATIONS= 'get_all_location';
export const DELETE_LOCATION= 'delete_location';

export const GET_CITIES= 'get_cities';
export const GET_STATES= 'get_states';
export const GET_ZIPCODES= 'get_zipcodes';

//--------categories------------
//admin
export const CREATE_CATEGORY = 'create_category';
export const UPDATE_CATEGORY= 'update_category';
export const DELETE_CATEGORY= 'delete_category';
//
export const GET_CATEGORY= 'get_category';
export const GET_CATEGORIES= 'get_categories';


//--------feed------------
export const CREATE_FEED = 'create_feed';
export const UPDATE_FEED= 'update_feed';
export const DELETE_FEED= 'delete_feed';
export const GET_FEED= 'get_feed';
export const GET_FEEDS= 'get_feeds';

export const CREATE_FEEDANIMAL = 'create_feedanimal';
export const UPDATE_FEEDANIMAL= 'update_feedanimal';
export const DELETE_FEEDANIMAL= 'delete_feedanimal';
export const GET_FEEDANIMAL= 'get_feedanimal';
export const GET_FEEDANIMALS= 'get_feedanimals';




//--------cleaning------------
export const CREATE_CLEANING= 'create_cleaning';
export const UPDATE_CLEANING= 'update_cleaning';
export const DELETE_CLEANING= 'delete_cleaning';
export const GET_CLEANING= 'get_cleaning';
export const GET_CLEANINGS= 'get_cleanings';

export const CREATE_CLEANINGANIMAL = 'create_cleaninganimal';
export const UPDATE_CLEANINGANIMAL= 'update_cleaninganimal';
export const DELETE_CLEANINGANIMAL= 'delete_cleaninganimal';
export const GET_CLEANINGANIMAL= 'get_cleaninganimal';
export const GET_CLEANINGANIMALS= 'get_cleaninganimals';