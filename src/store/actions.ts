import {
    createActions,
    createAction
} from 'redux-actions';

const actions = createActions({
    SET_USER_INFO: info => info
});

export const getUserInfo = createAction('GET_USER_INFO');

export default actions;