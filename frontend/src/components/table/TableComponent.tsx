import React from 'react';
import NoDataView from '../../views/NoDataView';

interface TableColumn {
    name: string;
    key?: string | string[];
}

interface TableProps {
    columns: TableColumn[];
    tableData: any[];
    handleRowClick?: (id: number) => void;
}

const TableComponent: React.FC<TableProps> = ({ columns, tableData, handleRowClick }) => {
    const renderCellData = (rowData: any, columnKey: string | string[]) => {
        if (Array.isArray(columnKey)) {
            let data = rowData;
            for (const key of columnKey) {
                data = data[key];
            }
            return data;
        }
        return rowData[columnKey];
    };

    return (
        <div className="tbl-content">
            <table>
                <thead className='tbl-header'>
                    <tr>
                        {columns.map((column, colIndex) => (
                            <th key={colIndex}>{column.name}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {tableData.length > 0 ? (
                        tableData.map((item, index) => (
                            <tr key={index} onClick={handleRowClick ? () => handleRowClick(item.id) : undefined}>
                                {columns.map((column, colIndex) => (
                                    <td key={colIndex}>{renderCellData(item, column.key || column.name)}</td>
                                ))}
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
    );
};

export default TableComponent;
