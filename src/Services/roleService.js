import axios from "axios";

const API = process.env.REACT_APP_API_BACKEND

export const RoleGet = async () => {
    const res = await axios.get(
        `${API}/admin/roles/`
    );
    return res.data;
};

export const RoleDetail = async (role_id) => {
    const res = await axios.get(
        `${API}/admin/roles/detail/${role_id}`
    );
    return res.data;
};