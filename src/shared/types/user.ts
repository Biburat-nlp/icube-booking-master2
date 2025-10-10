export type TUser = {
    id: number;
    email: string;
    is_staff: boolean;
    avatar: string;
    first_name: string;
    last_name: string;
    messenger_link: string;
    organization: string;
    thumb: string | null;
    username: string | null;
    work_day_start: string;
    work_day_end: string;
};
