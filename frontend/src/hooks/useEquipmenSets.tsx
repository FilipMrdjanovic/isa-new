import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { EquipmentSet, EquipmentSetResponse, EquipmentSetsResponse, FilterTableEquipmentSetsParams } from "../types/types";
import axiosPrivate from "../api/axios";
import useUtils from "../utils/useUtils";

const EQUIPMENT_URL = "/equipment/";
const SETS_URL = EQUIPMENT_URL + "sets/";
const SPECIFIC_SET_URL = SETS_URL + "equipment-set/";

const useEquipmentSets = (companyId: any) => {
    const { checkbox, setCheckbox, handleChange } = useUtils(); // Use the functions and states from useUtils
    const [tableData, setTableData] = useState<EquipmentSet[]>([]);
    const [filter, setFilter] = useState(false)
    const [filterData, setFilterData] = useState<FilterTableEquipmentSetsParams>({
        searchText: "",
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

    };

    const handleResetFilter = () => {
        setFilter(false)
        setFilterData({
            searchText: "",
            exactQuantity: 1,
        })
        setCheckbox({
            searchText: false,
            exactQuantity: false,
        })
        fetchEquipmentSetsByCompanyId()
    }

    const fetchEquipmentSetsByCompanyId = async () => {
        try {
            const response = await axiosPrivate.get<EquipmentSetsResponse>(`${SETS_URL}${companyId}`);
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

    const findSpecificEquipmentSet = async (equipmentSetId: string) => {
        try {
            const response = await axiosPrivate.get<EquipmentSetResponse>(`${SPECIFIC_SET_URL}${equipmentSetId}`);
            return (response.data.equipmentSet);
        } catch (error: any) {
            toast.error("Failed to fetch equipment set by equipment set ID");
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
        fetchEquipmentSetsByCompanyId,
        findSpecificEquipmentSet
    };
};

export default useEquipmentSets;
