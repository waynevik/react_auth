import { useRef, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";

import axios from '../api/axios';
const LOGIN_URL = '/auth';

const Login = () => {

    const{ setAuth, persist, setPersist } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const emailRef = useRef();
    const errRef = useRef();

    const [email, setEmail] =  useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect( () => {
        emailRef.current.focus();
    }, []);

    useEffect( () => {
        setErrMsg('');
    }, [email, pwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                LOGIN_URL, 
                JSON.stringify({ email, pwd }), 
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

            console.log(JSON.stringify(response?.data));

            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            setAuth({email, pwd, roles, accessToken});
            setEmail('');
            setPwd('');

            navigate(from, {replace:true});
            
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing username or password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed')
            }
            errRef.current.focus();
        }
    }

    useEffect( () => {
        localStorage.setItem("persist", persist);
    }, [persist])
    const togglePersist = () => {
        setPersist(prev => !prev);
    }

    return (
       <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "off-screen"} aria-live="assertive">{errMsg}</p>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email Address: </label>
                <input 
                    type="text"
                    id="email"
                    ref={emailRef}
                    autoComplete="off"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                />

                <label htmlFor="password">Password: </label>
                <input 
                    type="password"
                    id="password"
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    required
                />

                <button>Sign In</button>

                <div className="persistCheck">
                    <input 
                    type="checkbox"
                    id="persist"
                    onChange={togglePersist}
                    checked={persist}
                     />
                    <label htmlFor="persist"> Trust This Device</label>
                </div>

            </form>
            <p>
                Need Account?<br />
                <span className="line">
                    {/*put router link here*/}
                    <a href="#">Sign Up</a>
                </span>
            </p>
        </section>
    )
       
    

}

export default Login;