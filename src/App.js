import './App.css';
import initializeAutoraization from './Firebase/firebase.init';
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, RecaptchaVerifier } from "firebase/auth";
import { useState } from 'react';

initializeAutoraization()
const googleProvider = new GoogleAuthProvider();

function App() {
  const auth = getAuth();
  
  //google sign in popup handeler 
  const googleAuthHandelar =() =>{
    signInWithPopup(auth, googleProvider)
    .then(result => console.log(result.user))
    .catch((error) => {
      console.log(error)
    })
  } 


  // user email password sing in
  const [firstName, setfirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // get input field value
  const handelEmailField = e =>{
    setError('')
    setEmail(e.target.value)
  }
  const handelPasswordField = e =>{
    setError('')
    setPassword(e.target.value)
  }
  const handelFirstName = e =>{
    setError('')
    setfirstName(e.target.value)
  }
  const handelLastName = e =>{
    setError('')
    setLastName(e.target.value)
  }

  // error handeler 
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('')

  // handel submit button
  const handelSubmitButton = e =>{
    e.preventDefault();
    if(!userType){
      if(!firstName){
        setError('Please Enter Your First Name');
        return;
      }
      if(!lastName){
        setError('Please Enter Your Last Name');
        return;
      }
    }
    if(!email){
      setError('Please Enter Your Email Address');
      return;
    }
    if(!/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email)){
      setError('Please Enter Valid Email Address');
      return;
    }
    if(!password){
      setError('Please Enter Your Password');
      return;
    }
    if(!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(password)){
      setError('Please Enter A Valid Password');
      return;
    }
    !userType ? newUser(email, password, (firstName + ' ' + lastName)) :
    existingUser(email, password)
  }

  // sign up a user
  const newUser = (email, password, fullName) =>{
    
    createUserWithEmailAndPassword(auth, email, password)
    .then(result => {
      setError('');
      setuserDisplayName(fullName)
      verifyUserByEmail()
      setSuccess('Your Registration Sucessfully Complted Please Check Your Email');
      console.log(result.user)

    })
    .catch((err) => {
      (err.message === 'Firebase: Error (auth/email-already-in-use).') && setError('Email Already Used');
      
    })
  }
  const setuserDisplayName = name =>{
    updateProfile(auth.currentUser, {
      displayName: name})
      .then(() => {
    })
    .catch((error) => {
      setError(error)
    });
  }
  const verifyUserByEmail = () =>{
    sendEmailVerification(auth.currentUser)
    .then(() => {
      // Email verification sent!
    });
  }

  // existing user 
  const existingUser = (email, password) =>{
    signInWithEmailAndPassword(auth, email, password)
    .then(result=>{
      setSuccess('Successfully Loged In')
      console.log(result.user)
    }
    )
    .catch((error) => {
      error.message === 'Firebase: Error (auth/wrong-password).' ? 
        setError('Please Type Correct Password')
       :
      setError(error.message)
    });
  }
  // password reset handelar
  const passwordResetHandelar = () =>{
    sendPasswordResetEmail(auth, email)
    .then(() => {
      // Password reset email sent!
      setSuccess('Please Check Your mail')
    })
    .catch((error) => {
      setError(error.message)
      (error.message === 'Firebase: Error (auth/email-already-in-use).') && setError('Email Already Used');
    });
  }

  // check user type 
  const [userType, SetUserType] = useState(false);
  const checkUserTypeHandeler = e =>{
    SetUserType(e.target.checked)
    setError('')
    setSuccess('')
  }


  // // handel verify number 
  // const [number, setNumber] = useState(0)
  // const handelVerifyNumber = e =>{
  //   e.preventDefault()
  //   if(!number.length){
  //     setError('Please Enter Your Number');
  //     return;
  //   }
  //   if(number.length < 11){
  //     setError('Please Enter Valid Number');
  //     return;
  //   }
  //   console.log(number)
  //   verifyNumber()
  // }
  // const handelPhoneNumber = e =>{
  //   setError('')
  //   setNumber(e.target.value)
  // }

  // const verifyNumber = () =>{
  //     auth.languageCode = 'it';

  //     window.recaptchaVerifier = new RecaptchaVerifier('sign-in-button', {
  //       'size': 'invisible',
  //       'callback': (response) => {
  //         // reCAPTCHA solved, allow signInWithPhoneNumber.
  //         // onSignInSubmit();
  //       }
  //     }, auth);

  //     window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {}, auth);



  // }

  return (
    <div className='container w-50 mx-auto height_style mt-5'>
      <h2 className='text-center'>{userType ? 'Log In' : 'Sign Up'}</h2>
      <form>
        {
          !userType && 
          <div className='row mt-4 mb-2'>
          <div className="col-6">
            <label htmlFor="validationCustom01" className="form-label">First name</label>
            <input type="text" onBlur={handelFirstName} className="form-control" id="validationCustom01" placeholder='Your First Name' required />
            <div className="valid-feedback">
              Looks good!
            </div>
          </div>
          <div className="col-6">
            <label htmlFor="validationCustom02" className="form-label">Last name</label>
            <input type="text" onBlur={handelLastName} className="form-control" id="validationCustom02" placeholder='Your Last Name' required />
          </div>
        </div>
        }
        <div className="mb-2">
          <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
          <input type="email" onBlur={handelEmailField} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='Enter Your Email' required />
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-2">
          <label htmlFor = "exampleInputPassword1" className="form-label">Password</label>
          <input type="password" onBlur={handelPasswordField} className="form-control" id="exampleInputPassword1" placeholder='Enter Your Password' required />
        </div>

        {/* <div className='mb-2'>
          <label htmlFor="validationCustom03" className="form-label">Your Phone Number (Optional)</label>
          <div className='d-flex align-items-center justify-content-between'>
            <div className="col-9">
                
                <input type="number" onBlur={handelPhoneNumber} className="form-control" id="validationCustom03" placeholder='Your Phone Number' />
            </div>
            <button onClick={handelVerifyNumber} className='btn btn-outline-primary'>Verify Now</button>
          </div>
          
        </div> */}
        


        <div>
          <div className="mb-2 form-check">
            <div className='user_type_and_reset_field'>
              <div>
                <input type="checkbox" onClick={checkUserTypeHandeler} className="form-check-input" id="exampleCheck1" />
                <label className="form-check-label" htmlFor = "exampleCheck1">Existing user</label>
              </div>
            
              {
                userType &&
                <button type="button" onClick={passwordResetHandelar} className="btn btn-outline-primary btn-sm">Reset Password</button>
              }
            </div>
          </div>
        </div>
        <p className='text-danger mb-2'>{
          error ? error : <span className='text-success'>{success}</span>
        }</p>
        <div className='btn_container mb-3'>
          <button onClick={handelSubmitButton} type="submit" className="btn btn-primary">{userType ? 'Log In' : 'Submit'}</button>
        </div>
      </form>
      <div className='images_sign_in'>
        <img src="./logo2.png" />
        <img onClick = {googleAuthHandelar} src="./logo1.png" />
        <img src="./logo3.png" />
      </div>
    </div>
  );
}

export default App;
