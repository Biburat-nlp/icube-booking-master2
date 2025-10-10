import { useState, useEffect } from "react";

export const useFilterOpen = (): boolean => {
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

    useEffect(() => {
        const checkForElement = () => {
            const exists = document.getElementById("filter-open") !== null;
            setIsFilterOpen(exists);
        };

        const observer = new MutationObserver(checkForElement);

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["id"],
        });

        checkForElement();

        return () => {
            observer.disconnect();
        };
    }, []);

    return isFilterOpen;
};
