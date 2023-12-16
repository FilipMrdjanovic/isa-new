export const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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