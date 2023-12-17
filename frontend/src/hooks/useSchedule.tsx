import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CreatePickupSchedule, PickupSchedule, TimeSlot } from "../types/types";
import axiosPrivate from "../api/axios";

const SCHEDULE_URL = "/pickup-schedule/";
const SCHEDULE_DATE_URL = SCHEDULE_URL + "dates/";

const useSchedule = (companyId: string | undefined) => {
    const [tableDataTimeslots, setTableDataTimeSlots] = useState<TimeSlot[]>([]);
    const [tableDataSchedule, setTableDataSchedule] = useState<PickupSchedule[]>([]);

    const findAvailableSchedule = async () => {
        try {
            const response = await axiosPrivate.get(`${SCHEDULE_URL}available/${companyId}`);
            setTableDataTimeSlots(response.data.freeTimeSlots);
            setTableDataSchedule(response.data.pickupSchedules)
        } catch (error: any) {
            toast.error("Failed to fetch schedule data");
            setTableDataSchedule([])
            setTableDataTimeSlots([])
        }
    }

    const planSchedule = async (scheduleId: number, equipmentSetId: string | undefined) => {
        try {
            const response = await axiosPrivate.post(`${SCHEDULE_URL}reserve/${scheduleId}/${equipmentSetId}`);
            toast.success(response.data.message);
            findAvailableSchedule()
        } catch (error: any) {
            toast.error("Failed to fetch schedule data");
        }
    }

    const planScheduleWithTime = async (date: string, time: string, equipmentSetId: string | undefined, timeSlots: TimeSlot[]) => {
        try {
            const selectedDateTime = new Date(`${date}T${time}`);
            const currentDate = new Date();
    
            if (selectedDateTime < currentDate) {
                toast.warning("Selected date and time should be in the future");
                return;
            }
    
            if (selectedDateTime.toDateString() === currentDate.toDateString()) {
                const currentTime = currentDate.getHours() * 60 + currentDate.getMinutes();
                const selectedTime = parseInt(time.split(":")[0]) * 60 + parseInt(time.split(":")[1]);
    
                if (selectedTime <= currentTime) {
                    toast.warning("Selected time should be in the future");
                    return;
                }
    
                // Check if the selected time fits in the available time slots
                const matchingTimeSlot = timeSlots.find(slot => {
                    const slotStartTime = new Date(`${date}T${slot.start}`);
                    const slotEndTime = new Date(`${date}T${slot.end}`);
                    return selectedDateTime >= slotStartTime && selectedDateTime <= slotEndTime;
                });
    
                if (!matchingTimeSlot) {
                    toast.warning("Selected time is not available");
                    return;
                }
            }
    
            const data: CreatePickupSchedule = {
                id: parseInt(companyId!),
                date: date,
                time: time,
                equipmentSetId: parseInt(equipmentSetId!)
            };
            const response = await axiosPrivate.post(`${SCHEDULE_URL}create/user-defined`, data );
            if(response.data.status === 200)
                toast.success(response.data.message);
            findAvailableSchedule();
        } catch (error: any) {
            console.log(error);
            // toast.warning("Failed to create schedule");
        }
    };

    const getTimeSlotsByCompanyAndDate = async (date: string) => {
        try {
            const response = await axiosPrivate.get(`${SCHEDULE_DATE_URL}free-time-slots/${companyId}/${date}`);
            setTableDataTimeSlots(response.data.timeSlots)
        } catch (error: any) {
            toast.error("Failed to fetch schedule data");
        }
    }

    useEffect(() => {
        findAvailableSchedule()
    }, [])

    return {
        tableDataTimeslots,
        tableDataSchedule,
        findAvailableSchedule,
        planSchedule,
        planScheduleWithTime,
        getTimeSlotsByCompanyAndDate
    };
};

export default useSchedule;
