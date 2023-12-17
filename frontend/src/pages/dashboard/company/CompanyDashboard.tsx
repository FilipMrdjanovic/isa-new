import dayjs, { Dayjs } from "dayjs";
import CustomDateCalendar from "../../../components/calendar/CustomDateCalendar";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";

import { useState } from "react";
import useCalendar from "../../../hooks/useCalendar";
import { formatDate } from "../../../helpers/date";
import { Box, Grid } from "@mui/material";
import TableComponent from "../../../components/table/TableComponent";

const columns = [
    { name: "Date", key: "date" },
    { name: "Time", key: "time" },
    { name: "Duration", key: "duration" },
    { name: "Reserved", key: "reserved" },
    { name: "Active", key: "active" },
];

const CompanyDashboard = () => {
    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
    const {
        dates,
        tableData,
        handleMonthChange,
        setSelectedDate: setSelectedDateInHook,
        fetchSchedulesForSpecificDate
    } = useCalendar();

    const handleDateClick = async (date: Dayjs) => {
        setSelectedDate(date);
        var formatedDate = formatDate(date)
        console.log(formatedDate)
        await fetchSchedulesForSpecificDate(formatedDate);
    }
    const handleDateChange = (newDate: Dayjs) => {
        setSelectedDateInHook(newDate);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container>
                <Grid item xs={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <CustomDateCalendar
                            value={selectedDate}
                            onChange={handleDateChange}
                            onMonthChange={handleMonthChange}
                            onDateClick={handleDateClick}
                            schedules={dates.map((date: any) => dayjs(date))}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={6}>
                    <TableComponent
                        columns={columns}
                        tableData={tableData}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}

export default CompanyDashboard;
