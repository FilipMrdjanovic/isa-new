import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { EquipmentSet, EquipmentSetResponse, FilterTableEquipmentSetsParams } from "../types/types";
import axiosPrivate from "../api/axios";
import useUtils from "../utils/useUtils";

const EQUIPMENT_URL = "/equipment/";
const SETS_URL = EQUIPMENT_URL + "sets/";

const useEquipmentSets = (companyId: any) => {
    const { checkbox, setCheckbox, handleChange } = useUtils(); // Use the functions and states from useUtils
    const [tableData, setTableData] = useState<EquipmentSet[]>([]);
    const [filter, setFilter] = useState(false)
    const [filterData, setFilterData] = useState<FilterTableEquipmentSetsParams>({
        searchText: "",
        minQuantity: 1,
        maxQuantity: 1000,
        exactQuantity: 1,
    })

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

        if (checkbox.minMaxQuantity) {
            setCheckbox((prevData) => ({
                ...prevData,
                exactQuantity: false,
            }));
        }

        if (checkbox.exactQuantity) {
            setCheckbox((prevData) => ({
                ...prevData,
                minMaxQuantity: false,
            }));
        }
    };

    const handleResetFilter = () => {
        setFilter(false)
        setFilterData({
            searchText: "",
            minQuantity: 1,
            maxQuantity: 10,
            exactQuantity: 1,
        })
        setCheckbox({
            searchText: false,
            minMaxQuantity: false,
            exactQuantity: false,
        })
        fetchEquipmentSetsByCompanyId()
    }

    const fetchEquipmentSetsByCompanyId = async () => {
        try {
            const response = await axiosPrivate.get<EquipmentSetResponse>(`${SETS_URL}${companyId}`);
            setTableData(response.data.equipmentSets);
        } catch (error: any) {
            toast.error("Failed to fetch equipment sets by company ID");
        }
    };

    const filterEquipmentSets = async () => {
        try {
            let params = "";
            if (checkbox.searchText === true)
                params += "&searchText=" + filterData.searchText;
            if (checkbox.minMaxRating === true)
                params += "&minRating=" + filterData.minQuantity + "&maxQuantity=" + filterData.maxQuantity;
            if (checkbox.exactQuantity === true)
                params += "&exactQuantity=" + filterData.exactQuantity;

            if (params === "") {
                toast.warning("You need to choose at least one filter!");
                return;
            }
            params = params.slice(1);

            const response = await axiosPrivate.get(SETS_URL + companyId + "/search/filter?" + params);
            setTableData(response.data.equipmentSets);
        } catch (error: any) {
            toast.error("Failed to filter company data");
        }
    }

    useEffect(() => {
        if (!filter) {
            fetchEquipmentSetsByCompanyId();
        }
    }, [filter])

    return {
        filter,
        filterData,
        checkbox,
        handleChange,
        handleFilterChange,
        handleCheckboxChange,
        handleResetFilter,
        tableData,
        filterEquipmentSets,
        fetchEquipmentSetsByCompanyId
    };
};

export default useEquipmentSets;
