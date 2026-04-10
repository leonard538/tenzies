export default function Player(props) {
    return (
        <li className="attempt-item">
            <span>{props.name}</span>
            <span>{props.time}</span>
        </li>
    )
}