export const reducer = (state, action) => {
    if (action.type === 'showAlert') {
        return {
            ...state,
            alert: {
                condition: true,
                type: action.payload.type,
                msg: action.payload.msg,
            }
        }
    }
    if (action.type === 'hideAlert') {
        return {
            ...state,
            alert: {
                condition: false,
                type: '',
                msg: '',
            }
        }
    }
    if (action.type === 'startLoading') {
        return {
            ...state,
            loading: true
        }
    }
    if (action.type === 'endLoading') {
        return {
            ...state,
            loading: false
        }
    }
    if(action.type === 'updateUser'){
        return {
            ...state,
            userDetails: {
                ...state.userDetails,
                name: action.payload.name,
                myID: action.payload.myID,
            }
        }
    }
    if(action.type === 'updateUserLogin'){
        return {
            ...state,
            userDetails: {
                ...state.userDetails,
                name: action.payload.name,
                myID: action.payload.myID,
            }
        }
    }
    return state
}