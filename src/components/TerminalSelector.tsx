import { Terminal } from "../types/Terminal";

type Props = {
  terminals: Terminal[];
  selectedTerminal: Terminal | null;
  onSelect: (terminal: Terminal) => void;
};

function TerminalSelector({ terminals, selectedTerminal, onSelect }: Props) {
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
          <span className={`status-dot ${terminal.hasOrder ? "green" : "red"}`} />
          {terminal.name}
        </button>
      ))}
    </div>
  );
}

export default TerminalSelector;