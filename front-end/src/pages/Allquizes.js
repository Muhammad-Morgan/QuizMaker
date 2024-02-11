import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useGlobalContext } from '../utilities/Context'
import { useNavigate } from 'react-router-dom'
import Loading from '../components/Loading'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

const Allquizes = () => {
    const { loading, startLoading, endLoading } = useGlobalContext()
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
        }).catch(err=>console.log(err))
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
        }).catch(err=>console.log(err))
    }
    const clearBtn = (e) => {
        e.preventDefault()
        setQuiz({
            name: '',
            creatorName: ''
        })
        getQuizez()
    }
    useEffect(() => { getQuizez() }, [])
    useEffect(() => {
        var id = localStorage.getItem('localID')
        if (loading === false && (id === '')) {
            navigate('/login')
        }
    }, [])
    if (loading) {
        return <Loading />
    }

    return (
        <div className=' container-fluid'>
            <div className="card mb-4 mt-3" style={{
                maxWidth: '1150px',
                width: '90%',
                marginInline: 'auto',
                boxShadow: '1px 1px 2px 1px rgba(0,0,0,.1)',
                paddingBlock: '1.5rem',
                paddingInline: '1rem',
                border: 'none',
            }}>
                <div className="card-body">
                    <div className='row row-cols-1 row-cols-md-2'>
                        <div className='col'>
                            <h5 className="fs-5">Find a Quiz</h5>
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
                            <h5 className="fs-5">Search with author name</h5>
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
                <h3 className='ms-2'
                    style={{
                        fontSize: '1.3rem',
                        color: 'var(--navbar-color)'
                    }}
                >{allQuizez.length} Quizez</h3>
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
                                        textDecoration: 'none'
                                    }}
                                    className="card">
                                    <div
                                        style={{
                                            backgroundColor: '#fff'
                                        }}
                                        className="card-header">
                                        <div
                                            style={{
                                                width: '85%'
                                            }}
                                            className='d-flex justify-content-between align-items-center'>
                                            <h3 className='text-capitalize'>{name}</h3>

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
                                            width: '85%'
                                        }}
                                    >
                                        <div className='d-flex mb-4 justify-content-between align-items-center'>
                                            <h4 style={{
                                                color: 'var(--text-color)'
                                            }}>Created by</h4>
                                            <h4 className='text-capitalize' style={{
                                                color: 'var(--primary-color-2)'
                                            }}>{creatorName} <FontAwesomeIcon icon={faUser} /></h4>
                                        </div>
                                        <div className='d-flex justify-content-between align-items-center'>

                                            <div className="d-flex justify-content-between gap-3">
                                                <Link
                                                    to={`/quizez/${_id}`}
                                                    className="my-newBtns-take">Take quiz</Link>
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
