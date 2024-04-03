import React from 'react'

const Login = () => {

  
  return (
    
        <div className="heart-rate" style={{ width: '100vw', height: '100vh' }}>



          <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink" // Corrected xmlns:xlink to xmlnsXlink
            x="0px"
            y="0px"
            width="100%"
            height="100%"
            viewBox="0 0 150 73"
            enableBackground="new 0 0 150 73"
            xmlSpace="preserve" // Corrected xml:space to xmlSpace
          >
            <polyline
              fill="none"
              stroke="#4dd7ce"
              strokeWidth=".8" // Changed stroke-width to strokeWidth
              strokeLinecap="round" // Added strokeLinecap for better rendering
              strokeLinejoin="round" // Added strokeLinejoin for better rendering
              strokeMiterlimit="10"
              points="0,45.486 38.514,45.486 44.595,33.324 50.676,45.486 57.771,45.486 62.838,55.622 71.959,9 80.067,63.729 84.122,45.486 97.297,45.486 103.379,40.419 110.473,45.486 150,45.486"
            />
          </svg>
          {/* <div class="fade-in"></div>
  <div class="fade-out"></div> */}

<div class="wrapper">
        <div class="form-wrapper sign-in">
            <form action="">
                <h2>Sign In</h2>
                <div class="input-group">
                    <input type="text" required />
                    <label for="">Username</label>
                </div>
                <div class="input-group">
                    <input type="password" required />
                    <label for="">Password</label>
                </div>
                {/* <div class="remember">
                    <label><input type="checkbox" /> Remember me</label>
                </div> */}
                <button type="submit">Sign In</button>
                <div class="signUp-link">
                    <p>Don't have an acoount? <a href="#" class="SignUpBtn-link">Sign Up</a></p>
                </div>
                
            </form>
        </div>

        <div class="form-wrapper sign-up">
            <form action="">
                <h2>Sign Up</h2>
                <div class="input-group">
                    <input type="text" required />
                    <label for="">Username</label>
                </div>
                <div class="input-group">
                    <input type="email" required />
                    <label for="">Email</label>
                </div>
                <div class="input-group">
                    <input type="password" required />
                    <label for="">Password</label>
                </div>
                <div class="remember">
                    <label><input type="checkbox" /> I agree to the terms & conditions.</label>
                </div>
                <button type="submit">Sign Up</button>
                <div class="signUp-link">
                    <p>Aldready have an acoount? <a href="#" class="SignInBtn-link">Sign In</a></p>
                </div>
            </form>
        </div>
    </div>






        </div>
      );
      
  
}

export default Login