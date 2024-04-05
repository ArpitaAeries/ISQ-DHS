import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const [creds, setCreds] = useState({ username: 'test@companyname.com', password: 'Test@123' });

    const handleSignIn = (e) => {
        e.preventDefault();
        if(creds.username==='test@companyname.com',creds.password==='Test@123'){
            navigate('/home');
        }else{
            alert('Invalid Credentials')
        }
    };

    // const handleSignUp = (e) => {
    //     e.preventDefault();
    //     // Logic for sign up
    //     navigate('/home');
    // };

    return (
        <div id="trial">
 
  


        <svg class="pulse" version="1.2" height="220" width="370" xmlns="http://www.w3.org/2000/svg" viewport="0 0 60 60">
        
        
            <path  stroke="#4dd7ce" fill="none"strokeWidth="1"strokeLinejoin="round"
                  d="
                    M0,90L150,90M150,90Q158,60 162,87T167,95 170,88 173,92t6,35 7,-60T190,127 197,107s2,-11 10,-10 1,1 8,-10T219,95c6,4 8,-6 10,-17s2,10 9,11h110
                    " 
                  /> 
            <path  id="longbeat" style={{ stroke: "#4dd7ce", fill: "none", strokeWidth: 1, strokeLinejoin: "round" }}
                  d="
                    M0,90L150,90M150,90Q158,60 162,87T167,95 170,88 173,92t6,35 7,-60T190,127 197,107s2,-11 10,-10 1,1 8,-10T219,95c6,4 8,-6 10,-17s2,10 9,11h110
                    " 
                  /> 
              <rect x="-3" y="-4" height="8" width="6" rx="20" ry="20"fill="red">
              <animateMotion dur="2s" repeatCount="indefinite">
          <mpath href="#longbeat"/>
        </animateMotion>
            
          </rect>               
        </svg>
           
        

        <div className="heart-rate" style={{ width: '100vw', height: '100vh' }}>
            <svg
                version="1.0"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                width="100%"
                height="100%"
                viewBox="0 0 150 73"
                enableBackground="new 0 0 150 73"
                xmlSpace="preserve"
            >
                <polyline
                    fill="none"
                    stroke="#4dd7ce"
                    strokeWidth=".8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="10"
                    points="0,45.486 38.514,45.486 44.595,33.324 50.676,45.486 57.771,45.486 62.838,55.622 71.959,9 80.067,63.729 84.122,45.486 97.297,45.486 103.379,40.419 110.473,45.486 150,45.486"
                />
            </svg>


  



            <div className="wrapper">
                <div className="form-wrapper sign-in">
                    <form onSubmit={handleSignIn}>
                        <h2>Sign In</h2>
                        <div className="input-group">
                            <input type="text" required value={creds.username} onChange={(e) => setCreds({ ...creds, username: e.target.value })} />
                            <label>Username</label>
                        </div>
                        <div className="input-group">
                            <input type="password" required value={creds.password} onChange={(e) => setCreds({ ...creds, password: e.target.value })} />
                            <label>Password</label>
                        </div>
                        <button type="submit">Sign In</button>
                        {/* <div className="signUp-link">
                            <p>Don't have an account? <a href="#" className="SignUpBtn-link">Sign Up</a></p>
                        </div> */}
                    </form>
                </div>

                {/* <div className="form-wrapper sign-up">
                    <form onSubmit={handleSignUp}>
                        <h2>Sign Up</h2>
                        <div className="input-group">
                            <input type="text" required />
                            <label>Username</label>
                        </div>
                        <div className="input-group">
                            <input type="email" required />
                            <label>Email</label>
                        </div>
                        <div className="input-group">
                            <input type="password" required />
                            <label>Password</label>
                        </div>
                        <div className="remember">
                            <label><input type="checkbox" /> I agree to the terms & conditions.</label>
                        </div>
                        <button type="submit">Sign Up</button>
                        <div className="signUp-link">
                            <p>Already have an account? <a className="SignInBtn-link">Sign In</a></p>
                        </div>
                    </form>
                </div> */}
            </div>
        </div>
        </div>
    );
};

export default Login;
