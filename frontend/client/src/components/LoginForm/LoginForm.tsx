import { useEffect, useState } from "react";
// @ts-ignore
import "./LoginForm.css";
import { useNavigate } from "react-router";

interface LoginData {
    nickname: string;
    color: string;
}

export default function LoginForm() {
    const [loginData, setLoginData] = useState<LoginData>({ nickname: "", color: "" });
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [colors, setColors] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchColors = async function () {
            try {
                setIsLoading(true);
                const response = await fetch('http://localhost:5000/api/colors');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setColors(data.colors);
                console.log(data);
            } catch (error) {
                if (error instanceof Error) {
                    setErrorMessage(error.message);
                } else {
                    setErrorMessage("Ошибка загрузки");
                }
            } finally {
                setIsLoading(false);
            }
        }
        fetchColors();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Фронт-енд валидация
        if (!loginData.nickname.trim()) {
            setErrorMessage("Введите никнейм");
            return;
        }

        if (!loginData.color) {
            setErrorMessage("Выберите цвет");
            return;
        }

        console.log(loginData);

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            })

            const data = await response.json();
            console.log(data);

            if (!response.ok) {
                if (data.errors) {
                    const errorText = data.errors
                        .map((err: any) => `${err.field}: ${err.message}`)
                        .join('. ');
                    setErrorMessage(errorText);
                } else if (data.message) {
                    setErrorMessage(data.message);
                }
                return; // Важно! Не переходить на /game при ошибке
            }

            // Успех — переходим в игру
            navigate('/game', {state: data.nickname});

        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Ошибка отправки");
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setLoginData(prev => ({ ...prev, [name]: value }));
        // Очищаем ошибку при изменении полей
        if (errorMessage) {
            setErrorMessage("");
        }
    };

    if (isLoading) {
        return <div className="loading">Загрузка цветов...</div>;
    }

    return (
        <div className="login-form">
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="nickname">Никнейм:</label>
                    <input
                        type="text"
                        id="nickname"
                        name="nickname"
                        value={loginData.nickname}
                        onChange={handleChange}
                        placeholder="Никнейм (3-20 символов)"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="color">Цвет:</label>
                    <select
                        id="color"
                        name="color"
                        value={loginData.color}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>Выберите цвет</option>
                        {colors.map((color, index) => (
                            <option key={index} value={color}>{color}</option>
                        ))}
                    </select>
                </div>

                <button type="submit">Вперед</button>
            </form>

            {errorMessage && (
                <div className="login-form-error">
                    {errorMessage}
                </div>
            )}
        </div>
    );
}