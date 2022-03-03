import * as ACTIONS from './Constants'


const defaultState = {
    isLoggedIn: false,
    userEmail: undefined,
    userFirstName: undefined,
    userLastName: undefined,
}


const authReducer = (state = { ...defaultState }, action) => {//reducer fonksiyonu tanımlıyoruz. son state'i ve action'ı parametre olarak alır
    console.log("gelen action payload:", action.payload)
    if (action.type === ACTIONS.LOGOUT_SUCCESS) {
        return defaultState;
    } else if (action.type === ACTIONS.LOGIN_SUCCESS) {
        return {//login-success ile gönderilen payload'u ve kendi fieldımızı ekleyip return ediyoruz
            ...action.payload,
            isLoggedIn: true
        }
    }
    else if (action.type === ACTIONS.UPDATE_USER_INFO) {
        return {//login-success ile gönderilen payload'u ve kendi fieldımızı ekleyip return ediyoruz
            ...action.payload,
            isLoggedIn: true
        }
    }
    return state;
}

export default authReducer;