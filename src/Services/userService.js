import axios from "axios";

export const loginUser = async (data) => {
    const res = await axios.post(
        "http://localhost:3000/api/v1/client/user/login",
        data, 
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    return res.data; 
};

export const RegisterUser = async (data) => {
    const res = await axios.post(
        "http://localhost:3000/api/v1/client/user/register",
        data, 
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    return res.data; 
};

export const ProfileUser = async (id, token) => {
    const res = await axios.get(
        `http://localhost:3000/api/v1/client/user/profile/${id}`,{
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
    )
    return res.data
}

export const RefreshToken = async () => {
    const res = await axios.post("http://localhost:3000/api/v1/client/user/refresh_token",{
        withCredentials: true //Tự động lấy cookie
    }
    )
    return res.data
}