import axios from "axios";

const API = process.env.REACT_APP_API_BACKEND

console.log(API)

export const productGet = async (category) => {
    let res = {}
    if(category){
        res = await axios.get(
            `${API}/admin/products?productCategory=${category}`,
        )
    } else {
        res = await axios.get(
            `${API}/admin/products`,
        )
    }
    return res.data
}

export const paginationGet = async(page) => {
    let res={}
    if(page) {
        res = await axios.get(
            `${API}/admin/products?page=${page}`,
        )
    } 
    return res.data
}

export const productCategoryGet = async () => {
    const res = await axios.get(
        `${API}/admin/product-category`
    )
    return res.data
}