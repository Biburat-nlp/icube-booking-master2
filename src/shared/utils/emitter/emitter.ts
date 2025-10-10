import mitt from "mitt";

import type { Emitter } from "mitt";

type Events = {
    isOpenCreateInvitation: void;
};

export const emitter: Emitter<Events> = mitt<Events>();
