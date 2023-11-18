import { useEffect, useState } from "react";

const Companies = () => {
    const [checkbox, setCheckbox] = useState({
        checkbox1: false,
        checkbox2: false,
        checkbox3: false,
        checkbox4: false,
    });

    const handleChangeCheckboxStatus = (event: any) => {
        const { name, checked } = event.target;
        setCheckbox((prevData) => ({
            ...prevData,
            [name]: checked,
        }));
    };

    const fetch = () => {
        let params = "";
        if (checkbox.checkbox1 === true)
            params += "&searchText=" + 1;
        if (checkbox.checkbox2 === true)
            params += "&minRating=" + 2 + "&maxRating=" + 3;
        if (checkbox.checkbox3 === true)
            params += "&exactRating=" + 4;

        if (params === "") {
            alert("Empty")
        }
        params = params.slice(1);
        console.log(params)
    }

    // useEffect(() => {
    //     console.log("Checkbox", checkbox);
    //     fetch()
    // }, [checkbox])
    return (
        <div className="companies">
            <input type="checkbox" name="checkbox1" onChange={handleChangeCheckboxStatus} checked={checkbox.checkbox1} />
            <input type="checkbox" name="checkbox2" onChange={handleChangeCheckboxStatus} checked={checkbox.checkbox2} />
            <input type="checkbox" name="checkbox3" onChange={handleChangeCheckboxStatus} checked={checkbox.checkbox3} />
            {/* <input type="checkbox" name="checkbox4" onChange={handleChangeCheckboxStatus} checked={checkbox.checkbox4} /> */}

            <button onClick={fetch}>Fetch</button>
        </div>
    );
};

export default Companies;
