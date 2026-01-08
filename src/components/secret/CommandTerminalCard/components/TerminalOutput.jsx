function TerminalOutput({ history, onFocusInput, outputRef }) {
  return (
    <div className="terminal-output" ref={outputRef} onClick={onFocusInput}>
      {history.map((entry, index) => (
        <div key={index} className={`terminal-line ${entry.type} ${entry.status || ''}`}>
          {entry.type === 'input' ? (
            <>
              <span className="prompt">$</span>
              <span className="command">{entry.text}</span>
            </>
          ) : (
            <pre className="output">{entry.text}</pre>
          )}
        </div>
      ))}
    </div>
  );
}

export default TerminalOutput;
