import axios from "axios";

const API = process.env.REACT_APP_API_BACKEND

console.log(API)

export const productGet = async (category,currentPage) => {
    let res = {}
    if(category && currentPage){
        res = await axios.get(
            `${API}/admin/products?productCategory=${category}&page=${currentPage}`,
        )
    } 

    else if(currentPage){
        res = await axios.get(
            `${API}/admin/products?page=${currentPage}`,
        )
    }
    
    else {
        res = await axios.get(
            `${API}/admin/products`,
        )
    }
    return res.data
}

export const countProduct = async(category_id) => {
    let res;
    if(category_id) {
        console.log("OK")
        res = await axios.get(
            `${API}/admin/products/count?category_id=${category_id}`,
        )
    } else {
        res = await axios.get(
            `${API}/admin/products/count`,
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

export const productSearch = async (keyword) => {
    const res = await axios.get(
        `${API}/admin/products/search?keyword=${keyword}`
    )
    return res.data
}
