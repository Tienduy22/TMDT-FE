import FilterByCategory from "../Filters/FilterByCategory/FilterByCategory";

function ProductFilter ({filters, onChange}){
    const handleFilterCategory =(CategoryId) =>{
        if(!onChange) return;

        const newFilters = {
            ...filters,
            CategoryId
        }
        onChange(newFilters)

        console.log(newFilters)
    }

    return(
        <>
            <FilterByCategory  onChange={handleFilterCategory}/>
            
        </>
    )
}
export default ProductFilter;