import clsx from "clsx";
import { useEffect, useState } from "react";

import type { TSelectTreeNodeExtended } from "@/entities/offices/hooks/useOfficeFilters.ts";

import ArrowTopIcon from "@/shared/icons/ArrowTopIcon.svg?react";
import { DateTimeRangePicker } from "@/shared/ui/DateTimeRangePicker/DateTimeRangePicker.tsx";
import { SelectTree } from "@/shared/ui/SelectTree/SelectTree.tsx";
import type { TSwitchValue } from "@/shared/ui/SwitchItems/SwitchItems.tsx";
import { SwitchItems } from "@/shared/ui/SwitchItems/SwitchItems.tsx";

import styles from "./Filter.module.scss";
type TProps = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    officesData: TSelectTreeNodeExtended[];
    datesFilter: { datetime_start: string; datetime_end: string };
    setDatesFilter: (date: any) => void;
    dateTimeFilterLabel: string;
    switchItems?: Array<{ label: string; value: string }>;
    onChangeFilterSwitch?: (state: boolean, value: TSwitchValue) => void;
    pushToRouteCache: (value: Record<string, unknown>) => void;
    selectedSpace: string | undefined;
    handleSelectWorkSpace: (data: TSelectTreeNodeExtended) => void;
    isHideFilter?: boolean;
};

export const Filter = ({
    isOpen,
    setIsOpen,
    officesData,
    datesFilter,
    setDatesFilter,
    switchItems,
    onChangeFilterSwitch,
    pushToRouteCache,
    selectedSpace,
    handleSelectWorkSpace,
    isHideFilter,
}: TProps) => {
    const [selectedDate, setSelecetedDate] = useState<{ datetime_start: Date | string; datetime_end: Date | string }>({
        datetime_start: new Date(datesFilter.datetime_start).toISOString(),
        datetime_end: new Date(datesFilter.datetime_end).toISOString(),
    });

    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const dateFromParams = { datetime_start: datesFilter.datetime_start, datetime_end: datesFilter.datetime_end };

        if (JSON.stringify(selectedDate) !== JSON.stringify(dateFromParams)) {
            setDatesFilter(selectedDate);
            pushToRouteCache(selectedDate);
        }
    }, [selectedDate]);

    return (
        <div
            className={clsx(styles.filter, { [styles.hide]: !isOpen })}
            id={isOpen ? "filter-open" : ""}
        >
            <div className={styles.wrapper}>
                <div className={styles.container}>
                    <button
                        type="button"
                        onClick={handleClick}
                        className={styles.hideBtn}
                    >
                        <ArrowTopIcon className={clsx(styles.icon, { [styles.rotateIcon]: !isOpen })} />
                    </button>
                </div>
                <SelectTree
                    options={officesData}
                    value={selectedSpace}
                    onSelect={handleSelectWorkSpace}
                />
                {!isHideFilter && (
                    <DateTimeRangePicker
                        value={selectedDate}
                        cb={setSelecetedDate}
                    />
                )}
                {!!switchItems && onChangeFilterSwitch && (
                    <SwitchItems
                        values={switchItems}
                        onChange={onChangeFilterSwitch}
                    />
                )}
            </div>
        </div>
    );
};
