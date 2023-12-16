import { useState } from "react";
import { useParams } from "react-router-dom";
import TableComponent from "../../components/table/TableComponent";
import { StyledButton } from "../../components/common/common";
import useSchedule from "../../hooks/useSchedule";
import { EquipmentSet } from "../../types/types";
import DialogPupup from "../../components/dialog/DialogPupup";
import useEquipmentSets from "../../hooks/useEquipmenSets";
import { getTodayDate } from "../../helpers/date";

const columns = [
    { name: "Date", key: "date" },
    { name: "Time", key: "time" },
    { name: "Duration", key: "duration" }
];
const timeslotColumns = [
    { name: "Start", key: "start" },
    { name: "End", key: "end" }
];

const CreateScheduleUser = () => {
    const { id } = useParams<{ id: string }>();
    const { eqId } = useParams<{ eqId: string }>();
    const [scheduleId, setScheduleId] = useState(0)
    const { tableDataTimeslots, tableDataSchedule, planSchedule, planScheduleWithTime, getTimeSlotsByCompanyAndDate} = useSchedule(id);
    const { findSpecificEquipmentSet } = useEquipmentSets(eqId);
    const [equipmentSet, setEquipmentSet] = useState<EquipmentSet>();

    var today = getTodayDate()
    
    const [date, setDate] = useState(today);
    const [time, setTime] = useState("");

    const [dialogOpen, setDialogOpen] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        await planScheduleWithTime(date, time, eqId, tableDataTimeslots);
        setDate(today);
        setTime("")
    }
    const handleDate = (e: any) => {
        setDate(e.target.value)
        getTimeSlotsByCompanyAndDate(e.target.value)
        console.log(e.target.value);
    }
    const handleTime = (e: any) => {
        setTime(e.target.value)
        console.log(e.target.value);
    }

    const handkeOpenDialog = async (id: number) => {
        setDialogOpen(true);
        const response: EquipmentSet | undefined = await findSpecificEquipmentSet(eqId!);
        if (response != null) {
            setEquipmentSet(response);
            setDialogOpen(true);
        }
        setScheduleId(id)
    }
    const handleCloseDialog = () => {
        setDialogOpen(false);
        setScheduleId(0)
        setEquipmentSet(undefined)
    };

    const handleRowClick = (item: any) => {
        var startTime = item.start;
        startTime = startTime.substring(0, startTime.length-3);
        console.log("Start: ", startTime)
        setTime(startTime)
    }

    const handleReserveExisting = async () => {
        await planSchedule(scheduleId, eqId);
        setDate(today);
        setTime("")
    };

    const buttons = (item: any) => {
        return (
            <StyledButton key={item.id} onClick={() => handkeOpenDialog(item.id)}>Reserve</StyledButton>
        );
    };

    const dialogActions =
        <div className="flexCenter">
            <button className='button-style' onClick={handleReserveExisting}>Confirm</button>
            <button className='button-style' onClick={handleCloseDialog}>Cancel</button>
        </div>

    return (
        <div className="table">
            <div className="container">
                <div className="tbl-wrapper">
                    <div className='table-content'>
                        <TableComponent
                            columns={columns}
                            tableData={tableDataSchedule}
                            buttons={buttons}
                        />
                    </div>
                    {tableDataTimeslots &&
                        <div className="filters-container">
                            <div style={{ width: "200px", margin: "0 20px" }}>
                                <TableComponent
                                    height="300px"
                                    columns={timeslotColumns}
                                    tableData={tableDataTimeslots}
                                    handleRowClick={handleRowClick}
                                />
                                <div className="custom-select">
                                    <input
                                        type="date"
                                        id="dateInput"
                                        value={date}
                                        onChange={handleDate}
                                    />
                                    <input
                                        type="time"
                                        id="timeInput"
                                        value={time}
                                        onChange={handleTime}
                                    />
                                    <div className='button-style' onClick={handleSubmit}>
                                        Reserve
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    <DialogPupup
                        title={`Confirm schedule`}
                        open={dialogOpen}
                        onClose={handleCloseDialog}
                        actions={dialogActions}
                    >
                        {equipmentSet &&
                            <div>
                                <div className="customPupupStyle">
                                    <p>Quantity: {equipmentSet.quantity}</p>
                                    <p>Name: {equipmentSet.equipment.name}</p>
                                    <p>Description: {equipmentSet.equipment.description}</p>
                                </div>
                            </div>
                        }
                    </DialogPupup>
                </div>
            </div>
        </div>
    );
};

export default CreateScheduleUser;
