import { createPortal } from 'react-dom';
import { useEffect } from 'react';

export default function Modal({ children, onClose }) {
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [onClose]);

    return createPortal(
        <div className="fixed inset-0 bg-gray-700/75 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white fixed p-4 pt-12 rounded" onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>,
        document.body
    );
}

