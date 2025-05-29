import { Pagination } from "antd";
import { useEffect, useState } from "react";
import { paginationGet } from "../../Services/productService";

const PaginationComponents = () => {

    const [current,setCurrent] = useState();

    const handleCurrentPage = (e) => {
        setCurrent(e)
        console.log(e)
        const fetchDataPagination = async () => {
            const res = await paginationGet(current)
            console.log(res)
        }
        fetchDataPagination()
    };
    return (
        <>
            <Pagination
                onChange={handleCurrentPage}
                current={current}
                pageSize={9}
                defaultCurrent={1}
                total={20}
                align="center"
            />
        </>
    );
};

export default PaginationComponents;
