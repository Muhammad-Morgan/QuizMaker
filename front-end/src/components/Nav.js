import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { useGlobalContext } from '../utilities/Context'
import axios from 'axios'
const Nav = () => {
    const { userDetails, showAlert, startLoading, endLoading, updateUserLogin } = useGlobalContext()
    const { myID, name } = userDetails
    const navigate = useNavigate()
    const [links, setLinks] = useState(false)
    const handleLogOut = (e) => {
        e.preventDefault()
        startLoading()
        axios.delete(`http://localhost:5000/logout/${myID}`).then(({ data }) => {
            if (data === 'logged out') {
                showAlert({
                    msg: data,
                    type: 'success'
                })
            } if (data === 'already logged out') {
                showAlert({
                    msg: data,
                    type: 'danger'
                })
            }
            updateUserLogin({
                name: '',
                myID: ''
            })
            localStorage.setItem('localID', '')
            navigate('/login')
            endLoading()
        }).catch(err => console.log(err))
    }
    return (
        <nav className="navbar bg-body-tertiary mb-5">
            <div className="container">
                <div className='quiz-logo'>
                    <Link
                        style={{ textDecoration: 'none' }}
                        to='/'
                        className='quiz-logo'
                    >QUIZ !!</Link>
                </div>
                <div className='dum d-none d-sm-block'>
                    {myID && (<h5
                        style={{
                            color: 'var(--primary-color-1)',
                            marginBottom: '0',
                            fontWeight: '400'
                        }}
                    >Hello {name} !</h5>)}
                </div>
                {myID ?
                    <ul
                        style={{
                            margin: '0'
                        }}
                        className="links-navbar-list d-none d-sm-block">
                        <Link
                            style={{
                                border: 'none'
                            }}
                            to='/createquiz'
                            className="navbar-brand-cstm-hor">
                            Create a quiz
                        </Link>
                        <Link
                        to='/allquizes'
                            style={{
                                border: 'none'
                            }}
                            className="navbar-brand-cstm-hor">
                            All Quizes
                        </Link>
                        <button
                            onClick={handleLogOut}
                            style={{
                                border: 'none'
                            }}
                            className="navbar-brand-cstm-hor-btn">
                            Logout
                        </button>
                    </ul>
                    :
                    <ul
                        style={{
                            margin: '0'
                        }}
                        className="links-navbar-list d-none d-sm-block">
                        <Link
                            to='/login'
                            className="navbar-brand-cstm-hor">
                            Login
                        </Link>
                        <Link
                            to='/register'
                            className="navbar-brand-cstm-hor">
                            Register
                        </Link>
                    </ul>



                }
                <button
                    onClick={() => setLinks(!links)}
                    className='bars-button d-block d-sm-none'>
                    <FontAwesomeIcon className='fa-2xl' icon={faBars} />
                    <div className={`btn-links ${links ? 'show-links' : 'hide-links'
                        }`}>
                        {!myID && <Link
                            to='/login'
                            style={{
                                borderTopRightRadius: '5px',
                                borderTopLeftRadius: '5px',
                            }} className="navbar-brand-cstm">
                            Login
                        </Link>}
                        {!myID && <Link to='/register'
                            className="navbar-brand-cstm">
                            Register
                        </Link>
                        }                        <Link
                            to='/about'
                            className="navbar-brand-cstm">
                            About us
                        </Link>
                        {myID && <button className='vertical-logout'
                            onClick={handleLogOut}
                        >
                            Logout
                        </button>}
                    </div>
                </button>
            </div>
        </nav>)
}

export default Nav
