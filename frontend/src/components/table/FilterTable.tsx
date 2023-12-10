import { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import useCompany from '../../hooks/useCompany';
import theme from '../../theme/theme';
import './FilterTable.scss';
import '../common/input.scss'
import NoDataView from '../../views/NoDataView';
import { useNavigate } from 'react-router-dom';
import Filters from './Filters';

const FilterTable = () => {
    const { tableData, filterData, checkbox, handleFilterChange, handleCheckboxChange, handleResetFilter, filterCompanyData } = useCompany();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const navigate = useNavigate()

    const columns = [
        { name: "Name" },
        { name: "Address" },
        { name: "City" },
        { name: "Average Rating" }
    ];

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSubmit = (e: any) => {
        e.preventDefault;
        filterCompanyData()
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
                            <div className="tbl-header">
                                <table>
                                    <thead>
                                        <tr>
                                            {columns.map((item, index) => (
                                                <th key={index}>{item.name}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                            <div className="tbl-content">
                                <table>
                                    <tbody>
                                        {tableData.length > 0 ? (
                                            tableData.map((item, index) => (
                                                <tr key={index} onClick={() => handleRowClick(item.id)}>
                                                    <td>{item.name}</td>
                                                    <td>{item.address}</td>
                                                    <td>{item.city}</td>
                                                    <td>{item.averageRating}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr style={{ borderBottom: "none", height: "480px" }}>
                                                <td colSpan={columns.length}>
                                                    <NoDataView />
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <Filters
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

export default FilterTable;