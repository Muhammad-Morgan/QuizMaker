import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../utilities/Context'
import Loading from '../components/Loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import {jwtDecode} from 'jwt-decode'
const Results = () => {
  const { loading, startLoading, endLoading, showAlert,userDetails,updateInfo } = useGlobalContext()
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
    axios.get(`https://quiz-maker-server.vercel.app/getuserresult?myID=${id}`).then(({ data }) => {
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
useEffect(()=>{
    if(userDetails.type === 'instructor'){
        navigate('/createquiz')
    }
},[userDetails.type])
  useEffect(() => { getUserResult() }, [])
  if (loading) {
    return <Loading />
  }
  return (
    <div className="card shadow mt-5" style={{
      width: '90%',
      paddingBlock: '1.5rem',
      paddingInline: '2rem',
      marginInline: 'auto',
      maxWidth: '1150px',
      border: 'none',
      backgroundColor: '#fff'
    }}>
      <div className="card-body">
        <h2 className='mb-4 text-capitalize text-primary-emphasis fw-normal'>Hi {userResult.name}</h2>
        <h5 className="mb-4 fw-normal text-secondary-emphasis">Thank you for submitting !</h5>
        <hr className='my-4'></hr>
        <div className="row mb-4">
          <div className="col">
            <h4 className='text-primary-emphasis fw-light'>Your <span className="text-body text-capitalize fw-normal">{userResult.quizName}</span> final result</h4>
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
              >{userResult.finalResult *10}</h3> <h3 className='mx-2'
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
            <h4 className='fw-normal'>What wasn't correct</h4>
          </div>
          <div className="col">
            {userResult.mistakes.map((ans,index) => {
              return (
                <div key={index} className='d-flex align-items-end gap-2'>
                  <h5 className='text-capitalize fw-normal fs-4'>{ans}</h5>
                  <h6
                    style={{ color: 'var(--primary-color-2)' }}
                    className='mb-2'>
                    <FontAwesomeIcon style={{ color: 'var(--alert-check-danger)' }} icon={faXmark} className='me-2 fs-4' />
                    </h6>
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
