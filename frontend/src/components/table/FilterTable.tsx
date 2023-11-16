import { useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import useCompany from '../../hooks/useCompany';
import theme from '../../theme/theme';
import './FilterTable.scss';
import '../common/input.scss'

const FilterTable = () => {
    const { tableData, filterData, handleFilterChange, fetchCompanyData, filterCompanyData } = useCompany();

    const columns = [
        { name: "Name" },
        { name: "Address" },
        { name: "City" },
        { name: "Average Rating" }
    ];

    useEffect(() => {
        fetchCompanyData();
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <div className="table">
                <div className="container">
                    <div className="tbl-wrapper">
                        <form role="form" className="tbl-inputs" onSubmit={filterCompanyData}>
                            <div className="w300">
                                <input
                                    className="styledInput"
                                    type="search"
                                    name="searchText"
                                    required
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
                                    max="10"
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
                                    min="1"
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
                                        <tr>
                                            <td colSpan={columns.length}>404 - No data</td>
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

