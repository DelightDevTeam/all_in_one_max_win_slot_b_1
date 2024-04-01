import React, { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import BASE_URL from '../hooks/baseURL';
import { useNavigate } from 'react-router-dom';

export default function ChangePassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loader, setLoader] = useState(false);
    const navigate = useNavigate();

  let auth = localStorage.getItem("authToken");
  let passwordChanged = localStorage.getItem('is_changed_password');

  useEffect(() => {
    if (auth && passwordChanged === 1) {
      navigate("/login");
    }
  }, [navigate]);

    const changePassword = async (e) => {
        e.preventDefault();
        setLoader(true);

        const data = {
            password: password,
            password_confirmation: confirmPassword,
            user_id: localStorage.getItem('user_id'),
        };

        try {
            const response = await fetch(BASE_URL + '/player-change-password', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();

            if (!response.ok) {
                if (response.status === 422) {
                    setError(responseData.errors.password[0]);
                } else if (response.status === 401) {
                    setError(responseData.message);
                    setTimeout(() => {
                        setError('');
                    }, 3000);
                } else {
                    console.error(`Unexpected error with status ${response.status}`);
                }
            } else {
                setSuccess('New Password Changed Successfully.');
                setPassword('');
                navigate('/login');
                setConfirmPassword('');
                setTimeout(() => {
                    setSuccess('');
                }, 3000);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoader(false);
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <div className="border rounded p-4 shadow-lg mt-4">
                        <div className="card-header">
                            <h5 className="text-center text-white">Change Password</h5>
                        </div>
                        <div className="card-body">
                            {success && <Alert variant="success">{success}</Alert>}
                            {error && <Alert variant="danger">{error}</Alert>}
                            <form onSubmit={changePassword}>
                                <div className="mb-3">
                                    <label htmlFor="newpassword" className="form-label text-white">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="form-control"
                                        id="newpassword"
                                        placeholder="Enter Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="mb-5">
                                    <label htmlFor="password" className="form-label text-white">
                                        Confirmed Password
                                    </label>
                                    <input
                                        type="password"
                                        name="password_confirmation"
                                        className="form-control"
                                        id="password"
                                        placeholder="Enter Confirmed Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <button type="submit" className="btn btn-outline-light w-100">
                                        {loader ? 'Changing...' : 'Change'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

