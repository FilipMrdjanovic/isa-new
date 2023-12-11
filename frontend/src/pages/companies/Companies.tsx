import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCompany from '../../hooks/useCompany';
import { ThemeProvider } from 'styled-components';
import theme from '../../theme/theme';
import CompaniesFilters from '../../components/table/tableFilters/CompaniesFilters';
import TableComponent from '../../components/table/TableComponent';
import "../../components/table/Table.scss"
import '../../components/common/input.scss';

const columns = [
    { name: "Name", key: "name" },
    { name: "Address", key: "address" },
    { name: "City", key: "city" },
    { name: "Average Rating", key: "averageRating" },
];

const Companies = () => {
    const { tableData, filterData, checkbox, handleFilterChange, handleCheckboxChange, handleResetFilter, filterCompanyData } = useCompany();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const navigate = useNavigate();

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSubmit = (e: any) => {
        e.preventDefault;
        filterCompanyData();
    }

    const handleRowClick = (id: number) => {
        navigate(`/company/${id}`);
    }

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
                        <CompaniesFilters
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
        </ThemeProvider>
    );
};

export default Companies;
