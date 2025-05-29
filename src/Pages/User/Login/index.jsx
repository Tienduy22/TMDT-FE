import { useState, useEffect } from "react";
import "./Login.scss";
import * as UserService from "../../../Services/userService";
import { useMutationHook } from "../../../Hooks/useMutationHook";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode'; 
import { useDispatch } from "react-redux";
import { updateUser } from "../../../Redux/reducers/userReducer";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch("");
    const mutation = useMutationHook((data) => UserService.loginUser(data));

    const {data, isSuccess, isError} = mutation;
    
    useEffect(() => {
        if(data?.code === 200){
            navigate("/");
            localStorage.setItem("token", JSON.stringify(data?.token))
            const tokenFromHeader = data?.headers?.authorization;  // Ví dụ lấy token từ header

            if (tokenFromHeader) {
                console.log("Token from header:", tokenFromHeader);  // In ra token từ header (nếu có)
            }
        }
        if(data?.token){
            const decode = jwtDecode(data?.token);

            if(decode?.id){
                handleGetDetailUser(decode?.id, data?.token)
            }

        }
    },[isSuccess, isError,navigate, data])

    const handleGetDetailUser = async (id,token) => {
        const res = await UserService.ProfileUser(id,token)
        dispatch(updateUser({...res,token: token}))
    }

    const handleChangeEmail = (e) => {
        setEmail(e.target.value);
    };

    const handleChangePassword = (e) => {
        setPassword(e.target.value);
    };

    const handleLogin = (e) => {
        e.preventDefault();
        mutation.mutate({
            email,
            password,
        });
    };
    return (
        <div className="login-container">
            <div className="login-form">
                <h2 className="login-title">Welcome Back</h2>
                <p className="login-subtitle">Please log in to your account</p>
                <form>
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
                    {data?.code === 400 && (
                        <span style={{ fontSize: 16, color: "red" }}>{data.message}</span>
                    )}
                    <button
                        type="submit"
                        className="login-button"
                        onClick={handleLogin}
                    >
                        Log In
                    </button>
                </form>
                <div className="login-footer">
                    <p>
                        Don't have an account? <a href="/register">Sign up</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
