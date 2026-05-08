//@ts-ignore
import "./Board.css"
import Player from "../../types/game-entites/Player";
import {JSX, useState} from "react";
import cards from "../../data/cards";
import Card from "../Card/Card";

interface BoardProps {
    players: Player[];
}

export default function Board(props: BoardProps): JSX.Element {
    const bottomRow = cards.slice(0, 11); // 11 карточек снизу (включая угловые)
    const leftColumn = cards.slice(11, 20); // 9 карточек слева
    const topRow = cards.slice(20, 31); // 11 карточек сверху
    const rightColumn = cards.slice(31, 40); // 9 карточек справа

    const [winner, setWinner] = useState<Player | null>(null);
    return (
        <div className="monopoly-board">
            {/* Верхний ряд */}
            <div className="board-row top-row">
                {topRow.map((card) => (
                    <Card
                        key={card.position}
                        {...card}
                        orientation="horizontal"
                        players={props.players}
                    />
                ))}
            </div>

            <div className="board-middle">
                {/* Правая колонка */}
                <div className="board-column right-column">
                    {rightColumn.map((card) => (
                        <Card
                            key={card.position}
                            {...card}
                            orientation="vertical"
                            players={props.players}
                        />
                    ))}
                </div>

                {/* Центр поля */}
                <div className="board-center">
                    {winner?.nickname ? `Победил ${winner?.nickname}` : null}
                </div>

                {/* Левая колонка */}
                <div className="board-column left-column">
                    {leftColumn.map((card) => (
                        <Card
                            key={card.position}
                            {...card}
                            orientation="vertical"
                            players={props.players}
                        />
                    ))}
                </div>
            </div>

            {/* Нижний ряд */}
            <div className="board-row bottom-row">
                {bottomRow.map((card) => (
                    <Card
                        key={card.position}
                        {...card}
                        orientation="horizontal"
                        players={props.players}
                    />
                ))}
            </div>
        </div>
    );
}