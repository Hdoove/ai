import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import actions from './actions';

const defaultState = Immutable({
    userinfo: {
        status: 0, // 0 未提示 1已提示但未授权 2已授权
        name: '',
        picture: '',
        all: 0,
        success: 0,
        fail: 0
    },
});

const user = handleActions(
    new Map([
        [
            actions.setUserInfo,
            (state, { payload }) => state.set('userinfo', payload)
        ]
    ]),
    defaultState
);


export default combineReducers({
    user
})