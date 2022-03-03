import { createStore } from 'redux'
import authReducer from './authReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const configureStore = () => {

    const store = createStore(authReducer);
    store.subscribe(() => {
      
    })
    return store;
}

export default configureStore;