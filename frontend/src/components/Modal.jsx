// import { createPortal } from 'react-dom';
// import { useState } from 'react';

// const Modal = ({ children, onClose }) => {
//     const [show, setShow] = useState(false);

//     const modalContent = (
//         <div onClick={e => e.stopPropagation}>
//             {children}
//         </div>
//     );

//     const modal = (
//         <div className="fixed bg-gray-700/75 flex items-center" onClick={onClose}>
//             {modalContent}
//         </div>
//     );

//     return (
//         <div onClick={() => setShow(!show)}>
//             {show && createPortal(modal, document.body)}
//         </div>
//     );
// };

// export default Modal;

import { createPortal } from 'react-dom';
import { useEffect } from 'react';

const Modal = ({ children, onClose }) => {
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
};

export default Modal;
