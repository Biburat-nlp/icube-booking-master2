import { Switch } from "antd";
import { useTranslation } from "react-i18next";

import styles from "./SwitchItems.module.scss";

export type TSwitchValue = {
    label: string;
    value: string;
};

type TProps = {
    values: Array<{ label: string; value: string }>;
    onChange: (state: boolean, value: TSwitchValue) => void;
};

export const SwitchItems = ({ values, onChange }: TProps) => {
    const { t } = useTranslation();
    
    const handleOnChange = (state: boolean, value: TSwitchValue) => {
        onChange(state, value);
    };
    
    return (
        <div className={styles.switchItems}>
            {values.map((value) => (
                <div
                    key={value.label}
                    className={styles.item}
                >
                    <span className={styles.label}>{t(value.label)}</span>
                    <Switch onChange={(e) => handleOnChange(e, value)} />
                </div>
            ))}
        </div>
    );
};
