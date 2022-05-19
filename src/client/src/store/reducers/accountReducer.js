import {SET_ACCOUNTS, SET_ACCOUNTS_ERROR, SET_ACCOUNTS_LOADING} from '../../constants';

const initState = {
    accounts: [],
    loading: false,
    error: null
}

const accountReducer = (state = initState, action) => {
    switch (action.type) {
        case SET_ACCOUNTS:
            return {
                accounts: action.accounts,
                loading: false,
                error: null
            }
        case SET_ACCOUNTS_LOADING:
            return {
                ...state,
                loading: true,
                error: null
            }
        case SET_ACCOUNTS_ERROR:
            return {
                ...state,
                loading: false,
                error: action.error
            }
        default:
            return state
    }
}

export default accountReducer;
