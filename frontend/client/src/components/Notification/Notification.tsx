import {useSocket} from "../../config/SocketProvider";
import {useEffect, useState} from "react";
// @ts-ignore
import "./Notification.css"

interface MessageData {
    message: string,
    time: number,
    isPrivate: boolean,
}

interface Notification extends MessageData {
    id: string;
    isHiding: boolean;
}

export default function Notification() {
    const socket = useSocket()
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        const messageToAllHandler = async function (data: MessageData) {
            console.log(`Получил сообщение для всех: `, data)
            const newNotification: Notification = {
                ...data,
                id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
                isHiding: false
            };

            setNotifications(prev => [...prev, newNotification]);

            // Автоматическое удаление через 5 секунд
            setTimeout(() => {
                removeNotification(newNotification.id);
            }, 5000);
        }

        const privateMessageHandler = async function (data: MessageData) {
            console.log('Получил приватноесообщение: ', data)
            const newNotification: Notification = {
                ...data,
                id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
                isHiding: false
            };

            setNotifications(prev => [...prev, newNotification]);

            // Автоматическое удаление через 5 секунд
            setTimeout(() => {
                removeNotification(newNotification.id);
            }, 5000);
        }

        socket.on('message_to_all', messageToAllHandler);
        socket.on('private_message', privateMessageHandler);

        return () => {
            socket.off('message_to_all', messageToAllHandler)
            socket.off('private_message', privateMessageHandler);
        }
    }, [socket])

    const removeNotification = (id: string) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? {...notif, isHiding: true} : notif
            )
        );

        // Удаляем из DOM после анимации
        setTimeout(() => {
            setNotifications(prev => prev.filter(notif => notif.id !== id));
        }, 300);
    };

    const formatTime = (time: number) => {
        return new Date(time).toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    return (
        <div className="notifications-container">
            {notifications.map((note) => (
                <div
                    key={note.id}
                    className={`notification ${note.isHiding ? 'hiding' : ''}`}
                >
                    <div className="notification-content">
                        <div className="notification-message">
                            {note.message}
                        </div>
                        <div className="notification-time">
                            {formatTime(note.time)}
                        </div>
                    </div>

                    <button
                        className="notification-close"
                        onClick={() => removeNotification(note.id)}
                        aria-label="Закрыть уведомление"
                    >
                        ×
                    </button>

                    <div className="notification-progress"/>
                </div>
            ))}
        </div>
    )
}