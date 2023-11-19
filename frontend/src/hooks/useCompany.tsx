import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FilterCheckOptions, FilterTableCompanies, FilterTableCompaniesParams } from "../types/types";
import axiosPrivate from "../api/axios";

const COMPANY_URL = "/company/";
const SEARCH_URL = COMPANY_URL + "search/"

const useCompany = () => {
    const [tableData, setTableData] = useState<FilterTableCompanies[]>([]);
    const [filter, setFilter] = useState(false)
    const [filterData, setFilterData] = useState<FilterTableCompaniesParams>({
        searchText: "",
        minRating: 1,
        maxRating: 10,
        exactRating: 1,
    })

    const [checkbox, setCheckbox] = useState<FilterCheckOptions>({
        searchText: false,
        minMaxRating: false,
        exactRating: false,
    })

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setCheckbox((prevData) => ({
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

    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setCheckbox((prevData) => ({
            ...prevData,
            [name]: checked,
        }));

        if (name === "searchText" && checked === true) {
            if (filterData.searchText !== "") {
                setCheckbox((prevData) => ({
                    ...prevData,
                    searchText: true,
                }));
            } else {
                setCheckbox((prevData) => ({
                    ...prevData,
                    searchText: false,
                }));
                toast.warning("Search input must not be empty")
                return;
            }
        }

        if (checkbox.minMaxRating) {
            setCheckbox((prevData) => ({
                ...prevData,
                exactRating: false,
            }));
        }

        if (checkbox.exactRating) {
            setCheckbox((prevData) => ({
                ...prevData,
                minMaxRating: false,
            }));
        }
    };

    const handleResetFilter = () => {
        setFilter(false)
        setFilterData({
            searchText: "",
            minRating: 1,
            maxRating: 10,
            exactRating: 1,
        })
        setCheckbox({
            searchText: false,
            minMaxRating: false,
            exactRating: false,
        })
        fetchCompanyData()
    }

    const fetchCompanyData = async () => {
        try {
            const response = await axiosPrivate.get(SEARCH_URL + "all");
            setTableData(response.data);
        } catch (error: any) {
            toast.error("Failed to fetch company data");
        }
    };

    const filterCompanyData = async () => {
        try {
            let params = "";
            if (checkbox.searchText === true)
                params += "&searchText=" + filterData.searchText;
            if (checkbox.minMaxRating === true)
                params += "&minRating=" + filterData.minRating + "&maxRating=" + filterData.maxRating;
            if (checkbox.exactRating === true)
                params += "&exactRating=" + filterData.exactRating;

            if (params === "") {
                toast.warning("You need to choose at least one filter!");
                return;
            }
            params = params.slice(1);

            const response = await axiosPrivate.get(SEARCH_URL + "filter?" + params);
            setTableData(response.data);
        } catch (error: any) {
            toast.error("Failed to filter company data");
        }
    }

    useEffect(() => {
        if (!filter) {
            fetchCompanyData();
        }
    }, [filter])


    return {
        tableData,
        filterData,
        checkbox,
        handleChange,
        handleFilterChange,
        handleCheckboxChange,
        handleResetFilter,
        fetchCompanyData,
        filterCompanyData
    }
}
export default useCompany;
