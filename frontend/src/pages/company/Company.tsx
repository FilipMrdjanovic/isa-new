import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useEquipment from "../../hooks/useEquipment";
import { ThemeProvider } from "styled-components";
import TableComponent from "../../components/table/TableComponent";
import theme from "../../theme/theme";

const CompanyEquipment = () => {
    const { id } = useParams<{ id: string }>(); // Extract company ID from URL
    const { equipmentSets, fetchEquipmentSetsByCompanyId } = useEquipment();

    const columns = [
        { name: "Quantity", key: "quantity" },
        { name: "Name", key: ["equipment", "name"] },
        { name: "Description", key: ["equipment", "description"] },
    ];

    useEffect(() => {
        fetchEquipmentSetsByCompanyId(parseInt(id!, 10)); // Fetch equipment sets based on company ID
    }, []);


    return (
        <ThemeProvider theme={theme}>
            <div className="table">
                <div className="container">
                    <div className="tbl-wrapper">
                        <div className='table-content'>
                            <TableComponent
                                columns={columns}
                                tableData={equipmentSets}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
};

export default CompanyEquipment;
