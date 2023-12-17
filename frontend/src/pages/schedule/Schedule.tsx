import TableComponent from '../../components/table/TableComponent'
import useTransactions from '../../hooks/useTransactions';

const columns = [
    { name: "Date", key: ["pickupSchedule", "date"] },
    { name: "Time", key: ["pickupSchedule", "time"] },
    { name: "Quantity", key: ["equipmentSet", "quantity"] },
    { name: "Name", key: ["equipmentSet", "equipment", "name"] },
];

const Schedule = () => {
    const {tableData} = useTransactions()

    return (
        <div className="table">
            <div className="container">
                <div className="tbl-wrapper">
                    <div className='table-content'>
                        <TableComponent
                            columns={columns}
                            tableData={tableData}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Schedule
