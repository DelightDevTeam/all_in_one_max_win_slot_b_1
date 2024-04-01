import React, { useState } from 'react'
import { Alert } from 'react-bootstrap';
import BASE_URL from '../hooks/baseURL';

export default function ChangePassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loader, setLoader] = useState(false);

    const changePassword = (e) => {
        setLoader(true);
        e.preventDefault();
        let data = {
            password: password,
            password_confirmation: confirmPassword,
            user_id: localStorage.getItem("user_id"),
        }
        // console.log(data);
        fetch(BASE_URL + "/player-change-password", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          })
            .then(async (response) => {
              if (!response.ok) {
                setLoader(false);
                let errorData;
                try {
                  errorData = await response.json();
                  setError(errorData.errors);
                  return;
                } catch (error) {
                  console.error("Error parsing JSON:", error);
                }
                if (response.status === 422) {
                  
                  console.error(`${response.status}:`, errorData);
                  
                } else if (response.status === 401) {
                  setError(errorData.message);
                  setTimeout(() => {
                    setError("");
                  }, 3000);
                  console.error(`${response.status}:`, errorData);
                  return;
                } else {
                  console.error(`Unexpected error with status ${response.status}`);
                }
              }
              return response.json();
            })
            .then((data) => {
                if(data.status === 200){
                    console.log(data);
                    setLoader(false);
                    setSuccess("New Password Changed Successfully.");
                    setError("")
                    setTimeout(() => {
                      setSuccess("");
                    }, 1000);
                }

            })
            .catch((error) => {
              console.error(error);
            });
    }
  return (
    <div className='container'>
        <div className="row">
            <div className="col-md-6 offset-md-3">
                <div className="border rounded p-4 shadow-lg mt-4">
                    <div className="card-header">
                        <h5 className="text-center text-white">Change Password</h5>
                    </div>
                    <div className="card-body">
                        {success && <Alert variant="success">{success}</Alert>}
                        {error && <Alert variant="danger">{error}</Alert>}
                        <form action="" onSubmit={changePassword}>
                            <div className="mb-3">
                                <label htmlFor="newpassword" className="form-label text-white">New Password</label>
                                <input type="password" 
                                name='password' 
                                className="form-control" 
                                id="newpassword" 
                                placeholder="Enter Password"
                                onChange={(e)=>setPassword(e.target.value)}
                                value={password}
                                />
                                {error?.password && <p className="text-danger">{error?.password}</p>}
                            </div>
                            <div className="mb-5">
                                <label htmlFor="password" className="form-label text-white">Confirmed Password</label>
                                <input type="password" 
                                name='password_confirmation' 
                                className="form-control" 
                                id="password" 
                                placeholder="Enter Confirmed Password" 
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                value={confirmPassword}
                                />
                                {error?.password_confirmation && <p className="text-danger">{error?.password_confirmation}</p>}
                            </div>
                            <div className="mb-3">
                                <button className="btn btn-outline-light w-100">Change</button>
                            </div>
                        </form>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
  )
}
