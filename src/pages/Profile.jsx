import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import useLocalStorage from '../hook/useLocalStorage'
import { VITE_API_URL } from '../api/movieList'

import Show from '../assets/eye.svg'
import check from '../assets/check.svg'

function Profile() {
    const token = useSelector(state => state.user.token)

    const [formProfile, setFormProfile] = useLocalStorage("userProfile", {
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        pass: "",
        confirmpass: "",
    })

    const [error, setError] = useState({})
    const [isClicked, setIsClicked] = useState(false)
    const [showPass, setShowPass] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const formHandler = (e) => {
        setFormProfile({...formProfile,[e.target.name] : e.target.value})
    }

    const validateForm = () => {
        let newError = {}
        if(!formProfile.firstname) newError.firstname = "Data should be filled"
        if(!formProfile.lastname) newError.lastname = "Data should be filled"
        if(!formProfile.email) {
            newError.email = "Data should be filled"
        } else if(!formProfile.email.includes('@')) {
            newError.email = "Email not valid"
        }

        if(!formProfile.phone) {
            newError.phone = "Data should be filled"
        } else if (formProfile.phone.length < 8) {
            newError.phone = "Phone number not valid"
        }

        if(!formProfile.pass) {
            newError.pass = "Data should be filled"
        } else if (formProfile.pass.length < 8) {
            newError.pass = "Password should at least have 8 characters"
        }

        let alphabetPass = formProfile.pass.toLowerCase() !== formProfile.pass.toUpperCase()
        let numPass = false
        for (let num of formProfile.pass) {
          if (!isNaN(num)) {
              numPass = true
          }
        }
        if (!alphabetPass || !numPass) newError.pass = "Password should contain letters and numbers"

        if(formProfile.confirmpass !== formProfile.pass) newError.confirmpass = "Password did not match"

        return newError
    }

    useEffect(() => {
        const validateDetails = validateForm()
        setError(validateDetails)
    }, [formProfile])

    useEffect(() => {
        if (token) {
          fetch(`${VITE_API_URL}/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then(res => res.json())
            .then(data => {
              setFormProfile(prev => ({
                ...prev,
                firstname: data.firstname || "",
                lastname: data.lastname || "",
                email: data.email || "",
                phone: data.phone || "",
              }))
            })
            .catch(err => console.error("Failed to fetch profile", err))
        }
      }, [token])

    const buttonClicked = async (e) => {
        e.preventDefault()
        setIsClicked(true)
        const validateDetails = validateForm(formProfile)
        setError(validateDetails)

        if (Object.keys(validateDetails).length === 0) {
            try {
                const res = await fetch(`${VITE_API_URL}/profile/edit`, {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    firstname: formProfile.firstname,
                    lastname: formProfile.lastname,
                    email: formProfile.email,
                    phone: formProfile.phone
                  }),
                })
          
                const data = await res.json()
          
                if (!res.ok) {
                  throw new Error(data.msg || 'Failed to update profile')
                }
          
                setIsModalOpen(true)
            } catch (err) {
                console.error("Profile update failed", err)
                alert(err.message)
            }
        }
    }

    const showPassword = () => {
        setShowPass((showPass) => !showPass)
      }

  return (
    <div className='hidden md:block mx-[10vw] md:mx-0'>
      <section className='bg-[#fff] rounded-b-none md:rounded-b-2xl rounded-2xl mt-[7vh] md:my-[7vh] py-[7vh] px-[5vw] md:px-[2vw]'>
          <p className='font-semibold border-b border-solid border-[#DEDEDE] pb-[3vh]'>Detail Information</p>
          <form className='grid grid-cols-1 md:grid-cols-2 grid-rows-4 md:grid-rows-2 my-[5vh] text-sm text-[#8692A6]'>
              <div>
                  <label for="firstname">First Name</label> 
                  <input onChange={formHandler} className='form-input border-[#E6E6E6] rounded-xl w-full md:w-9/10' type="text" name="firstname" value={formProfile.firstname || ""} placeholder="Jonas"/> 
                  {isClicked && error.firstname && <p className='validation-msg'>{error.firstname}</p>}
              </div>
              <div>
                  <label for="lastname">Last Name</label> 
                  <input onChange={formHandler} className='form-input border-[#E6E6E6] rounded-xl w-full md:w-9/10' type="text" name="lastname" value={formProfile.lastname || ""} placeholder="El Rodriguez"/> 
                  {isClicked && error.lastname && <p className='validation-msg'>{error.lastname}</p>}
              </div>
              <div>
                  <label for="email">Email</label> 
                  <input onChange={formHandler} className='block form-input border-[#E6E6E6] rounded-xl w-full md:w-9/10' type="email" name="email" value={formProfile.email || ""} placeholder="jonasrodrigu123@gmail.com"/> 
                  {isClicked && error.email && <p className='validation-msg'>{error.email}</p>}
              </div>
              <div>
                  <label for="phone">Phone Number</label> 
                  <div className='flex flex-row justify-between rounded-xl w-full md:w-9/10 my-[1vh] px-[1vw] border border-solid border-[#E6E6E6]'>
                      <p className='py-[2vh] pr-[2vw]'>+62</p>
                      <input onChange={formHandler} className='form-input border-none outline-none m-[0] w-9/10' type="text" name="phone" value={formProfile.phone || ""} />
                  </div>
                  {isClicked && error.phone && <p className='validation-msg'>{error.phone}</p>}
              </div>
          </form>
        </section>
        <section className='bg-[#fff] rounded-t-none md:rounded-t-2xl rounded-2xl pb-[7vh] md:py-[7vh] px-[5vw] md:px-[2vw]'>
          <p className='font-semibold border-b border-solid border-[#DEDEDE] pb-[3vh]'>Account and Privacy</p>
          <form className='grid grid-cols-1 md:grid-cols-2 grid-rows-2 md:grid-rows-1 text-sm text-[#8692A6] my-[5vh]'>
              <div>
                  <label for="pass">New Password</label> 
                  <div className='flex flex-row justify-between rounded-xl w-full md:w-9/10 my-[1vh] px-[1vw] border border-solid border-[#E6E6E6]'>
                      <input onChange={formHandler} className='form-input border-none outline-none m-[0]' type={showPass ? "text" : "password"} name="pass" value={formProfile.pass || ""} />
                      <img onClick={showPassword} className='cursor-pointer' src={Show} alt="See Password"/>
                  </div>
                  {isClicked && error.pass && <p className='validation-msg'>{error.pass}</p>}
              </div>
              <div>
                  <label for="confirmpass">Confirm Password</label> 
                  <div className='flex flex-row justify-between rounded-xl w-full md:w-9/10 my-[1vh] px-[1vw] border border-solid border-[#E6E6E6]'>
                      <input onChange={formHandler} className='form-input border-none outline-none m-[0]' type={showPass ? "text" : "password"} name="confirmpass" value={formProfile.confirmpass || ""} />
                      <img onClick={showPassword} className='cursor-pointer' src={Show} alt="See Password"/>
                  </div>
                  {isClicked && error.confirmpass && <p className='validation-msg'>{error.confirmpass}</p>}
              </div>
          </form>
      </section>
      <button onClick={buttonClicked} className='custom-button bg-[#1D4ED8] rounded-xl my-[7vh] md:mt-[7vh] py-[2vh] w-full md:w-1/2 text-[#fff]'>Update changes</button>
      {isModalOpen && (
        <div className='fixed inset-0 bg-[#00000099] flex justify-center items-center z-3'>
            <section className='bg-[#fff] rounded-md absolute top-1/2 left-1/2 py-[5vh] px-[10vw] md:px-[3vw] transform -translate-x-1/2 -translate-y-1/2 z-4'>
                <p className='text-center font-bold text-2xl'>Profile Updated</p>
                <div className="flex items-center justify-center my-[3vh]">
                <img src={check} alt="" className="w-1/2 h-1/2"/>
                </div>
                <button onClick={() => setIsModalOpen(false)} className='custom-button text-[#1D4ED8] bg-[#fff] w-full py-[2vh] font-semibold text-sm'>OK</button>
            </section>
        </div>
        )}
    </div>
  ) 
} 

export default Profile
