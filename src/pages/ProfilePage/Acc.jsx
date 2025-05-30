import { useState, useEffect } from 'react'
import useLocalStorage from '../../hook/useLocalStorage'

import Menu from '../../assets/menu2.png'
import Pp from '../../assets/pp.png'
import Shape from '../../assets/Ellipse 13.png'
import Star from '../../assets/star.png'
import Show from '../../assets/eye.svg'

function Acc() {
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
        const url = "http://localhost:8080/movies"
        fetch(url, {
            method: "GET",
          })
            .then((res) => res.json())
            .then((data) => console.log(data))
            .catch((err) => console.error("CORS error:", err));
        }, [])

    const showPassword = () => {
        setShowPass((showPass) => !showPass)
      }

    const buttonClicked = (e) => {
        e.preventDefault()
        setIsClicked(true)
        setIsModalOpen(true)
    }

  return (
    <section className='md:w-1/4 rounded-[24px] bg-[#fff] mx-[10vw] md:mx-0 my-[5vh] md:my-0'>
        <div className='py-[7vh] px-[10vw] md:px-[3vw] border-b border-solid border-[#DEDEDE]'>
            <div className='flex flex-row justify-between'>
                <p className='text-[#4E4B66]'>INFO</p>
                <img src={Menu} alt=""/>
            </div>
            <div className='rounded-full w-[15vh] h-[15vh] my-[5vh] mx-[25vw] md:mx-[5vw] shadow-md'><img className='object-cover w-[15vh] h-[15vh] rounded-full' src={Pp} alt="Profile Picture"/></div>
            <div>
                <p className='text-center font-normal text-xl'>Jonas El Rodriguez</p>
                <p className='text-center text-sm my-[1vh]'>Moviegoers</p>
            </div>
        </div>
        <div className='pt-[7vh] px-[10vw] md:px-[3vw]'>
            <p className='text-[#4E4B66] font-semibold'>Loyalty Points</p>
            <div className='relative py-[5vh] rounded-2xl bg-[transparent]'>
                <img className='absolute top-0 -right-1/20' src={Shape} alt=""/>
                <img className='absolute top-1/10 -right-1/10' src={Shape} alt=""/>
                <div className='bg-[#1D4ED8] rounded-2xl shadow-lg py-[4vh] px-[3vw] md:px-[1vw]'>
                    <p className='font-semibold text-lg text-[#fff] mb-[5vh]'>Moviegoers</p>
                    <img className='absolute top-3/20 right-0' src={Star} alt=""/>
                    <p className='font-normal text-xl text-[#fff]'>320 <span className='text-xs'>points</span></p>
                </div>
            </div>
            <div className='text-sm text-[#4E4B66] text-center'>
                <p>180 points become a master</p>
                <div className='inner-shadow bg-[#F5F6F8] rounded-lg h-[2vh] my-[2vh]'><div className='bg-[#1D4ED8] h-[2vh] w-1/2 rounded-lg'></div></div>
            </div>
            <button onClick={buttonClicked} className='md:hidden custom-bottom bg-[#1D4ED8] rounded-xl my-[7vh] py-[1vh] w-full text-[#fff]'>Edit Profile</button>
        </div>
        {isModalOpen && (
            <div className='block md:hidden inset-0 bg-[#00000099] flex justify-center items-center z-3'>
                <section className='md:hidden bg-[#fff] rounded-md absolute top-1/2 left-1/2 py-[5vh] px-[5vw] md:px-[3vw] transform -translate-x-1/2 -translate-y-1/2 z-4 w-4/5'>
                    <div className='mt-[7vh] py-[7vh] px-[5vw]'>
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
                    </div>
                    <div className='pb-[7vh] px-[5vw]'>
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
                    </div>
                    <button className='custom-button bg-[#1D4ED8] rounded-xl my-[7vh] md:mt-[7vh] py-[2vh] w-full md:w-1/2 text-[#fff]'>Update changes</button>
                </section>
            </div>
        )}
    </section>
  )
}

export default Acc
