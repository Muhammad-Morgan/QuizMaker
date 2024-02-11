import React from 'react'
import ReactDOM from 'react-dom/client'
import './Styles/styles.css'
import App from './App'
import {AppProvider} from './utilities/Context'
import "bootstrap/dist/css/bootstrap.min.css";
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
                <AppProvider>
                    <App />
                </AppProvider>
    </React.StrictMode>
)