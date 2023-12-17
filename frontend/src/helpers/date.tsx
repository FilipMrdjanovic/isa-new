import { Badge } from "@mui/material";
import { PickersDayProps, PickersDay } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";

export const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const formatDate = (date: Dayjs) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    return formattedDate;
};

export const convertTimeToRange = (timeString: any) => {
    const time = new Date(`1970-01-01T${timeString}`);
    return (time.getHours() * 60) + time.getMinutes();
};

export const convertRangeToTime = (rangeValue: any) => {
    const hours = Math.floor(rangeValue / 60);
    const minutes = rangeValue % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

export function ServerDay(
    props: PickersDayProps<Dayjs> & {
        highlightedDays?: number[];
        onDateClick: (date: Dayjs) => void;
    }
) {
    const {
        highlightedDays = [],
        day,
        outsideCurrentMonth,
        onDateClick,
        ...other
    } = props;

    const isSelected =
        !props.outsideCurrentMonth &&
        highlightedDays.indexOf(props.day.date()) >= 0;

    const handleDateClick = () => {
        onDateClick(day);
    };

    return (
        <Badge
            key={props.day.toString()}
            overlap="circular"
            badgeContent={isSelected ? "🔶" : undefined}
            onClick={handleDateClick}
        >
            <PickersDay
                {...other}
                outsideCurrentMonth={outsideCurrentMonth}
                day={day}
            />
        </Badge>
    );
}