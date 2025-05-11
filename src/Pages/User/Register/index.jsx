import React, { useEffect, useState } from "react";
import "./Register.scss";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import * as UserService from "../../../Services/userService";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const mutation = useMutation (
        data => UserService.RegisterUser(data)
    )

    const {data, isSuccess, isError} = mutation;
        
    useEffect(() => {
        if(isSuccess){
            navigate("/");
        }
    },[isSuccess, isError, navigate])

    const handleChangeName = (e) => {
        setName(e.target.value);
    }

    const handleChangeEmail = (e) => {
        setEmail(e.target.value);
    };

    const handleChangePassword = (e) => {
        setPassword(e.target.value);
    };

    const handleRegister = (e) => {
        e.preventDefault();
        mutation.mutate({
            name,
            email,
            password
        })
    };
    return (
        <div className="register-container">
            <div className="register-form">
                <h2 className="register-title">Create an Account</h2>
                <p className="register-subtitle">Sign up to get started</p>
                <form>
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={handleChangeName}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={handleChangeEmail}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={handleChangePassword}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirm-password">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirm-password"
                            placeholder="Confirm your password"
                        />
                    </div>
                    {data?.code === 400 && (
                        <span style={{ fontSize: 16, color: "red" }}>{data.message}</span>
                    )}
                    <button type="submit" className="register-button" onClick={handleRegister}>
                        Sign Up
                    </button>
                </form>
                <div className="register-footer">
                    <p>
                        Already have an account? <a href="/login">Log in</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
