let showErrorCallback: ((message: string) => void) | undefined;

export const setShowErrorCallback = (callback: (message: string) => void) => {
    showErrorCallback = callback;
};

export const notifyError = (message: string) => {
    if (showErrorCallback) {
        showErrorCallback(message);
    }
};
