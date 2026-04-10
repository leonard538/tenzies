import { useState, useRef, useEffect } from "react"
import Die from "./Die"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"
import Player from "./player"

function formatElapsedTime(totalSeconds) {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0")
    const seconds = String(totalSeconds % 60).padStart(2, "0")
    return `${minutes}:${seconds}`
}

export default function App() {
    const [dice, setDice] = useState(() => generateAllNewDice())
    const [elapsedSeconds, setElapsedSeconds] = useState(0)
    const [attemptHistory, setAttemptHistory] = useState([])
    const [isGameActive, setIsGameActive] = useState(false)
    const buttonRef = useRef(null)
    const winRecordedRef = useRef(false)

    const gameWon = dice.every(die => die.isHeld) &&
        dice.every(die => die.value === dice[0].value)
        
    useEffect(() => {
        if (gameWon && isGameActive) {
            buttonRef.current.focus()
        }
    }, [gameWon, isGameActive])

    useEffect(() => {
        if (!isGameActive || gameWon) {
            return
        }

        const timer = setInterval(() => {
            setElapsedSeconds(oldSeconds => oldSeconds + 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [gameWon, isGameActive])

    useEffect(() => {
        if (gameWon && !winRecordedRef.current) {
            setAttemptHistory(oldAttempts => [
                ...oldAttempts,
                {
                    attempt: oldAttempts.length + 1,
                    time: formatElapsedTime(elapsedSeconds)
                }
            ])
            winRecordedRef.current = true
        }

        if (!gameWon) {
            winRecordedRef.current = false
        }
    }, [gameWon, elapsedSeconds])

    function generateAllNewDice() {
        return new Array(10)
            .fill(0)
            .map(() => ({
                value: Math.ceil(Math.random() * 6),
                isHeld: false,
                id: nanoid()
            }))
    }
    
    function rollDice() {
        if (!isGameActive) {
            return
        }

        if (!gameWon) {
            setDice(oldDice => oldDice.map(die =>
                die.isHeld ?
                    die :
                    { ...die, value: Math.ceil(Math.random() * 6) }
            ))
        } else {
            setDice(generateAllNewDice())
            setElapsedSeconds(0)
            setIsGameActive(false)
        }
    }

    function hold(id) {
        if (!isGameActive || gameWon) {
            return
        }

        setDice(oldDice => oldDice.map(die =>
            die.id === id ?
                { ...die, isHeld: !die.isHeld } :
                die
        ))
    }

    function startGame() {
        setDice(generateAllNewDice())
        setElapsedSeconds(0)
        setIsGameActive(true)
        winRecordedRef.current = false
    }

    function clearHistory() {
        setAttemptHistory([])
    }

    const diceElements = dice.map(dieObj => (
        <Die
            key={dieObj.id}
            value={dieObj.value}
            isHeld={dieObj.isHeld}
            hold={isGameActive ? () => hold(dieObj.id) : () => {}}
        />
    ))

    const attemptElements = attemptHistory.map(attempt => (
        <Player
            key={attempt.attempt}
            name={`Attempt ${attempt.attempt}`}
            time={attempt.time}
        />
    ))

    return (
        <div className="game-layout">
            {gameWon && <Confetti />}
            <aside className="side-panel how-to-play">
                <h2>How to Play</h2>
                <ol>
                    <li>Press "Start Game" to begin the timer and enable controls</li>
                    <li>Click "Roll" to roll all unfrozen dice</li>
                    <li>Click on a die to freeze/unfreeze it at its current value</li>
                    <li>Keep rolling until all 10 dice show the same number</li>
                    <li>Celebrate with confetti when you win! 🎉</li>
                </ol>
            </aside>
            <div className="main-wrapper">
                <main className={!isGameActive ? "main-disabled" : ""}>
                    <div aria-live="polite" className="sr-only">
                        {gameWon && <p>Congratulations! You won! Press "New Game" to start again.</p>}
                    </div>
                    <h1 className="title">Tenzies</h1>
                    <p className="timer">Time: {formatElapsedTime(elapsedSeconds)}</p>
                    <div className="dice-container">
                        {diceElements}
                    </div>
                    <button ref={buttonRef} className="roll-dice" onClick={rollDice} disabled={!isGameActive}>
                        {gameWon ? "New Game" : "Roll"}
                    </button>
                </main>

                {!isGameActive && (
                    <div className="start-overlay">
                        <button className="start-button" onClick={startGame}>Start Game</button>
                    </div>
                )}
            </div>

            <aside className="side-panel attempts-panel" aria-live="polite">
                <h2>Attempt History</h2>
                {attemptHistory.length === 0 ? (
                    <p className="empty-attempts">No completed attempts yet.</p>
                ) : (
                    <ul className="attempts-list">
                        {attemptElements}
                    </ul>
                )}
                <button
                    className="clear-history"
                    onClick={clearHistory}
                    disabled={attemptHistory.length === 0}
                >
                    Clear History
                </button>
            </aside>
        </div>
    )
}