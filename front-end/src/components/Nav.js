import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { useGlobalContext } from '../utilities/Context'
import axios from 'axios'
const Nav = () => {
    const { userDetails, showAlert, updateInfo } = useGlobalContext()
    const { myID, name, type } = userDetails
    const navigate = useNavigate()
    const [links, setLinks] = useState(false)
    const handleLogOut = (e) => {
        e.preventDefault()
        axios.delete(`https://quiz-maker-server.vercel.app/logout`).then(({ data }) => {
            const { msg, type } = data
            showAlert({
                msg,
                type
            })
            localStorage.removeItem('localToken')
            updateInfo({ name: '', myID: '', type: '' })
            navigate('/login')
        }).catch(err => console.log(err))
    }
    return (
        <nav className="navbar shadow-sm bg-body-tertiary mb-4">
            <div className="container">
                <div
                className='d-flex align-items-center justify-content-between'>
                    <Link
                        style={{ textDecoration: 'none' }}
                        to='/'
                        className='quiz-logo me-3 me-md-4 me-lg-5'
                    >QUIZ !!</Link>
                <div className='dum d-none d-sm-block'>
                    {myID && (<p
                     className='fs-5 fw-lighter p-0 m-0 text-secondary'   
                    >Hello {name} !</p>)}
                </div>
                </div>
                {myID ?
                    <ul
                        style={{
                            margin: '0'
                        }}
                        className="links-navbar-list d-none d-sm-block">
                        {type === 'instructor' && <Link
                            style={{
                                border: 'none'
                            }}
                            to='/createquiz'
                            className="navbar-brand-cstm-hor">
                            Create a quiz
                        </Link>
                        }
                        {type === 'student' && <Link
                            to='/allquizes'
                            style={{
                                border: 'none'
                            }}
                            className="navbar-brand-cstm-hor">
                            All Quizes
                        </Link>
                        }
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
