import React, { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQ } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { useGlobalContext } from '../utilities/Context'
const Login = () => {
  const { showAlert,updateUserLogin } = useGlobalContext()
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
      axios.post(`http://localhost:5000/login`, { userInfo }).then(({data}) => {
        updateUserLogin(data)
        showAlert({
          msg: 'Logged In !',
          type: 'success'
        })
        navigate('/allquizes')
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
    <div className="container-fluid pt-4">
      <div className="card" style={{
        width: '35%',
        height: 'var(--screen-height)', minWidth: '350px', marginInline: 'auto', border: 'none', boxShadow: '0px 2px 1px rgba(0, 0, 0, .2)', borderRadius: '5px', borderTopColor: 'var(--text-color)', borderTopWidth: '5px', borderTopStyle: 'solid',
      }}>
        <form
          className="card-body p-4">
          <h1 className="text-center my-h1 my-3">
            <span className='logo me-2'
              style={{
                paddingBlock: '.2rem',
              }}
            >
              <FontAwesomeIcon icon={faQ} />
            </span>
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
          <div className="password mb-4">
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
    </div>)
}

export default Login
