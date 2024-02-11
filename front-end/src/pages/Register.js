import React, {useState} from 'react'
import {useNavigate, Link} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQ } from '@fortawesome/free-solid-svg-icons'
import {useGlobalContext} from '../utilities/Context'
import axios from 'axios'
const Register = () => {
  const {showAlert}=useGlobalContext()
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: '',
    name: ''
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
    e.preventDefault();
    if(userInfo.name&&userInfo.email&&userInfo.password){
      const newInfo = {
        ...userInfo,
        myID: new Date().getTime().toString()
      }
      axios.post('http://localhost:5000/register',{newInfo}).then(()=>{
      showAlert({
        msg: 'Registered Successfully !',
        type: 'success'
      })
      navigate('/login')
    }).catch(err=>console.log(err))
    }
    else{
      showAlert({
        msg: 'Fill all requirements...',
        type: 'danger'
      })
    }
    setUserInfo({
      email: '',
      password: '',
      name: ''
    })
  }
  return (
    <div className="container-fluid pt-4">
      <div className="card mb-3" style={{width: '35%', height: 'var(--screen-height)' ,minWidth: '350px', marginInline: 'auto', border: 'none', boxShadow: '0px 2px 1px rgba(0, 0, 0, .2)', borderRadius: '5px', borderTopColor: 'var(--text-color)', borderTopWidth: '5px', borderTopStyle: 'solid',
      }}>
        <form
          className="card-body py-2 px-4">
          <h1 className="text-center my-h1 my-2">
            <span className='logo me-2'
              style={{
                paddingBlock: '.2rem',
              }}
            >
              <FontAwesomeIcon icon={faQ} />
            </span>
            QUIZ</h1>
          <h2 className="text-center mb-3">Register</h2>
          <div className="name mb-2">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              value={userInfo.name}
              onChange={handleChange}
              name="name"
              type="text"
              id="name"
              className="form-control" />
          </div>
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
              className="btn-cstm1">Register</button>
          </div>
          <p className="mt-4 text-center">Already a member? <Link to="/login">Login</Link></p>
        </form>
      </div>
    </div>  )
}

export default Register
