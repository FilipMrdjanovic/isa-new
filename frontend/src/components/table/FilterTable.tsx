import { useState } from 'react';
import { MenuItem } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { StyledMenu } from '../common/common';
import { ThemeProvider } from 'styled-components';
import useCompany from '../../hooks/useCompany';
import theme from '../../theme/theme';
import './FilterTable.scss';
import '../common/input.scss'
import NoDataView from '../../views/NoDataView';

const FilterTable = () => {
    const { tableData, filterData, checkbox, handleFilterChange, handleCheckboxChange, handleResetFilter, filterCompanyData } = useCompany();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);


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

    return (
        <ThemeProvider theme={theme}>
            <div className="table">
                <div className="container">
                    <div className="tbl-wrapper">
                        <form role="form" className="tbl-inputs">
                            <div className="w300">
                                <input
                                    className="styledInput"
                                    type="search"
                                    name="searchText"
                                    value={filterData.searchText}
                                    onChange={handleFilterChange}
                                    placeholder="Search"
                                />
                            </div>
                            <div className='label'>Minimal Rating</div>
                            <div className="range">
                                <input
                                    className="custom-slider"
                                    type="range"
                                    name="minRating"
                                    min="1"
                                    max={filterData.maxRating}
                                    value={filterData.minRating}
                                    onChange={handleFilterChange} />
                            </div>
                            <div className='text'>
                                {filterData.minRating}
                            </div>
                            <div className='label'>Maximal Rating</div>
                            <div className="range">
                                <input
                                    className="custom-slider"
                                    type="range"
                                    name="maxRating"
                                    min={filterData.minRating}
                                    max="10"
                                    value={filterData.maxRating}
                                    onChange={handleFilterChange} />
                            </div>
                            <div className='text'>
                                {filterData.maxRating}
                            </div>
                            <div className='label'>Exact Rating</div>
                            <input
                                className="styledInput w100"
                                type="number"
                                name="exactRating"
                                min="1"
                                max="10"
                                value={filterData.exactRating}
                                onChange={handleFilterChange}
                            />
                            <div className='button-style' onClick={handleClick}>
                                <span>Filter</span>
                            </div>
                            <StyledMenu
                                MenuListProps={{
                                    'aria-labelledby': 'demo-customized-button',
                                }}
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                            >
                                <MenuItem className="checkboxItem">
                                    <input
                                        type="checkbox"
                                        name="searchText"
                                        checked={checkbox.searchText}
                                        onChange={handleCheckboxChange}
                                    />
                                    <label className='ml10'>By Text</label>
                                </MenuItem>

                                <MenuItem className="checkboxItem">
                                    <input
                                        type="checkbox"
                                        name="minMaxRating"
                                        checked={checkbox.minMaxRating}
                                        onChange={handleCheckboxChange}
                                    />
                                    <label className='ml10'>By Min and Max Rating</label>
                                </MenuItem>

                                <MenuItem className="checkboxItem">
                                    <input
                                        type="checkbox"
                                        name="exactRating"
                                        checked={checkbox.exactRating}
                                        onChange={handleCheckboxChange}
                                    />
                                    <label className='ml10'>By Exact Rating</label>
                                </MenuItem>
                            </StyledMenu>
                            <div className='button-style' onClick={handleSubmit}>
                                Search
                            </div>
                            <div className='button-style' onClick={handleResetFilter}>
                                <RestartAltIcon />
                            </div>
                        </form>
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
                                            <tr key={index}>
                                                <td>{item.name}</td>
                                                <td>{item.address}</td>
                                                <td>{item.city}</td>
                                                <td>{item.averageRating}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr style={{ borderBottom: "none", height: "480px" }}>
                                            <td colSpan={columns.length}>
                                                <NoDataView/>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </ThemeProvider>
    );
};

export default FilterTable;

