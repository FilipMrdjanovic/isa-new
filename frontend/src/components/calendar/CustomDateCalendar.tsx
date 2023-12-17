import React from "react";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import { Badge } from "@mui/material";
import dayjs from "dayjs";
import { Dayjs } from "dayjs";

interface CustomDateCalendarProps {
  value: dayjs.Dayjs;
  onMonthChange: (date: Dayjs) => void;
  onDateClick: (date: Dayjs) => void;
  schedules: dayjs.Dayjs[];
  onChange?: (date: dayjs.Dayjs) => void; // Make onChange prop optional
  style?: React.CSSProperties; // Add style prop to accept CSS styles
}

function ServerDay(
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

const CustomDateCalendar: React.FC<CustomDateCalendarProps> = ({
  value,
  onMonthChange,
  onDateClick,
  schedules,
  style, // Accept style prop
}) => {
  return (
    <div style={style}>
      <DateCalendar
        sx={{ fontSize: "x-large" }}
        value={value}
        onMonthChange={onMonthChange}
        renderLoading={() => <DayCalendarSkeleton />}
        slots={{
          day: (props: any) => (
            <ServerDay
              {...props}
              highlightedDays={schedules.map((date) => dayjs(date).date())}
              onDateClick={onDateClick}
            />
          ),
        }}
      />
    </div>
  );
};

export default CustomDateCalendar;
