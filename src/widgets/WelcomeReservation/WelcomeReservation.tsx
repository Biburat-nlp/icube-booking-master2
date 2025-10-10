import clsx from "clsx";
import { useTranslation } from "react-i18next";

import type { DateTimeFilter } from "@/shared/hooks/useFormattedDateTimeFilter.ts";
import { Button } from "@/shared/ui/Button/Button.tsx";
import { TooltipButton } from "@/shared/ui/TooltipButton/Tooltip.tsx";

import styles from "./WelcomeReservation.module.scss";

type TProps = {
    centerPosition: boolean;
    textFields: { [key: string]: string };
    selectedSpace: string | undefined;
    datesFilter: DateTimeFilter;
    popoverText: string;
    onClick: () => void;
};

export const WelcomeReservation = ({
    centerPosition,
    textFields,
    selectedSpace,
    datesFilter,
    popoverText,
    onClick,
}: TProps) => {
    const { t } = useTranslation();

    const allFields = !!selectedSpace && Object.values(datesFilter).length > 0;

    const handleClick = () => {
        allFields && onClick();
    };

    return (
        <div className={clsx(styles.container, { [styles.centerPosition]: centerPosition })}>
            <span className={styles.title}>{t(textFields.title)}</span>
            <p className={styles.text}>{t(textFields.text)}</p>
            <TooltipButton
                placement="top"
                title={t(popoverText)}
                visible={!allFields}
            >
                <Button
                    style="primary"
                    id="trigger-button"
                    onClick={handleClick}
                    className={styles.btn}
                >
                    {t(textFields.button)}
                </Button>
            </TooltipButton>
        </div>
    );
};
