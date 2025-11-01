import React, { useState, useEffect, useCallback } from 'react';

const volusCoords = [
    // V
    { x: 2, y: 7 }, { x: 2, y: 8 }, { x: 2, y: 9 }, { x: 3, y: 10 }, { x: 4, y: 9 }, { x: 4, y: 8 }, { x: 4, y: 7 },
    // O
    { x: 6, y: 7 }, { x: 6, y: 8 }, { x: 6, y: 9 }, { x: 6, y: 10 }, { x: 7, y: 10 }, { x: 8, y: 10 }, { x: 8, y: 9 }, { x: 8, y: 8 }, { x: 8, y: 7 }, { x: 7, y: 7 },
    // L
    { x: 10, y: 7 }, { x: 10, y: 8 }, { x: 10, y: 9 }, { x: 10, y: 10 }, { x: 11, y: 10 }, { x: 12, y: 10 },
    // U
    { x: 14, y: 7 }, { x: 14, y: 8 }, { x: 14, y: 9 }, { x: 14, y: 10 }, { x: 15, y: 10 }, { x: 16, y: 10 }, { x: 16, y: 9 }, { x: 16, y: 8 }, { x: 16, y: 7 },
    // S
    { x: 19, y: 7 }, { x: 18, y: 7 }, { x: 18, y: 8 }, { x: 19, y: 9 }, { x: 18, y: 10 }, { x: 17, y: 10 }
];


const SnakeGame = ({ onClose }) => {
    const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
    const [food, setFood] = useState({ x: 15, y: 15 });
    const [direction, setDirection] = useState('RIGHT');
    const [speed, setSpeed] = useState(200);
    const [gameOver, setGameOver] = useState(false);
    const [isVolusAnimation, setIsVolusAnimation] = useState(false);
    const gridSize = 22;
    const score = snake.length - 1;

    const changeDirection = useCallback((newDirection) => {
        setDirection(prev => {
            if (newDirection === 'UP' && prev === 'DOWN') return prev;
            if (newDirection === 'DOWN' && prev === 'UP') return prev;
            if (newDirection === 'LEFT' && prev === 'RIGHT') return prev;
            if (newDirection === 'RIGHT' && prev === 'LEFT') return prev;
            return newDirection;
        });
    }, []);

    const handleKeyDown = useCallback((e) => {
        if (isVolusAnimation) return;
        switch (e.key) {
            case 'ArrowUp':
                changeDirection('UP');
                break;
            case 'ArrowDown':
                changeDirection('DOWN');
                break;
            case 'ArrowLeft':
                changeDirection('LEFT');
                break;
            case 'ArrowRight':
                changeDirection('RIGHT');
                break;
            default:
                break;
        }
    }, [isVolusAnimation, changeDirection]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    useEffect(() => {
        if (gameOver || isVolusAnimation) return;

        if (score === 5) {
            setIsVolusAnimation(true);
            return;
        }

        const moveSnake = () => {
            setSnake(prev => {
                const newSnake = [...prev];
                const head = { ...newSnake[0] };

                switch (direction) {
                    case 'UP': head.y -= 1; break;
                    case 'DOWN': head.y += 1; break;
                    case 'LEFT': head.x -= 1; break;
                    case 'RIGHT': head.x += 1; break;
                    default: break;
                }

                if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
                    setGameOver(true);
                    return prev;
                }

                for (let i = 1; i < newSnake.length; i++) {
                    if (head.x === newSnake[i].x && head.y === newSnake[i].y) {
                        setGameOver(true);
                        return prev;
                    }
                }
                
                newSnake.unshift(head);

                if (head.x === food.x && head.y === food.y) {
                    setFood({
                        x: Math.floor(Math.random() * gridSize),
                        y: Math.floor(Math.random() * gridSize)
                    });
                    setSpeed(s => Math.max(50, s * 0.95));
                } else {
                    newSnake.pop();
                }
                
                return newSnake;
            });
        };

        const gameInterval = setInterval(moveSnake, speed);
        return () => clearInterval(gameInterval);
    }, [snake, direction, speed, food, gameOver, score, isVolusAnimation]);

    useEffect(() => {
        if (!isVolusAnimation) return;

        setGameOver(true);
        
        // Adiciona um atraso para a mensagem ser lida
        const messageTimeout = setTimeout(() => {
            let index = 0;
            const animationInterval = setInterval(() => {
                if (index < volusCoords.length) {
                    setSnake(prev => [...prev, volusCoords[index]]);
                    index++;
                } else {
                    clearInterval(animationInterval);
                    // Aumenta o tempo antes de fechar
                    setTimeout(() => {
                        onClose();
                    }, 4000); 
                }
            }, 50);

            // Guardar o intervalo para limpar
            return () => clearInterval(animationInterval);
        }, 2000); // Mostra a mensagem por 2 segundos

        return () => clearTimeout(messageTimeout);
    }, [isVolusAnimation, onClose]);

    const renderGrid = () => {
        const grid = [];
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const isSnake = snake.some(part => part && part.x === col && part.y === row);
                const isFood = food.x === col && food.y === row;
                grid.push(
                    <div
                        key={`${row}-${col}`}
                        style={{
                            width: '18px',
                            height: '18px',
                            backgroundColor: isSnake ? '#23d5ab' : isFood ? '#e73c7e' : 'var(--volus-dark-800)',
                            borderRadius: '2px',
                        }}
                    />
                );
            }
        }
        return grid;
    };

    const restartGame = () => {
        setSnake([{ x: 10, y: 10 }]);
        setFood({ x: 15, y: 15 });
        setDirection('RIGHT');
        setSpeed(200);
        setGameOver(false);
        setIsVolusAnimation(false);
    };

    return (
        <div
            style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                backgroundColor: 'rgba(10, 10, 20, 0.8)', display: 'flex',
                backdropFilter: 'blur(5px)',
                justifyContent: 'center', alignItems: 'center', zIndex: 1000,
            }}
            onClick={onClose}
        >
            <div
                style={{
                    padding: '2rem', background: 'linear-gradient(145deg, var(--volus-dark-900), #2c313a)', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)', textAlign: 'center',
                    border: '1px solid var(--volus-dark-700)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 className="crazy-text-shadow" style={{ color: 'var(--volus-emerald)', margin: 0, fontSize: '1.5rem' }}>Snake Game!</h2>
                    <div style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold' }}>
                        Pontos: <span style={{ color: 'var(--volus-emerald)' }}>{score}</span>
                    </div>
                </div>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${gridSize}, 18px)`,
                    border: '3px solid var(--volus-emerald)',
                    borderRadius: '5px',
                    padding: '5px',
                    position: 'relative',
                    background: 'var(--volus-dark-800)',
                    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)'
                }}>
                    {gameOver && !isVolusAnimation && (
                        <div style={overlayStyle}>
                            <h3>Fim de Jogo</h3>
                            <p>Pontuação: {score}</p>
                            <button onClick={restartGame} style={buttonStyle}>Recomeçar</button>
                        </div>
                    )}
                    {isVolusAnimation && (
                         <div style={{...overlayStyle, animation: 'fadeIn 1s'}}>
                            <p>Acho que não estamos aqui pra isso...</p>
                        </div>
                    )}
                    {renderGrid()}
                </div>
                
                {/* Controles Mobile */}
                <div style={{ marginTop: '1rem', display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(3, 1fr)', alignItems: 'center' }}>
                    <div></div>
                    <button onClick={() => changeDirection('UP')} style={controlButtonStyle}>↑</button>
                    <div></div>
                    <button onClick={() => changeDirection('LEFT')} style={controlButtonStyle}>←</button>
                    <button onClick={() => changeDirection('DOWN')} style={controlButtonStyle}>↓</button>
                    <button onClick={() => changeDirection('RIGHT')} style={controlButtonStyle}>→</button>
                </div>

                <button onClick={onClose} style={{...buttonStyle, marginTop: '1.5rem'}}>Fechar</button>
            </div>
        </div>
    );
};

const overlayStyle = {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', color: 'white',
    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
    borderRadius: '3px',
};

const buttonStyle = {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: 'var(--volus-emerald)',
    color: 'white',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '10px',
    transition: 'transform 0.2s, box-shadow 0.2s'
};

const controlButtonStyle = {
    ...buttonStyle,
    padding: '1.5rem',
    fontSize: '2rem',
    lineHeight: '1',
    marginTop: '0',
    background: 'var(--volus-dark-700)',
    boxShadow: '0 4px 10px rgba(0,0,0,0.4)'
};

export default SnakeGame;
