import React from 'react';
import NoDataView from '../../views/NoDataView';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

interface TableColumn {
    name: string;
    key?: string | string[];
}

interface TableProps {
    className?: any;
    height?: string;
    columns: TableColumn[];
    tableData: any[];
    handleRowClick?: (item: any) => void;
    buttons?: (item: any) => React.ReactNode; // Change the type of buttons to accept a function
}

const TableComponent: React.FC<TableProps> = ({ className, height, columns, tableData, handleRowClick, buttons }) => {
    const renderCellData = (rowData: any, columnKey: string | string[]) => {
        if (Array.isArray(columnKey)) {
            let data = rowData;
            for (const key of columnKey) {
                data = data[key];
            }
            return data;
        }

        const value = rowData[columnKey];

        if (typeof value === 'boolean') {
            return value ? <CheckIcon color='success'/> : <ClearIcon color='error'/>;
        }

        return value;
    };
    return (
        <div className={`${className ? className : ""} tbl-content`} style={{ height: height }}>
            <table>
                <thead className='tbl-header'>
                    <tr>
                        {columns.map((column, colIndex) => (
                            <th key={colIndex}>{column.name}</th>
                        ))}
                        {buttons && (
                            <th className='actions'>Actions</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {tableData ? <>
                        {tableData.length > 0 && (
                            tableData.map((item, index) => (
                                <tr key={index} onClick={handleRowClick ? () => handleRowClick(item) : undefined}>
                                    {columns.map((column, colIndex) => (
                                        <td key={colIndex}>{renderCellData(item, column.key || column.name)}</td>
                                    ))}
                                    {buttons && (
                                        <td className='actions'>
                                            {buttons(item)}
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </> :
                        <tr style={{ borderBottom: "none", height: "480px" }}>
                            <td colSpan={columns.length + (buttons ? 1 : 0)}>
                                <NoDataView />
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    );
};

export default TableComponent;
