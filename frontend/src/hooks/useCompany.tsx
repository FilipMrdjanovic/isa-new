import { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";
import { FilterCheckOptions, FilterTableCompanies, FilterTableCompaniesParams } from "../types/types";
import axiosPrivate from "../api/axios";

const COMPANY_URL = "/company/";

const useCompany = () => {
    const [tableData, setTableData] = useState<FilterTableCompanies[]>([]);
    const [filterData, setFilterData] = useState<FilterTableCompaniesParams>({
        searchText: "",
        minRating: 1,
        maxRating: 10,
        exactRating: 1,
    })

    const [isChecked, setIsChecked] = useState<FilterCheckOptions>({
        searchText: false,
        minRating: false,
        maxRating: false,
        exactRating: false,
    });

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setTableData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFilterData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }; 
    
    const handleCheckChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setIsChecked((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        console.log(name, value);
    };

    const fetchCompanyData = async () => {
        try {
            await axiosPrivate.get(COMPANY_URL + "all")
                .then((response: any) => {
                    setTableData(response.data)
                })
        } catch (error: any) {
            error.response && error.response.data
                ? error.response.data.message
                : "Error";
            toast.error("Failed to fetch company data");
        }
    };

    const filterCompanyData = async () => {
        try {
            var params = {
                filterData
            }
            await axiosPrivate.get(COMPANY_URL + "filter", { params })
                .then((response: any) => {
                    setFilterData(response.data)
                });
        } catch (error: any) {
            error.response && error.response.data
                ? error.response.data.message
                : "Error";
            toast.error("Failed to filter company data");
        }
    }

    return {
        tableData,
        filterData,
        isChecked,
        handleChange,
        handleFilterChange,
        handleCheckChange,
        fetchCompanyData,
        filterCompanyData

    }
}
export default useCompany;