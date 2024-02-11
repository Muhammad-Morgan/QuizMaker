import React, { useReducer, useEffect, useContext } from "react";
import { reducer } from "./reducer";
import axios from 'axios'
const AppContext = React.createContext();
const defaultState = {
    userDetails: {
        name: '',
        myID: ''
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
    const updateUser = () => {
        startLoading()
        axios.get('http://localhost:5000/checkuser').then(({ data }) => {
            if (data === 'No one is logged in') {
                dispatch({ type: 'updateUser', payload: { name: '', myID: '' } })
            }
            else {
                var localID = localStorage.getItem('localID') || ''
                const currentUser = data?.find((user) => user.myID === localID)
                const { name, myID } = currentUser
                dispatch({ type: 'updateUser', payload: { name, myID } })
            }
            endLoading()
        }).catch(err => console.log(err))
    }
    const updateUserLogin = (data) => {
        startLoading()
        var localID = localStorage.getItem('localID') || ''
        localID = data.myID
        localStorage.setItem('localID', localID)
        dispatch({ type: 'updateUserLogin', payload: data })
        endLoading()
    }
    useEffect(() => { updateUser() }, [])
    return <AppContext.Provider
        value={{
            ...state,
            showAlert,
            hideAlert,
            startLoading,
            endLoading,
            updateUser,
            updateUserLogin,
        }}
    >
        {children}
    </AppContext.Provider>
}


export const useGlobalContext = () => {
    return useContext(AppContext)
}
export { AppContext, AppProvider }