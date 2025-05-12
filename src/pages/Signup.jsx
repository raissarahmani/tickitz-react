import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
// import { useDispatch } from 'react-redux'
// import { register } from '../redux/slices/authSlice'
import { VITE_API_URL } from '../api/movieList'
import Steps from './Auth/Steps'
import Or from './Auth/Or'
import Socmed from './Auth/Socmed'

import Show from '../assets/eye.svg'
import check from '../assets/check.svg'

function Signup() {
  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")
  const [emailMsg, setEmailMsg] = useState("Fill email")
  const [passMsg, setPassMsg] = useState("Fill password")
  const [emailIsVisible, setEmailIsVisible] = useState(false)
  const [passIsVisible, setPassIsVisible] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [checkboxMsg, setCheckboxMsg] = useState("Required")
  const [checkedIsVisible, setCheckedIsVisible] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate()
  // const dispatch = useDispatch()
  
  const handleRegister = (e) => {
    e.preventDefault()

    setEmailIsVisible(false)
    setPassIsVisible(false)
    setCheckedIsVisible(false)
  
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
    } else if (pass.length < 8) {
      setPassIsVisible(true)
      setPassMsg("Password should at least has 8 characters")
    } else {
      setPassIsVisible(false)
    }
  
    let alphabetPass = pass.toLowerCase() !== pass.toUpperCase()
    let numPass = false
    for (let num of pass) {
      if (!isNaN(num)) {
          numPass = true
      }
    }
    if (pass.length >= 8) {
      if (!alphabetPass || !numPass) {
        setPassIsVisible(true)
        setPassMsg("Password should contain letters and numbers")
        return
      }
    }

    if (!isChecked) {
      setCheckedIsVisible(true)
      setCheckboxMsg("Required")
      return
    }
  
    fetch(`${VITE_API_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password: pass })
    })
    .then(async (res) => {
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.msg || 'Failed to register')
      }
      setIsModalOpen(true)
    })
    .catch((err) => {
      console.error(err)
      alert(err.message)
    })

  }

  const showPassword = () => {
    setShowPass((showPass) => !showPass)
  }

  return (
    <div>
      <Steps />
      <form onSubmit={handleRegister} className='relative mt-[3vh] mb-[1vh] px-[3vw] pt-[3vh] pb-[1vh] font-normal text-[#4E4B66]'>
          <label for="email">Email</label> <br/>
          <input onChange={(e) => setEmail(e.target.value)} className='form-input border-[#DEDEDE]' type="email" name="email" value={email} placeholder="Enter your email"/> <br/>
          <p className={`validation-msg ${emailIsVisible && emailMsg ? "visible" : "invisible"}`}>{emailMsg}</p>
          <label for="password">Password</label> <br/>
          <div className='flex rounded-sm mt-[2vh] pr-[1vw] border border-solid border-[#DEDEDE]'>
              <input onChange={(e) => setPass(e.target.value)} className='form-input border-none outline-none m-[0]' type={showPass ? "text" : "password"} name="password" value={pass} placeholder="Enter your password"/> <br/>
              <img onClick={showPassword} className='cursor-pointer' src={Show} alt="Show Password"/>
          </div>
          <p className={`validation-msg ${passIsVisible && passMsg ? "visible" : "invisible"}`}>{passMsg}</p>
          <input onChange={(e) => setIsChecked(e.target.checked)}  className='w-1/20 mt-[3vh]' type="checkbox" name="tnc" id="tnc"/>
          <label for="tnc">I agree to terms and conditions</label>
          <p className={`validation-msg ${checkedIsVisible && checkboxMsg ? "visible" : "invisible"}`}>{checkboxMsg}</p>
          <button className='custom-button bg-[#1D4ED8] text-[#fff] font-normal text-sm my-[3vh] py-[2vh] w-full' type="submit"> Join For Free Now </button>
      </form>
      <div className='text-center text-sm mb-[5vh]'>
          <p>Already have an account? <Link to='/auth'>Log In</Link></p>
      </div>
      <Or />
      <Socmed />
      {isModalOpen && (
        <div className='fixed inset-0 bg-[#00000099] flex justify-center items-center z-3'>
            <section className='bg-[#fff] rounded-md absolute top-1/2 left-1/2 py-[5vh] px-[10vw] md:px-[3vw] transform -translate-x-1/2 -translate-y-1/2 z-4'>
                <p className='text-center font-bold text-2xl'>Register Success</p>
                <div className="flex items-center justify-center my-[3vh]">
                <img src={check} alt="" className="w-1/2 h-1/2"/>
                </div>
                <button onClick={() => navigate("/auth")} className='custom-button text-[#1D4ED8] bg-[#fff] w-full py-[2vh] font-semibold text-sm'>Login</button>
            </section>
        </div>
        )}
    </div>
  )
}

export default Signup
