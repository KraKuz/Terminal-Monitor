import { Terminal } from "../types/Terminal";

type Props = {
  terminals: Terminal[];
  selectedTerminal: Terminal | null;
  onSelect: (terminal: Terminal) => void;
  statuses: Record<number, boolean>;
};

function TerminalSelector({ terminals, selectedTerminal, onSelect, statuses }: Props) {
  return (
    <div className="terminals-container">
      {terminals.map(terminal => (
        <button
          key={terminal.id}
          className={`terminal-button ${
            terminal.id === selectedTerminal?.id ? "active" : ""
          }`}
          onClick={() => onSelect(terminal)}
        >
          <span className={`status-dot ${statuses[terminal.id] ? "green" : "red"}`} />
          {terminal.name}
        </button>
      ))}
    </div>
  );
}

export default TerminalSelector;