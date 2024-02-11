import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../utilities/Context'
import Loading from '../components/Loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'

const Results = () => {
  const { loading, startLoading, endLoading, showAlert } = useGlobalContext()
  const navigate = useNavigate()
  const { id } = useParams()
  const [userResult, setUserResult] = useState({
    finalResult: 0,
    mistakes: [],
    name: '',
    quizName: ''
  })
  const getUserResult = async () => {
    startLoading()
    axios.get(`http://localhost:5000/getuserresult/${id}`).then(({ data }) => {
      const { name, quizName, finalResult, mistakes } = data
      setUserResult({
        ...userResult,
        finalResult,
        mistakes,
        name,
        quizName
      })
    }).catch(err => console.log(err))
    endLoading()
  }
  useEffect(() => { getUserResult() }, [])
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
        <h2 className='mb-4'>Hi {userResult.name}</h2>
        <h5 className="mb-4">Thank you for submitting !</h5>
        <hr className='my-4'></hr>
        <div className="row mb-4">
          <div className="col">
            <h4>Your {userResult.quizName} final result</h4>
          </div>
          <div className="col">
            <div class="d-flex">
              <h3
                style={{ color: 'var(--primary-color-2)',
              backgroundColor: 'var(--primary-color-3)',
              width: 'fit-content',
              padding: '.2rem .4rem',
              borderRadius: '5px',
              boxShadow: '0px 1px 0px rgba(0, 0, 0, .2)'
              }}
              >{userResult.finalResult}</h3> <h3 className='mx-2'
              style={{ color: 'var(--texr-color)',
              width: 'fit-content',
              fontSize: '2rem'
              }}
              >/</h3>
              <h3
                style={{ color: 'var(--alert-check-success)',
              backgroundColor: 'var(--alert-success)',
              width: 'fit-content',
              padding: '.2rem .4rem',
              borderRadius: '5px',
              boxShadow: '0px 1px 0px rgba(0, 0, 0, .2)'
              }}
              >50</h3>
            </div>
          </div>
        </div>
        <div className="row mb-4">
          <div className="col">
            <h4>What wasn't correct</h4>
          </div>
          <div className="col">
            {userResult.mistakes.map((ans) => {
              const { _id, question, answer } = ans
              return (
                <div key={_id} className='d-flex gap-2'>
                  <h5>{question}</h5>
                  <h6
                    style={{ color: 'var(--primary-color-2)' }}
                    className='mb-2'>
                    <FontAwesomeIcon style={{ color: 'var(--alert-check-danger)' }} icon={faXmark} className='me-2' />
                    {JSON.stringify(answer)}</h6>
                </div>
              )
            })}
          </div>
        </div>
        <div className="mb-4">
          <Link
          to={`/allquizes`} className="my-new-btn-other-quiz">Take another Quiz ?
          </Link>
        </div>
      </div>
    </div>)
}

export default Results
