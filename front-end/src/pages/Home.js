import React from 'react'
import { Link } from 'react-router-dom'
const Home = () => {
    return (
        <div
            style={{
                height: '60%'
            }}
            className='container-fluid d-flex flex-column'>
            <div
                class="row row-cols-1 row-cols-lg-2 px-0 px-lg-5 d-flex align-items-center py-3 my-3">
                <div className="col">
                    <div class="center-title">
                        <h3 className='mt-4 mb-3 mt-md-5 mb-lg-4'
                            style={{
                                color: 'var(--text-color)'
                            }}
                        >Create a Quiz in a simple and time saving way !</h3>
                        <p
                            style={{
                                color: 'var(--text-color)'
                            }}
                        >In today's digital age, content is released at an unprecedented rate. However, much of this content often fails to leave a lasting impact. Enter interactive content—particularly quizzes—which offers a fresh breath in an otherwise saturated market.</p>
                    </div>
                </div>
                <div className='col d-none d-lg-flex justify-content-end'>
                    <img
                        style={{ width: '75%' }}
                        src='https://cdn-icons-png.flaticon.com/512/4662/4662967.png' />
                </div>
            </div>
            <div className='d-block d-lg-none'>
                <h2 className='mb-3'
                style={{color: 'var(--primary-color-1)',fontWeight: '600'}}
                >Wanna Start?</h2>
                <h4 className='mb-4'
                style={{color: 'var(--primary-color-3)'}}
                >Login and begain your quiz!</h4>
                <Link
                style={{
                    padding: '.5rem 1rem',
                    backgroundColor: 'var(--primary-color-2)',
                    fontSize: '1.2rem',
                    textDecoration: 'none',
                    color: '#fff',
                    letterSpacing: '1px',
                    borderRadius: '5px',
                    boxShadow: '0px 1px 0px rgba(0,0,0,.3)'
                }}
                >
                Register/Login
                </Link>
            </div>
        </div>
    )
}

export default Home