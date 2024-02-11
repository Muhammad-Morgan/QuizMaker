import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useGlobalContext } from '../utilities/Context'
import axios from 'axios'
const Register = () => {
  const { showAlert } = useGlobalContext()
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: '',
    name: '',
    type: ''
  })
  const navigate = useNavigate()
  const handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    console.log(name,value)
    setUserInfo({
      ...userInfo,
      [name]: value
    })
  }
  const handleClick = (e) => {
    e.preventDefault();
    if (userInfo.name && userInfo.email && userInfo.password&&userInfo.type) {
      const newInfo = {
        ...userInfo,
        myID: new Date().getTime().toString()
      }
      axios.post('http://localhost:5000/register', { newInfo }).then(({data}) => {
      const {token,msg,type}=data
      if(type === 'success'){
        localStorage.setItem('localToken', token)
        showAlert({msg,type})
        if(userInfo.type === 'instructor'){
          navigate('/createquiz')
        }else{
          navigate('/allquizes')
        }
      }
      }).catch(err => console.log(err))
    }
    else {
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
    <div className="container-fluid px-3 align-items-center">
      <div className='row row-cols-1 row-cols-md-2'>
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
        <div className='col'>
          <div className="card">
            <form
              className="card-body py-2 px-4">
              <h1 className="text-center text-primary-emphasis fw-lighter my-h1 my-2">
                QUIZ</h1>
              <h2 className="text-center mb-2">Register</h2>
              <div className="name mb-2">
                <label htmlFor="name" className="form-label mb-0">Name</label>
                <input
                  value={userInfo.name}
                  onChange={handleChange}
                  name="name"
                  type="text"
                  id="name"
                  className="form-control" />
              </div>
              <div className="email mb-2">
                <label htmlFor="email" className="form-label mb-0">Email</label>
                <input
                  value={userInfo.email}
                  onChange={handleChange}
                  name="email"
                  type="text"
                  id="email"
                  className="form-control" />
              </div>
              <div className="password mb-2">
                <label htmlFor="password" className="form-label mb-0">Password</label>
                <input
                  value={userInfo.password}
                  onChange={handleChange}
                  name="password"
                  type="password"
                  id="password"
                  className="form-control" />
              </div>
              <div className="type mb-4">
                <label style={{ fontSize: '.8rem' }} htmlFor="text" className="text-primary-emphasis

form-label mb-0 ">Tell us what would you like to do</label>
                <select
                name='type'
                value={userInfo.type}
                onChange={handleChange}
                className="form-select">
                  <option value=''>choose</option>
                  <option value="instructor">Creating quiz</option>
                  <option value="student">Taking quiz</option>
                </select>
              </div>
              <div className="d-grid gap-2">
                <button
                  onClick={handleClick}
                  className="btn-cstm1">Register</button>
              </div>
              <p className="mt-4 text-center">Already a member? <Link to="/login">Login</Link></p>
            </form>
          </div>
        </div>
      </div>
    </div>)
}

export default Register
