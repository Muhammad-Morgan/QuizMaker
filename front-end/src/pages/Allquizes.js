import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useGlobalContext } from '../utilities/Context'
import { useNavigate } from 'react-router-dom'
import Loading from '../components/Loading'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { jwtDecode } from 'jwt-decode'

const Allquizes = () => {
    const { loading, startLoading, endLoading, userDetails, updateInfo } = useGlobalContext()
    const navigate = useNavigate()
    const [quiz, setQuiz] = useState({
        name: '',
        creatorName: ''
    })
    const [allQuizez, setAllQuizez] = useState([])
    const getQuizez = async () => {
        startLoading()
        axios.get('http://localhost:5000/getallquizez').then(({ data }) => {
            if (data) {
                setAllQuizez(data)
            }
        }).catch(err => console.log(err))
        endLoading()
    }
    const handleChangeName = (e) => {
        const name = e.target.name
        const value = e.target.value
        setQuiz({
            ...quiz,
            [name]: value
        })
        axios.get(`http://localhost:5000/filterquizname?quizname=${value}`).then(({ data }) => {
            setAllQuizez(data)
        }).catch(err => console.log(err))
    }
    const handleChangeAuthor = (e) => {
        const name = e.target.name
        const value = e.target.value
        setQuiz({
            ...quiz,
            [name]: value
        })
        axios.get(`http://localhost:5000/filterauthorname?authorname=${value}`).then(({ data }) => {
            setAllQuizez(data)
        }).catch(err => console.log(err))
    }
    const clearBtn = (e) => {
        e.preventDefault()
        setQuiz({
            name: '',
            creatorName: ''
        })
        getQuizez()
    }
    useEffect(() => {
        var localToken = localStorage.getItem('localToken')
        axios.get(`http://localhost:5000/auth?token=${localToken}`).then(({ data }) => {
            const { type, myToken } = data
            if (type === 'failed') {
                navigate('/login')
            } else {
                const myData = jwtDecode(myToken)
                const { name, myID } = myData
                updateInfo({
                    name,
                    myID,
                    type: myData.type
                })
            }
        }).catch(err => console.log(err))
    }, [userDetails.name])
    useEffect(() => {
        if (userDetails.type === 'instructor') {
            navigate('/createquiz')
        }
    }, [userDetails.type])
    useEffect(() => { getQuizez() }, [])
    if (loading) {
        return <Loading />
    }
    return (
        <div className=' container-fluid'>
            <div className="card mb-4 mt-3 shadow" style={{
                maxWidth: '1150px',
                width: '90%',
                marginInline: 'auto',
                boxShadow: '1px 1px 2px 1px rgba(0,0,0,.1)',
                paddingBlock: '1.5rem',
                paddingInline: '1rem',
                border: 'none',
                backgroundColor: '#fff'
            }}>
                <div className="card-body">
                    <div className='row row-cols-1 row-cols-md-2'>
                        <div className='col'>
                            <h5 className="fs-5 fw-light">Find a Quiz</h5>
                            <div
                            >
                                <input
                                    className="form-control"
                                    type="text"
                                    name='name'
                                    id='name'
                                    value={quiz.name}
                                    onChange={handleChangeName}
                                />
                            </div>

                        </div>
                        <div className='col'>
                            <h5 className="fs-5 fw-light">Search with author name</h5>
                            <div
                            >
                                <input
                                    className="form-control"
                                    type="text"
                                    name='creatorName'
                                    id='creatorName'
                                    value={quiz.creatorName}
                                    onChange={handleChangeAuthor}
                                />
                            </div>

                        </div>

                    </div>
                    <div className='row mt-3 row-cols-1 row-cols-md-2'>
                        <div className='col'>
                            <button type="button"
                                onClick={clearBtn}
                                className="my-clear-btn">Clear</button>
                        </div>
                    </div>
                </div>
            </div>
            <section className='search-result'
                style={{
                    maxWidth: '1150px',
                    width: '90%',
                    marginInline: 'auto',
                    border: 'none',
                }}
            >
                <h3 className='ms-2 text-secondary'
                    style={{
                        fontSize: '1.3rem',
                    }}
                >{allQuizez.length} Quiz</h3>
                <div className='row row-cols-1 row-cols-md-2'>
                    {allQuizez?.map((quiz) => {
                        const { _id, name, creatorName } = quiz
                        return (
                            <div key={_id}
                                className='col mb-3'>
                                <div
                                    style={{
                                        boxShadow: '1px 1px 2px 1px rgba(0,0,0,.1)',
                                        border: 'none',
                                        textDecoration: 'none',
                                        marginInline: '0',
                                        width: '100%'
                                    }}
                                    className="card rounded shadow-sm">
                                    <div
                                        style={{
                                            backgroundColor: '#fff'
                                        }}
                                        className="card-header">
                                        <div
                                            style={{
                                                width: '100%'
                                            }}
                                            className='d-flex justify-content-between align-items-center'>
                                            <h4 className='text-capitalize fw-normal'>{name}</h4>

                                            <h3
                                                style={{
                                                    backgroundColor: 'var(--pending-2)',
                                                    color: 'var(--pending)',
                                                    fontSize: '2rem',
                                                    fontWeight: '500',
                                                    marginRight: '1rem',
                                                    padding: '.7rem 1.2rem',
                                                    borderRadius: '5px',
                                                    boxShadow: '1px 1px 2px 1px rgba(0,0,0,.1)',
                                                }}
                                            >
                                                {name?.slice(0, 1).toUpperCase()}
                                            </h3>

                                        </div>
                                    </div>
                                    <div className="card-body"
                                        style={{
                                            width: '100%',
                                            backgroundColor: '#fff',
                                            borderBottomLeftRadius: '5px',
                                            borderBottomRightRadius: '5px',
                                        }}
                                    >
                                        <div style={{
                                            width: '97%'
                                        }} className='d-flex mb-4 justify-content-between align-items-center'>
                                            <h4 style={{
                                                color: 'var(--text-color)',
                                            }} className='fw-light'>Created by</h4>
                                            <h4 className='text-capitalize fw-light text-primary-emphasis'>{creatorName} <FontAwesomeIcon icon={faUser} /></h4>
                                        </div>
                                        <div className='d-flex justify-content-between align-items-center'>

                                            <div className="d-flex justify-content-between gap-3">
                                                <Link
                                                style={{fontSize: '1rem'}}
                                                    to={`/quizez/${_id}`}
                                                    className="my-newBtns-take px-3">Take quiz</Link>
                                            </div>

                                        </div>
                                        <div className="d-flex mb-3 justify-content-start gap-3">

                                        </div>
                                    </div>
                                </div>
                            </div>


                        )
                    })}
                </div>
            </section >
        </div >)
}

export default Allquizes
