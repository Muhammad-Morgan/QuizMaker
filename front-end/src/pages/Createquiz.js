import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faListCheck } from '@fortawesome/free-solid-svg-icons'
import { useGlobalContext } from '../utilities/Context'
import { useNavigate } from 'react-router-dom'
import Loading from '../components/Loading'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
const Createquiz = () => {
    const { showAlert, loading, updateInfo, userDetails } = useGlobalContext()
    const navigate = useNavigate()
    const [submitCon, setSubmitCon] = useState(false)
    const [name, setName] = useState('')
    const [questions, setQuestions] = useState({
        question: '',
        answer: ''
    })
    const [quiz, setQuiz] = useState([])
    const handleChange = (e) => {
        const name = e.target.name
        const value = e.target.value
        setQuestions({
            ...questions,
            [name]: value
        })
    }
    const handleSave = (e) => {
        e.preventDefault()
        if (questions.question && questions.answer) {
            if (quiz.length < 5) {
                if (quiz.length === 4) {
                    setSubmitCon(true)
                }
                setQuiz([
                    ...quiz,
                    questions
                ])
            }
            else {
                showAlert({
                    msg: 'Only 5 questions are allowed',
                    type: 'info'
                })
            }
        } else {
            showAlert({
                msg: 'Fill all requirements',
                type: 'info'
            })
        }
        setQuestions({
            question: '',
            answer: ''
        })
    }
    const handleDelete = (e) => {
        e.preventDefault()
        setQuestions({
            question: '',
            answer: ''
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        var localToken = localStorage.getItem('localToken')
        const decodedToken = jwtDecode(localToken)
        if (name) {
            var lName = name.toLowerCase()
            axios.post(`https://quiz-maker-server.vercel.app/quizcreated/${decodedToken.myID}`, { name: lName, quiz }).then(({data}) => {
                const {msg,type}=data
                showAlert({
                    msg,
                    type
                })
            }).catch(err => console.log(err))
        }
        else {
            showAlert({
                msg: 'Do not forget to make a name for it...',
                type: 'info'
            })
        }
        setName('')
        setQuiz([])
        setQuestions({
            question: '',
            answer: false
        })
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
        if (userDetails.type === 'student') {
            navigate('/allquizes')
        }
    }, [userDetails.type])
    if (loading) {
        return <Loading />
    }
    return (
        <div className="card shadow" style={{
            backgroundColor: '#fff',
            width: '90%',
            paddingBlock: '1.5rem',
            paddingInline: '2rem',
            marginInline: 'auto',
            maxWidth: '1150px',
            border: 'none',
            boxShadow: '1px 1px 2px 1px rgba(0,0,0,.1)',
        }}>
            <div className="card-body"

            >
                <h2 className="card-title mb-4 text-center">Create a Quiz !</h2>
                <form style={{
                    height: 'auto !important'
                }}>
                    <div className='row row-cols-2 mb-md-5'>
                        <div className='col mb-3 mb-md-0'>
                            <div>
                                <label htmlFor='name'>Name</label>
                                <input
                                    onChange={(e) => {
                                        setName(e.target.value)
                                    }}
                                    value={name}
                                    class="form-control"
                                    type="text"
                                    name='name'
                                    id='name'
                                />
                                <p className='fw-lighter text-secondary mb-0 mt-3 fs-5'>After each question click Save !</p>
                            </div>

                        </div>
                        <div className='col d-flex flex-column justify-content-between'>
                            <div className='d-flex mb-2 align-items-start justify-content-start'>
                                <div
                                    style={{ backgroundColor: 'var(--pending)' }}
                                    className="listCheck">
                                    <FontAwesomeIcon className='px-1 fa-lg' icon={faListCheck} />
                                </div>
                                <h5
                                    style={{
                                        color: 'rgb(57,78,106)',
                                    }}
                                    className='ms-3 mb-0 fw-light'>Write the name of your Quiz
                                </h5>
                            </div>
                            <div className='d-flex mb-2 align-items-start justify-content-start'>
                                <div
                                    style={{ backgroundColor: 'var(--pending)' }}
                                    className="listCheck">
                                    <FontAwesomeIcon className='px-1 fa-lg' icon={faListCheck} />
                                </div>
                                <h5
                                    style={{
                                        color: 'rgb(57,78,106)',
                                    }}
                                    className='ms-3 mb-0 fw-light'>Type the question and the right answer
                                </h5>
                            </div>
                            <div className='d-flex align-items-start justify-content-start'>
                                <div
                                    style={{ backgroundColor: 'var(--pending)' }}
                                    className="listCheck">
                                    <FontAwesomeIcon className='px-1 fa-lg' icon={faListCheck} />
                                </div>
                                <h5
                                    style={{
                                        color: 'rgb(57,78,106)',
                                    }}
                                    className='ms-3 mb-0 fw-light'>After finishing all the questions... Submit
                                </h5>
                            </div>
                        </div>
                    </div>
                    <div className='row row-cols-1 row-cols-md-3 mb-md-4'>
                        <div className='col mb-3 mb-md-0'>
                            <div>
                                <label htmlFor='question'>Question</label>
                                <input
                                    type='text'
                                    id='question'
                                    onChange={handleChange}
                                    value={questions.question}
                                    name='question'
                                    className="form-control">
                                </input>
                            </div>

                        </div>
                        <div className='col mb-3 mb-md-0'>
                            <div>
                                <label htmlFor='answer'>Answer</label>
                                <select
                                    onChange={handleChange}
                                    value={questions.answer}
                                    style={{ cursor: 'pointer' }}
                                    name='answer'
                                    className="form-select" aria-label="Default select example">
                                    <option value="">Answer</option>
                                    <option value="true">True</option>
                                    <option value="false">False</option>
                                </select>
                            </div>

                        </div>
                        <div
                            className="col small-win d-flex align-items-end gap-3">
                            <button
                                onClick={handleSave}
                                style={{
                                    backgroundColor: 'rgb(209,231,221)',
                                    color: 'var(--alert-check-success)',
                                    border: 'none',
                                    textDecoration: 'none',
                                    width: '100%',
                                    height: '60%'
                                }}
                                className="my-newBtns rounded shadow-sm">Save</button>
                            <button
                                onClick={handleDelete}
                                style={{
                                    backgroundColor: 'var(--declined-2)',
                                    color: 'var(--alert-check-danger)',
                                    border: 'none',
                                    textDecoration: 'none',
                                    width: '100%',
                                    height: '60%'
                                }}
                                className="my-newBtns rounded shadow-sm">Clear</button>
                        </div>
                    </div>
                    {submitCon && < div className='row mt-5 row-cols-1'
                    >
                        <div className="d-flex justify-content-start align-items-end gap-3">
                            <button
                                style={{ width: '50%', marginInline: 'auto' }}
                                onClick={handleSubmit}
                                className="my-new-btn-submit">Submit your Quiz !</button>
                        </div>
                    </div>
                    }
                </form>
            </div >
        </div >)
}

export default Createquiz
