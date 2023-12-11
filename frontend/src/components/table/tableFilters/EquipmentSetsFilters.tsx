import { IconButton, MenuItem } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { StyledMenu } from '../../common/common';
import { useState } from 'react';

const EquipmentSetsFilters = ({
    filterData,
    checkbox,
    handleFilterChange,
    handleCheckboxChange,
    handleClick,
    handleSubmit,
    handleResetFilter,
    anchorEl,
    open,
    handleClose
}: any) => {

    const [showFilters, setShowFilters] = useState(false);

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };
    return (
        <div className="filters-container" >
            <IconButton onClick={toggleFilters}>
                {showFilters ? <CloseIcon /> : <FilterListIcon />}
            </IconButton>
            {showFilters && (
                <form role="form" className="tbl-inputs" onSubmit={handleSubmit}>
                    <input
                        className="styledInput"
                        type="search"
                        name="searchText"
                        value={filterData.searchText}
                        onChange={handleFilterChange}
                        placeholder="Search"
                    />
                    <div className='label'>Minimal Quantity <p className='text'>{filterData.minQuantity}</p></div>
                    <div className="range">
                        <input
                            className="custom-slider"
                            type="range"
                            name="minQuantity"
                            min="1"
                            max={filterData.maxQuantity}
                            value={filterData.minQuantity}
                            onChange={handleFilterChange} />
                    </div>
                    <div className='label'>Maximal Quantity <p className='text'>{filterData.maxQuantity}</p></div>
                    <div className="range">
                        <input
                            className="custom-slider"
                            type="range"
                            name="maxQuantity"
                            min={filterData.minQuantity}
                            max="10"
                            value={filterData.maxQuantity}
                            onChange={handleFilterChange} />
                    </div>
                    <div className='label' style={{marginTop:"-5px"}}>Exact Quantity
                        <input
                         style={{width: "95px"}}
                            className="styledInput"
                            type="number"
                            name="exactQuantity"
                            min="1"
                            max="10"
                            value={filterData.exactQuantity}
                            onChange={handleFilterChange}
                        /></div>
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
                                name="minMaxQuantity"
                                checked={checkbox.minMaxQuantity}
                                onChange={handleCheckboxChange}
                            />
                            <label className='ml10'>By Min and Max Quantity</label>
                        </MenuItem>

                        <MenuItem className="checkboxItem">
                            <input
                                type="checkbox"
                                name="exactQuantity"
                                checked={checkbox.exactQuantity}
                                onChange={handleCheckboxChange}
                            />
                            <label className='ml10'>By Exact Quantity</label>
                        </MenuItem>
                    </StyledMenu>
                    <div className='button-style' onClick={handleSubmit}>
                        Search
                    </div>
                    <div className='button-style' onClick={handleResetFilter}>
                        <RestartAltIcon />
                    </div>
                </form>
            )}
        </div>
    );
};

export default EquipmentSetsFilters;
