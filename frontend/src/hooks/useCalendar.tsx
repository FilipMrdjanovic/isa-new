import { useEffect, useState } from "react";
import axiosPrivate from "../api/axios";
import { toast } from "react-toastify";
import dayjs, { Dayjs } from "dayjs";
import { getTodayDate } from "../helpers/date";

const PICKUP_SCHEDULES = "/pickup-schedule/";
const DATES_URL = PICKUP_SCHEDULES + "dates/";

const useCalendar = () => {
    const [dates, setDates] = useState<string[]>([])
    const [tableData, setTableData] = useState([])
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

    const today = new Date();
    const date = getTodayDate();

    const fetchSchedules = async (year: any, month: any) => {
        try {
            const response = await axiosPrivate.get(DATES_URL + `with-schedule/${year}/${month}`);
            if (response.data.status === 200)
                setDates(response.data.dates);
            else
                setDates([])
        } catch (error: any) {
            toast.error("Failed to dates");
        }
    };

    const fetchSchedulesForSpecificDate = async (date: string) => {
        try {
            const response = await axiosPrivate.get(`${PICKUP_SCHEDULES}${date}`);
            if (response.data.status === 200)
                setTableData(response.data.pickupSchedules);
            else
                setTableData([])
        } catch (error: any) {
            toast.error("Failed to dates");
        }
    };

    const handleMonthChange = (date: Dayjs) => {
        try {
            fetchSchedules(date.year(), date.month() + 1);
        } catch (error: any) {
            toast.error("Failed to fetch.");
        }
    };

    useEffect(() => {
        fetchSchedules(dayjs(today).year(), dayjs(today).month() + 1);
        fetchSchedulesForSpecificDate(date)
    }, []);



    useEffect(() => {
        if (selectedDate) {
            fetchSchedules(dayjs(selectedDate).year, dayjs(selectedDate).month);
        }
    }, [selectedDate]);

    return {
        dates,
        tableData,
        setSelectedDate,
        handleMonthChange,
        fetchSchedules,
        fetchSchedulesForSpecificDate
    }
}

export default useCalendar