import { useState, ChangeEvent } from "react";
import { FilterCheckOptions } from "../types/types";

const useUtils = () => {
    const [checkbox, setCheckbox] = useState<FilterCheckOptions>({
        searchText: false,
        minMaxRating: false,
        exactRating: false,
    });

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setCheckbox((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return {
        checkbox,
        setCheckbox,
        handleChange,
    };
};

export default useUtils;
