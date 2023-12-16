import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useEquipment from "../../hooks/useEquipmenSets";
import TableComponent from "../../components/table/TableComponent";
import EquipmentSetsFilters from "../../components/table/tableFilters/EquipmentSetsFilters";
import React from "react";

const columns = [
    { name: "Quantity", key: "quantity" },
    { name: "Name", key: ["equipment", "name"] },
    { name: "Description", key: ["equipment", "description"] },
];

const Company = () => {
    const { id } = useParams<{ id: string }>(); // Extract company ID from URL
    const { tableData, filterData, checkbox, handleFilterChange, handleCheckboxChange, handleResetFilter, filterEquipmentSets } = useEquipment(id);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const navigate = useNavigate();

    const handleRowClick = async (item: any) => {
        navigate(`equipment-set/${item.id}`);
    }

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        filterEquipmentSets();
    }

    return (
            <div className="table">
                <div className="container">
                    <div className="tbl-wrapper">
                        <div className='table-content'>
                            <TableComponent
                                columns={columns}
                                tableData={tableData}
                                handleRowClick={handleRowClick}
                            />
                        </div>
                        <EquipmentSetsFilters
                            filterData={filterData}
                            checkbox={checkbox}
                            handleFilterChange={handleFilterChange}
                            handleCheckboxChange={handleCheckboxChange}
                            handleClick={handleClick}
                            handleSubmit={handleSubmit}
                            handleResetFilter={handleResetFilter}
                            anchorEl={anchorEl}
                            open={open}
                            handleClose={handleClose}
                        />
                    </div>
                </div>
            </div>
    );
};

export default Company;
