import Player from "../../types/game-entites/Player";
import cards from "../../data/cards";
import {JSX, useState} from "react";
// @ts-ignore
import "./PlayerList.css"

interface PlayerModalProps {
    player: Player | null;
    isOpen: boolean;
    onClose: () => void;
}

function PlayerModal({ player, isOpen, onClose }: PlayerModalProps) {
    if (!isOpen || !player) return null;

    return (
        <div className="modal-overlay-player" onClick={onClose}>
            <div className="modal-content-player" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header-player" style={{ borderBottom: `3px solid ${player.color}` }}>
                    <h2> {player.nickname} </h2>
                    <button className="modal-close-player" onClick={onClose}>×</button>
                </div>

                <div className="modal-body-player">
                    <div className="player-info-section">

                        <div className="info-row">
                            <span className="info-label">Баланс:</span>
                            <span className="info-value">${player.balance}</span>
                        </div>

                        <div className="info-row">
                            <span className="info-label">Позиция:</span>
                            <span className="info-value">{cards[player.position]?.name || "Неизвестно"}</span>
                        </div>
                    </div>

                    {player.ownerCards && player.ownerCards.length > 0 && (
                        <div className="cards-section-player">
                            <h3>Карты собственника:</h3>
                            <div className="cards-list-player">
                                {player.ownerCards.map((card, index) => (
                                    <div
                                        className="card-element-player"
                                        style={{ borderLeft: `5px solid ${card.color}` }}
                                    >
                                        {card.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

interface PlayerListProps {
    players: Player[];
}

export default function PlayerList(props: PlayerListProps): JSX.Element {
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    function showPlayerInfo(index: number) {
        const player = props.players[index];
        if (player) {
            setSelectedPlayer(player);
            setIsModalOpen(true);
        }
    }

    function closeModal() {
        setIsModalOpen(false);
        setSelectedPlayer(null);
    }

    return (
        <>
            <div className="player-list-container">
                <ul className="player-list">
                    {props.players.length === 0 ? (
                        <li className="no-players">Нет игроков онлайн</li>
                    ) : (
                        props.players.map((player, index) => (
                            <li
                                key={index}
                                className={player.makingStep ? "player-list-element-current-step" : "player-list-element"}
                                style={{ borderLeft: `4px solid ${player.color}` }}
                                onClick={() => showPlayerInfo(index)}
                            >
                                <div className="player-main-info">
                                    <span className="player-name">{player.nickname}</span>
                                    <span className="player-balance">${player.balance}</span>
                                </div>
                                <div className="player-secondary-info">
                                    <span className="player-position">{cards[player.position]?.name}</span>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>

            <PlayerModal
                player={selectedPlayer}
                isOpen={isModalOpen}
                onClose={closeModal}
            />
        </>)
}