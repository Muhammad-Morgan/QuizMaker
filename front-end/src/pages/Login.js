import React, { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import { useGlobalContext } from '../utilities/Context'
const Login = () => {
  const { showAlert, updateUserLogin } = useGlobalContext()
  const [userInfo, setUserInfo] = React.useState({
    email: '',
    password: ''
  })
  const navigate = useNavigate()
  const handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    setUserInfo({
      ...userInfo,
      [name]: value
    })
  }
  const handleClick = (e) => {
    e.preventDefault()
    if (userInfo.email && userInfo.password) {
      axios.post(`http://localhost:5000/login`, { userInfo }).then(({ data }) => {
        const { type } = data
        if (type === 'danger') {
          const { msg } = data
          showAlert({ msg, type })
        } else {
          const { token, msg } = data
          showAlert({ msg, type })
          localStorage.setItem('localToken', token)
          const myData = jwtDecode(token)
          if (myData.type === 'instructor') {
            navigate('/createquiz')
          } else {
            navigate('/allquizes')
          }
        }
      }).catch((err) => console.log(err))
    } else {
      showAlert({
        msg: 'Fill all requirements...',
        type: 'danger'
      })
    }
    setUserInfo({
      email: '',
      password: ''
    })
  }
  return (
    <div className="container-fluid px-3">
      <div className='row row-cols-1 row-cols-md-2 align-items-center'>
        <div className='col'>
          <div
            style={{
              height: '50%',
              marginBlock: 'auto'
            }}
            className='col d-none d-md-flex flex-column justify-content-between'>
            <h2 className='text-primary-emphasis fw-light lh-lg'>Create and edit your quizez, and make your students test their knowledge</h2>
            <p className='text-secondary-emphasis fs-4 lh-base'>A quiz is nothing but a way to measure to what extent you are aware of some piece of knowledge....</p>
            <p className='text-secondary-emphasis fs-5 lh-base'>Matter fact it's the best way to become an expert in a specific field</p>
          </div>
        </div>
        <div className='col'>
          <div className="card" >
            <form
              className="card-body">
              <h1 className="text-center text-primary-emphasis fw-lighter my-h1 my-3">
                QUIZ</h1>
              <h2 className="text-center mb-4">Login</h2>
              <div className="email mb-4">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  value={userInfo.email}
                  onChange={handleChange}
                  name="email"
                  type="text"
                  id="email"
                  className="form-control" />
              </div>
              <div className="password mb-5">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  value={userInfo.password}
                  onChange={handleChange}
                  name="password"
                  type="password"
                  id="password"
                  className="form-control" />
              </div>
              <div className="d-grid gap-2">
                <button
                  onClick={handleClick}
                  className="btn-cstm1">Log In</button>
              </div>
              <p className="mt-4 text-center">Not a member? <Link to="/register">Register</Link></p>
            </form>
          </div>

        </div>
      </div>
    </div>)
}

export default Login
