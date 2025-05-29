import axios from "axios";

export const axiosJWT = axios.create();
const API = process.env.REACT_API_BACKEND

export const loginUser = async (data) => {
    const res = await axios.post(
        `${API}/client/user/login`,
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
        `${API}client/user/register`,
        data, 
        {
            withCredentials: true
        }
    );
    return res.data; 
};

export const ProfileUser = async (id, token) => {
    const res = await axiosJWT.get(
        `${API}/client/user/profile/${id}`,
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
    const res = await axios.post(`${API}/client/user/refresh_token`,{},
        {
            withCredentials: true
        }
    )
    return res.data
}

export const LogoutUser = async() => {
    const res = await axios.post(`${API}/client/user/logout`)
    return res.data
}

export const updateUser = async(id,data) => {
    const res = await axios.patch(`${API}/client/user/update/${id}`,data)
    return res.data
}