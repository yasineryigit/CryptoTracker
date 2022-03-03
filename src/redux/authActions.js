import * as ACTIONS from './Constants'


export const logoutSuccess = () => {
    return {
        type: ACTIONS.LOGOUT_SUCCESS
    }
}

export const updateUserInfo = newState => {
    return {
        type: ACTIONS.UPDATE_USER_INFO,
        payload: newState
    }
}

export const loginSuccess = authState => {
    return {
        type: ACTIONS.LOGIN_SUCCESS,
        payload: authState
    }
}


