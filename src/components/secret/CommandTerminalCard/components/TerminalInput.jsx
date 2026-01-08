function TerminalInput({ inputRef, input, onInputChange, onKeyDown, onSubmit }) {
  return (
    <form className="terminal-input-form" onSubmit={onSubmit}>
      <span className="prompt">$</span>
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        placeholder="Type a command..."
        className="terminal-input"
        autoComplete="off"
        spellCheck="false"
      />
    </form>
  );
}

export default TerminalInput;
