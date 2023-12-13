import { useState } from "react";
import { useParams } from "react-router-dom";
import useEquipment from "../../hooks/useEquipmenSets";
import { ThemeProvider } from "styled-components";
import TableComponent from "../../components/table/TableComponent";
import theme from "../../theme/theme";
import EquipmentSetsFilters from "../../components/table/tableFilters/EquipmentSetsFilters";
import { EquipmentSet } from "../../types/types";
import DialogPupup from "../../components/dialog/DialogPupup";
import React from "react";

const columns = [
    { name: "Quantity", key: "quantity" },
    { name: "Name", key: ["equipment", "name"] },
    { name: "Description", key: ["equipment", "description"] },
];

const Company = () => {
    const { id } = useParams<{ id: string }>(); // Extract company ID from URL
    const { tableData, filterData, checkbox, handleFilterChange, handleCheckboxChange, handleResetFilter, filterEquipmentSets, findSpecificEquipmentSet } = useEquipment(id);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [equipmentSet, setEquipmentSet] = useState<EquipmentSet>();
    const open = Boolean(anchorEl);

    const [dialogOpen, setDialogOpen] = React.useState(false); // State to control dialog open/close

    const handleRowClick = async (id: number) => {
        const response: EquipmentSet | undefined = await findSpecificEquipmentSet(id.toString());
        if (response != null) {
            setEquipmentSet(response);
            setDialogOpen(true); // Open the dialog on row click
        }
    }

    const handleCloseDialog = () => {
        setDialogOpen(false); // Function to close the dialog
        setEquipmentSet(undefined); // Clear equipment set data on dialog close
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setEquipmentSet(undefined); // Clear equipment set data on dialog close
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        filterEquipmentSets();
    }

    const dialogActions = <button onClick={handleClose}>Close</button>;

    return (
        <ThemeProvider theme={theme}>
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
                        {equipmentSet && (
                            <DialogPupup
                                title={`Choose your pickup date`}
                                open={dialogOpen} // Pass the open state
                                onClose={handleCloseDialog} // Pass the close function
                                actions={dialogActions}
                            >
                                <div style={{ width: "500px", height: "300px" }}>
                                    <div style={{ width: "fit-content", padding:"5px 10px", lineHeight: 0.7, fontFamily: `"Roboto","Helvetica","Arial",sans-serif`, fontSize: "12px", color:"#1b4332", backgroundColor: `#b7e4c7`, border: "2px solid rgba(0,0,0,0.1)", borderRadius: "20px" }}>
                                        <p>Quantity: {equipmentSet.quantity}</p>
                                        <p>Name: {equipmentSet.equipment.name}</p>
                                        <p>Description: {equipmentSet.equipment.description}</p>
                                    </div>
                                    <div style={{margin:"10px 0", width: "100%", height:"200px", borderTop: "1px solid rgba(0, 0, 0, 0.12)"}}>

                                    </div>
                                </div>
                            </DialogPupup>
                        )}
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
};

export default Company;
