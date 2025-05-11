import axios from "axios";

export const productGet = async (data) => {
    const res = await axios.get(
        "http://localhost:3000/api/v1/admin/products",
        data,    
    )
    return res.data
}