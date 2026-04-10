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
    const buttonRef = useRef(null)
    const winRecordedRef = useRef(false)

    const gameWon = dice.every(die => die.isHeld) &&
        dice.every(die => die.value === dice[0].value)
        
    useEffect(() => {
        if (gameWon) {
            buttonRef.current.focus()
        }
    }, [gameWon])

    useEffect(() => {
        if (gameWon) {
            return
        }

        const timer = setInterval(() => {
            setElapsedSeconds(oldSeconds => oldSeconds + 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [gameWon])

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
        if (!gameWon) {
            setDice(oldDice => oldDice.map(die =>
                die.isHeld ?
                    die :
                    { ...die, value: Math.ceil(Math.random() * 6) }
            ))
        } else {
            setDice(generateAllNewDice())
            setElapsedSeconds(0)
        }
    }

    function hold(id) {
        setDice(oldDice => oldDice.map(die =>
            die.id === id ?
                { ...die, isHeld: !die.isHeld } :
                die
        ))
    }

    const diceElements = dice.map(dieObj => (
        <Die
            key={dieObj.id}
            value={dieObj.value}
            isHeld={dieObj.isHeld}
            hold={() => hold(dieObj.id)}
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
            <main>
                {gameWon && <Confetti />}
                <div aria-live="polite" className="sr-only">
                    {gameWon && <p>Congratulations! You won! Press "New Game" to start again.</p>}
                </div>
                <h1 className="title">Tenzies</h1>
                <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
                <p className="timer">Time: {formatElapsedTime(elapsedSeconds)}</p>
                <div className="dice-container">
                    {diceElements}
                </div>
                <button ref={buttonRef} className="roll-dice" onClick={rollDice}>
                    {gameWon ? "New Game" : "Roll"}
                </button>
            </main>

            <aside className="attempts-panel" aria-live="polite">
                <h2>Attempt History</h2>
                {attemptHistory.length === 0 ? (
                    <p className="empty-attempts">No completed attempts yet.</p>
                ) : (
                    <ul className="attempts-list">
                        {attemptElements}
                    </ul>
                )}
            </aside>
        </div>
    )
}