import { IconButton, MenuItem } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { StyledMenu } from '../common/common';
import { useState } from 'react';

const Filters = ({
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
                    <div className='label'>Minimal Rating <p className='text'>{filterData.minRating}</p></div>
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
                    <div className='label'>Maximal Rating <p className='text'>{filterData.maxRating}</p></div>
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
                    <div className='label' style={{marginTop:"-5px"}}>Exact Rating
                        <input
                            className="styledInput w100"
                            type="number"
                            name="exactRating"
                            min="1"
                            max="10"
                            value={filterData.exactRating}
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
            )}
        </div>
    );
};

export default Filters;
