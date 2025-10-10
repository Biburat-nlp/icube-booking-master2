import { Storage } from "@ionic/storage";
import { Drivers } from "@ionic/storage";

export const storage = new Storage({
    name: "__mydb",
    driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
});

let _isCreated = false;
export const initStorage = async (): Promise<void> => {
    if (!_isCreated) {
        await storage.create();
        _isCreated = true;
    }
};
