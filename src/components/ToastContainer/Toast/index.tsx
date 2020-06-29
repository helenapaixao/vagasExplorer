import React, { useEffect } from 'react';
import { Container } from './styles';

import {
    FiAlertCircle,
    FiXCircle,
    FiCheckCircle,
    FiInfo,
} from 'react-icons/fi';

import { ToastMessage, useToast } from '../../../hooks/toast';

interface ToastProps {
    message: ToastMessage;
    style: object;
}

const icons = {
    info: <FiInfo size={24} />,
    error: <FiAlertCircle size={24} />,
    sucess: <FiCheckCircle size={24} />,
};

const Toast: React.FC<ToastProps> = ({ message, style }) => {
    const { removeToast } = useToast();

    useEffect(() => {
        const timer = setTimeout(() => {
            removeToast(message.id);
        }, 3000);
        return () => {
            clearTimeout(timer);
        };
    }, [removeToast, message.id]);

    return (
        <Container  style={style} type={message.type} hasDescription={!!message.description}>
            {icons[message.type || 'info']}

            <div>
                <strong>{message.title}</strong>
                {message.description && <p>{message.description}</p>}
            </div>

            <button onClick={() => removeToast(message.id)} type="button">
                <FiXCircle size={18} />
            </button>
        </Container>
    );
};

export default Toast;
