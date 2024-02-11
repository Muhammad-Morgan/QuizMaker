import React, { useReducer, useContext } from "react";
import { reducer } from "./reducer";
const AppContext = React.createContext();
const defaultState = {
    userDetails: {
        name: '',
        myID: '',
        type: ''
    },
    loading: false,
    alert: {
        condition: false,
        type: '',
        msg: ''
    }
}
const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, defaultState)
    const showAlert = ({ msg, type }) => { dispatch({ type: 'showAlert', payload: { msg, type } }) }
    const startLoading = () => { dispatch({ type: 'startLoading' }) }
    const endLoading = () => { dispatch({ type: 'endLoading' }) }
    const hideAlert = () => { dispatch({ type: 'hideAlert' }) }
    const updateInfo = (newInfo) => {dispatch({type: 'updateInfo', payload: newInfo})}
    return <AppContext.Provider
        value={{
            ...state,
            showAlert,
            hideAlert,
            startLoading,
            endLoading,
            updateInfo
        }}
    >
        {children}
    </AppContext.Provider>
}


export const useGlobalContext = () => {
    return useContext(AppContext)
}
export { AppContext, AppProvider }