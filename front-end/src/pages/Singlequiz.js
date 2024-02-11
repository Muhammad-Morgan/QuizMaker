import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../utilities/Context'
import Loading from '../components/Loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
const Singlequiz = () => {
    const { loading, startLoading, endLoading, showAlert, userDetails, updateInfo } = useGlobalContext()
    const navigate = useNavigate()
    const [resultCondition, setResultCondition] = useState(false)
    const [quizName, setQuizName] = useState('')
    const [pageQuiz, setPageQuiz] = useState([])
    const [value, setValue] = useState(0)
    const { id } = useParams()
    const getQuizez = async () => {
        startLoading()
        axios.get(`https://quiz-maker-server.vercel.app/getsinglequiz?id=${id}`).then(({ data }) => {
            if (data) {
                const { name, quiz } = data
                setQuizName(name)
                var quizQuestions = quiz.map((item) => {
                    item.answer = ''
                    return item
                })
                setPageQuiz(quizQuestions)
            }
        }).catch(err => console.log(err))
        endLoading()
    }
    const nextPage = (e) => {
        e.preventDefault()
        if (value < 5) {
            setValue(value + 1)
        }
    }
    const prevPage = (e) => {
        e.preventDefault()
        setValue(value - 1)
    }
    const rightAnswer = (e) => {
        e.preventDefault()
        var newQu = pageQuiz.map((item, index) => {
            if (index === value) {
                item.answer = true
            }
            return item
        })
        setPageQuiz(newQu)
        if (value < pageQuiz.length - 1) {
            setValue(value + 1)
        }
    }
    const wrongAnswer = (e) => {
        e.preventDefault()
        var newQu = pageQuiz.map((item, index) => {
            if (index === value) {
                item.answer = false
            }
            return item
        })
        setPageQuiz(newQu)
        if (value < pageQuiz.length - 1) {
            setValue(value + 1)
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post(`https://quiz-maker-server.vercel.app/submitquiz?id=${id}&userID=${userDetails.myID}&username=${userDetails.name}`, pageQuiz).then(() => {
            showAlert({
                msg: 'Results were saved',
                type: 'success'
            })
            setResultCondition(true)
        }).catch(err => console.log(err))
    }
    useEffect(() => {
        var localToken = localStorage.getItem('localToken')
        axios.get(`https://quiz-maker-server.vercel.app/auth?token=${localToken}`).then(({ data }) => {
            const { type } = data
            if (type === 'failed') {
                const { msg } = data
                showAlert({ msg, type: 'danger' })
                navigate('/login')
            }
            else {
                const { myToken } = data
                const myData = jwtDecode(myToken)
                const { name, myID, type } = myData
                updateInfo({ name, myID, type })
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
    if (resultCondition) {
        return (
            <div className="card mt-5 shadow" style={{
                width: '90%',
                paddingBlock: '3rem',
                paddingInline: '2rem',
                marginInline: 'auto',
                maxWidth: '1150px',
                border: 'none',
                boxShadow: '1px 1px 2px 1px rgba(0,0,0,.1)',
                backgroundColor: '#fff'
            }}>
                <div style={{marginInline: 'auto'}} className="card-body d-flex flex-column align-items-center">
                    <h2 className='mb-5 text-center fs-2 fw-light'>View your results !</h2>
                    <Link to={`/results/${userDetails.myID}`} 
                    style={{width: 'fit-content', paddingInline: '2.2rem'}}
                    className="my-new-btn-submit text-center shadow">Show
                    </Link>
                </div>
            </div>)
    }
    return (
        <div className="card mt-5 shadow" style={{
            width: '57%',
            paddingBlock: '1.5rem',
            paddingInline: '2rem',
            marginInline: 'auto',
            maxWidth: '1150px',
            border: 'none',
            boxShadow: '1px 1px 2px 1px rgba(0,0,0,.1)',
            backgroundColor: '#fff'
        }}>
            <h2
                // style={{ color: 'var(--text-color)' }}
                className="card-title mb-4 text-capitalize">{quizName}</h2>
            <div className="card-body"

            >
                <form style={{
                    height: 'auto !important'
                }}>
                    <h3 className='quest mb-5'>{pageQuiz[value]?.question}</h3>
                    <div className='answers mb-3'>
                        <div className="d-flex"

                            style={{ width: '75px' }}>
                            <button onClick={rightAnswer} className="btn me-2 btn-primary">Right</button>
                            <button onClick={wrongAnswer} className="btn btn-danger">Wrong</button>
                        </div>
                    </div>
                    <div
                        className="d-flex justify-content-between">
                        {value > 0 && <button
                            onClick={prevPage}
                            className="btn btn-secondary"><FontAwesomeIcon icon={faAngleLeft} /></button>
                        }
                        {value < pageQuiz.length - 1 && <button
                            onClick={nextPage}
                            className="btn ms-auto btn-secondary"><FontAwesomeIcon className='fa-lg' icon={faAngleRight} /></button>}
                        {value >= pageQuiz.length - 1 && <button
                            onClick={handleSubmit}
                            className="btn ms-auto btn-primary">Submit</button>}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Singlequiz
