import axios from "axios";

export const productGet = async (category) => {
    let res = {}
    if(category){
        res = await axios.get(
            `http://localhost:3000/api/v1/admin/products?productCategory=${category}`,
        )
    } else {
        res = await axios.get(
            "http://localhost:3000/api/v1/admin/products",
        )
    }
    return res.data
}

export const paginationGet = async(page) => {
    let res={}
    if(page) {
        res = await axios.get(
            `http://localhost:3000/api/v1/admin/products?page=${page}`,
        )
    } 
    return res.data
}

export const productCategoryGet = async () => {
    const res = await axios.get(
        "http://localhost:3000/api/v1/admin/product-category"
    )
    return res.data
}