import { IonDatetime } from "@ionic/react";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import styles from "./CalendarContent.module.scss";

type Highlight = {
    date: string;
};

type Props = {
    highlightedDates: Highlight[];
};

export const CalendarContent: React.FC<Props> = ({ highlightedDates }) => {
    const dtRef = useRef<HTMLIonDatetimeElement>(null);
    const { i18n } = useTranslation();

    useEffect(() => {
        const el = dtRef.current;
        if (!el) return;
        const sr = el.shadowRoot;
        if (!sr) return;

        if (!sr.querySelector("style[data-marker-style]")) {
            const style = document.createElement("style");
            style.setAttribute("data-marker-style", "true");
            style.textContent = `
        button[part="calendar-day"] { position: relative; }
        button[part="calendar-day"].my-marker::after {
          content: '';
          display: inline-block;
          position: absolute;
          bottom: 0px;
          left: 50%;
          transform: translateX(-50%);
          width: 6px;
          height: 6px;
          background: var(--ion-color-primary);
          border-radius: 50%;
          pointer-events: none;
          z-index: 1;
        }
      `;
            sr.appendChild(style);
        }

        const markerSet = new Set(highlightedDates.map((h) => h.date));

        const applyMarkers = () => {
            sr.querySelectorAll<HTMLElement>('button[part="calendar-day"]').forEach((btn) => {
                const day = btn.getAttribute("data-day")?.padStart(2, "0");
                const month = btn.getAttribute("data-month")?.padStart(2, "0");
                const year = btn.getAttribute("data-year");
                const iso = day && month && year ? `${year}-${month}-${day}` : null;
                if (iso && markerSet.has(iso)) btn.classList.add("my-marker");
                else btn.classList.remove("my-marker");
            });
        };

        applyMarkers();

        const observer = new MutationObserver(() => {
            applyMarkers();
        });
        observer.observe(sr, {
            subtree: true,
            attributeFilter: ["data-day", "data-month", "data-year"],
            attributes: true,
        });

        return () => {
            observer.disconnect();
        };
    }, [highlightedDates]);

    return (
        <div className={styles.container}>
            <IonDatetime
                ref={dtRef}
                className={styles.calendar}
                presentation="date"
                preferWheel={false}
                showDefaultTimeLabel={false}
                readonly
                locale={i18n.language}
            />
        </div>
    );
};
