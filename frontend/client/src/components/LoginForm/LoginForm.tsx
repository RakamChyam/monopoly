import {useEffect, useState} from "react";
// @ts-ignore
import "./LoginForm.css";
import {useNavigate} from "react-router";

interface LoginData {
    nickname: string;
    color: string;
}

export default function LoginForm() {
    const API_URL = `${window.location.protocol}//${window.location.hostname}:5000/api`;
    const [loginData, setLoginData] = useState<LoginData>({nickname: "", color: ""});
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [colors, setColors] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchColors = async function () {
            try {
                setIsLoading(true);
                const response = await fetch(`${API_URL}/colors`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setColors(data.colors);
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
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // credentials: 'include',
                body: JSON.stringify(loginData),
            })

            const data = await response.json();

            if (!response.ok) {
                if (data.errors) {
                    const errorText = data.errors
                        .map((err: any) => `${err.message}`)
                        .join('. ');
                    setErrorMessage(errorText);
                } else if (data.message) {
                    setErrorMessage(data.message);
                }
                return;
            }

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
        const {name, value} = e.target;
        setLoginData(prev => ({...prev, [name]: value}));
        // Очищаем ошибку при изменении полей
        if (errorMessage) {
            setErrorMessage("");
        }
    };

    if (isLoading) {
        return <div className="loading">Загрузка цветов...</div>;
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="login-form">
                <div>
                    <input
                        type="text"
                        id="nickname"
                        name="nickname"
                        className="login-input"
                        value={loginData.nickname}
                        onChange={handleChange}
                        placeholder="Никнейм (3-20 символов)"
                        required
                    />
                </div>

                <div>
                    <select
                        id="color"
                        name="color"
                        className="color-select"
                        value={loginData.color}
                        onChange={handleChange}
                        required
                    >
                        <option value="">
                            {isLoading ? "Загрузка цветов..." : "Выберите цвет"}
                        </option>
                        {colors.map((color) => (
                            <option key={color} value={color} style={{
                                color: color,
                                fontWeight: 'bold',
                                padding: '10px'
                            }}>
                                {color}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" className={`submit-btn`}>Вперед</button>
            </form>

            {errorMessage && (
                <div className="login-form-error">
                    {errorMessage}
                </div>
            )}
        </div>
    );
}