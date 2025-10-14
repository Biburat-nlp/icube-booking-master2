import { parseISO, set } from "date-fns";

export const combineDateAndTime = (isoDateStr: string, timeStr: string) => {
    try {
        const originalDate = parseISO(isoDateStr);

        const [hours, minutes, seconds] = timeStr.split(":").map(Number);

        const updatedDate = set(originalDate, { hours, minutes, seconds, milliseconds: 0 });

        return updatedDate;
    } catch (error) {
        return null;
    }
};
