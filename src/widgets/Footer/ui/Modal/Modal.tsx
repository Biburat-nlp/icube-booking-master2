import { BottomModal } from "@/shared/ui/Modal/BottomModal/BottomModal.tsx";

import { FooterModalContent } from "@/widgets/Footer/ui/FooterModalContent/FooterModalContent.tsx";

import type { TModalTypes } from "@/widgets/Footer/types/types.ts";

type TProps = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    currentMode: TModalTypes;
    currentPath: string;
};

const Modal = ({ isOpen, setIsOpen, currentMode, currentPath }: TProps) => {
    return (
        <BottomModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            height={currentMode === "reservation" ? "30%" : "25%"}
        >
            <FooterModalContent
                currentPath={currentPath}
                currentMode={currentMode}
                closeModal={() => setIsOpen(false)}
            />
        </BottomModal>
    );
};

export default Modal;
