import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../utilities/Context'
import Loading from '../components/Loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
const Singlequiz = () => {
    const { loading, startLoading, endLoading,showAlert } = useGlobalContext()
    const navigate = useNavigate()
    var userId = localStorage.getItem('localID')
    const [namee, setNamee] = useState('')
    const [resultCondition, setResultCondition] = useState(false)
    const [pageQuiz, setPageQuiz] = useState([])
    const [score, setScore] = useState({
        result: 0,
        mistakes: []
    })
    const [value, setValue] = useState(0)
    const { id } = useParams()
    const getQuizez = async () => {
        startLoading()
        axios.get(`http://localhost:5000/getsinglequiz?id=${id}`).then(({ data }) => {
            if (data) {
                const { name, quiz } = data
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
        axios.post(`http://localhost:5000/submitquiz?id=${id}&userID=${userId}`, pageQuiz).then(() => {
            showAlert({
                msg: 'Results were saved',
                type: 'success'
            })
            setResultCondition(true)
        }).catch(err => console.log(err))
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
    if (resultCondition) {
        return (
            <div className="card mt-3" style={{
                width: '90%',
                paddingBlock: '1.5rem',
                paddingInline: '2rem',
                marginInline: 'auto',
                maxWidth: '1150px',
                border: 'none',
                boxShadow: '1px 1px 2px 1px rgba(0,0,0,.1)',
            }}>
                <div className="card-body">
                    <h2>View your results</h2>
                    <Link to={`/results/${userId}`} className="my-new-btn-submit">Submit your Quiz !
                    </Link>
                </div>
            </div>)
    }
    return (
        <div className="card mt-3" style={{
            width: '90%',
            paddingBlock: '1.5rem',
            paddingInline: '2rem',
            marginInline: 'auto',
            maxWidth: '1150px',
            border: 'none',
            boxShadow: '1px 1px 2px 1px rgba(0,0,0,.1)',
        }}>
            <h2
                // style={{ color: 'var(--text-color)' }}
                className="card-title mb-4 text-capitalize">{namee}</h2>
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
