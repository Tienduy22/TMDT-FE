import axios from "axios";

export const axiosJWT = axios.create();

export const loginUser = async (data) => {
    const res = await axios.post(
        "http://localhost:3000/api/v1/client/user/login",
        data, 
        {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
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
            withCredentials: true
        }
    );
    return res.data; 
};

export const ProfileUser = async (id, token) => {
    const res = await axiosJWT.get(
        `http://localhost:3000/api/v1/client/user/profile/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true
        }
    )
    return res.data
}

export const RefreshToken = async () => {
    const res = await axios.post("http://localhost:3000/api/v1/client/user/refresh_token",{},
        {
            withCredentials: true
        }
    )
    return res.data
}

export const LogoutUser = async() => {
    const res = await axios.post("http://localhost:3000/api/v1/client/user/logout")
    return res.data
}

export const updateUser = async(id,data) => {
    const res = await axios.patch(`http://localhost:3000/api/v1/client/user/update/${id}`,data)
    return res.data
}