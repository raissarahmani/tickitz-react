import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { VITE_API_URL } from "../api/movieList";

import { login } from "../redux/slices/authSlice";
import Or from './Auth/Or'
import Socmed from './Auth/Socmed'

import Show from '../assets/eye.svg'

function Signin() {
const [email, setEmail] = useState("")
const [pass, setPass] = useState("")
const [emailMsg, setEmailMsg] = useState("Fill email")
const [passMsg, setPassMsg] = useState("Fill password")
const [emailIsVisible, setEmailIsVisible] = useState(false)
const [passIsVisible, setPassIsVisible] = useState(false)
const [showPass, setShowPass] = useState(false)

const user = useSelector((state) => state.user.user)
const authError = useSelector((state) => state.user.error)
const navigate = useNavigate()
const dispatch = useDispatch()

const loginValid = (e) => {
  e.preventDefault()

  setEmailMsg("")
  setPassMsg("");
  setEmailIsVisible(false)
  setPassIsVisible(false)

  if (!email) {
    setEmailIsVisible(true)
    setEmailMsg("Data should be filled")
  } else if (!email.includes('@')) {
    setEmailIsVisible(true)
    setEmailMsg ("Email not valid")
  } else {
    setEmailIsVisible(false)
  }
  
  if (!pass) {
    setPassIsVisible(true)
    setPassMsg("Data should be filled")
    return
  } else if (pass.length < 8) {
    setPassIsVisible(true)
    setPassMsg("Password should at least has 8 characters")
    return
  } setPassIsVisible(false)

  let alphabetPass = pass.toLowerCase() !== pass.toUpperCase()
  let numPass = false
  for (let num of pass) {
    if (!isNaN(num)) {
        numPass = true
    }
  }
  if (!alphabetPass || !numPass) {
    setPassIsVisible(true)
    setPassMsg("Password should contain letters and numbers")
    return
  } else {
    setPassIsVisible(false)
  }

  fetch(`${VITE_API_URL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password: pass })
  })
  .then(async (res) => {
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.msg || 'Failed to login')
    }

    const token = data.token
    dispatch(login({
      token,
      user: { email }
    }))
  })
  .catch((err) => {
    console.error(err)
    alert(err.message)
  })
}

useEffect (() => {
  if (user) {
    navigate(user.role === "admin" ? "/admin" : "/")
  } 
}, [user, navigate])


const showPassword = () => {
  setShowPass((showPass) => !showPass)
}

  return (
    <div>
        <div className='mt-[5vh] mb-[1vh] mx-[2vw]'>
            <div className='font-semibold text-2xl md:text-3xl my-[1vh] mx-[1vw]'>Welcome Back👋</div>
            <p className='md:text-lg text-[#A0A3BD] mt-[5vh] mb-[1vh] mx-[1vw]'>Sign in with your data that you entered during your registration</p>
        </div>
        <form onSubmit={loginValid}  className='relative mt-[3vh] mb-[1vh] px-[3vw] pt-[3vh] pb-[1vh] font-normal text-[#4E4B66]'>
            <label for="email">Email</label> <br/>
            <input onChange={(e) => setEmail(e.target.value)} className='form-input border-[#DEDEDE]' type="email" name="email" value={email} placeholder="Enter your email"/> <br/>
            <p className={`validation-msg ${emailIsVisible ? "visible" : "invisible"}`}>{emailMsg}</p>
            <label for="password">Password</label> <br/>
            <div className='flex rounded-sm pr-[1vw] mt-[2vh] border border-solid border-[#DEDEDE]'>
                <input onChange={(e) => setPass(e.target.value)} className='form-input border-none outline-none m-[0]' type={showPass ? "text" : "password"} name="password" value={pass} placeholder="Enter your password"/> <br/><br/>
                <img onClick={showPassword} className='cursor-pointer' src={Show} alt="Show Password"/>
            </div>
            <p className={`validation-msg ${passIsVisible ? "visible" : "invisible"}`}>{passMsg}</p>
            {authError && <p className="validation-msg">{authError}</p>}
            <p className='hidden md:flex flex-row justify-between text-sm'>
              <Link to='/auth/register'>Do not have account? Register now</Link>
              <a href="" className="text-right">Forgot your password?</a>
            </p>
            <button className='custom-button bg-[#1D4ED8] text-[#fff] font-normal text-sm my-[3vh] py-[2vh] w-full' type="submit"> Login </button>
        </form> 
        <Or />
        <Socmed />
    </div>
  )
}

export default Signin
