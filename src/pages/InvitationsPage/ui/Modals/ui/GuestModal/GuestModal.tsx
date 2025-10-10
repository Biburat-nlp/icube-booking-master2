import { Select } from "antd";
import clsx from "clsx";
import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/ui/Button/Button";
import ValidatedIonInput from "@/shared/ui/Input/Input";
import { BottomModal } from "@/shared/ui/Modal/BottomModal/BottomModal";

import styles from "./GuestModal.module.scss";

// Document options will be translated dynamically in the component
const { Option } = Select;

export interface TLocalGuest {
    idByCreate: string;
    id?: number;
    first_name?: string;
    last_name?: string;
    middle_name?: string;
    organization?: string;
    email?: string;
    document_type?: string;
    document_number?: string;
    vehicle: {
        vehicle_model?: string;
        vehicle_number?: string;
    };
}

type TProps = {
    isOpen: boolean;
    onClose: () => void;
    setGuest: (guest: TLocalGuest) => void;
    currentGuest?: TLocalGuest;
};

export const GuestModal = ({ isOpen, onClose, setGuest, currentGuest }: TProps) => {
    const { t } = useTranslation();
    const [values, setValues] = useState<any>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    const documentOptions = [
        { id: "citizen_passport", label: t("document_types:citizen_passport") },
        { id: "international_passport", label: t("document_types:international_passport") },
        { id: "military_id", label: t("document_types:military_id") },
    ];

    const validateField = useCallback((id: string, value: string): boolean | void => {
        if (id === "vehicle_model" || id === "vehicle_number") return;

        const trimmed = value.trim();
        if (trimmed === "") {
            setErrors((prev) => ({ ...prev, [id]: t("validations:required") }));
            return false;
        }
        if (trimmed.length < 3) {
            setErrors((prev) => ({ ...prev, [id]: t("validations:min_length_error", { min: 3 }) }));
            return false;
        }

        setErrors((prev) => ({ ...prev, [id]: "" }));
        return true;
    }, [t]);

    const isDisabled =
        !values.first_name?.trim() || !values.last_name?.trim() || Object.values(errors).some((msg) => msg !== "");

    const handleSave = () => {
        const idByCreate = currentGuest?.idByCreate || crypto.randomUUID();

        (!values.vehicle.vehicle_model || !values.vehicle.vehicle_number) && delete values.vehicle;

        setGuest({
            idByCreate,
            ...currentGuest,
            ...values,
        } as TLocalGuest);
        onClose();
    };

    useEffect(() => {
        if (!isOpen) return;
        setValues({
            first_name: currentGuest?.first_name || "",
            last_name: currentGuest?.last_name || "",
            middle_name: currentGuest?.middle_name || "",
            organization: currentGuest?.organization || "",
            email: currentGuest?.email || "",
            document_type: currentGuest?.document_type || "",
            document_number: currentGuest?.document_number || "",
            vehicle: {
                vehicle_model: currentGuest?.vehicle?.vehicle_model || "",
                vehicle_number: currentGuest?.vehicle?.vehicle_number || "",
            },
        });
        setErrors({
            first_name: "",
            last_name: "",
            middle_name: "",
            organization: "",
            email: "",
            document_type: "",
            document_number: "",
        });
    }, [isOpen, currentGuest]);

    return (
        <BottomModal
            isOpen={isOpen}
            onClose={onClose}
            height="95%"
            className={styles.guestModal}
            closeIcon
        >
            <div className={styles.guestForm}>
                {[
                    { id: "first_name", label: t("profile:form:first_name") },
                    { id: "last_name", label: t("profile:form:last_name") },
                    { id: "middle_name", label: t("profile:form:middle_name") },
                    { id: "organization", label: t("profile:form:organization") },
                    { id: "email", label: t("profile:form:email") },
                    { id: "document_type", label: t("profile:form:document_type"), type: "select", options: documentOptions },
                    { id: "document_number", label: t("profile:form:document_number") },
                    { id: "vehicle_model", groupId: "vehicle", label: t("profile:form:vehicle_model") },
                    { id: "vehicle_number", groupId: "vehicle", label: t("profile:form:vehicle_number") },
                ].map((f) => {
                    const isGrouped = Boolean(f.groupId);

                    const currentValue = isGrouped
                        ? (values[f.groupId!]?.[f.id] as string) || ""
                        : (values[f.id] as string) || "";

                    return f.type === "select" ? (
                        <Select
                            key={f.id}
                            className={styles.select}
                            style={{ width: "100%" }}
                            placeholder={f.label}
                            value={currentValue || undefined}
                            onChange={(v) =>
                                setValues((prev: any) => ({
                                    ...prev,
                                    [f.id]: v,
                                }))
                            }
                        >
                            {f.options!.map((opt) => (
                                <Option
                                    key={opt.id}
                                    value={opt.id}
                                >
                                    {opt.label}
                                </Option>
                            ))}
                        </Select>
                    ) : (
                        <div key={f.id}>
                            <ValidatedIonInput
                                type="text"
                                label={f.label}
                                labelPlacement="floating"
                                errorText={errors[f.id]}
                                className={styles.input}
                                clearInput
                                onValueChange={(v: string) =>
                                    setValues((prev: any) => ({
                                        ...prev,
                                        ...(isGrouped
                                            ? {
                                                  [f.groupId!]: {
                                                      ...((prev[f.groupId!] as Record<string, any>) || {}),
                                                      [f.id]: v,
                                                  },
                                              }
                                            : {
                                                  [f.id]: v,
                                              }),
                                    }))
                                }
                                validator={(v) => validateField(f.id, v)}
                                value={currentValue}
                            />
                        </div>
                    );
                })}
                <div className={styles.actions}>
                    <Button
                        style="primary"
                        onClick={onClose}
                    >
                        {t("common:buttons:cancel")}
                    </Button>
                    <Button
                        style="dark-green"
                        onClick={handleSave}
                        className={clsx({ [styles.disabled]: isDisabled })}
                        disabled={isDisabled}
                    >
                        {t("common:buttons:save")}
                    </Button>
                </div>
            </div>
        </BottomModal>
    );
};
