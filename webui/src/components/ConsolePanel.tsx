import { useState, useRef, useEffect } from 'react';
import { useGCodeStore } from '../lib/moonraker';

export default function ConsolePanel() {
    const [input, setInput] = useState("");
    const { logs, addLog } = useGCodeStore();
    const bottomRef = useRef<HTMLDivElement>(null);
    // Removed unused printer access for now 

    // Auto-scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    const handleSend = () => {
        if (!input.trim()) return;

        // In real implementations, we call printer.sendGCode
        // For visual proto:
        addLog(`> ${input}`, 'command');

        // Simulate response for common commands
        if (input.toUpperCase() === "G28") {
            setTimeout(() => addLog("Homing...", "response"), 500);
            setTimeout(() => addLog("Home OK", "response"), 2500);
        } else {
            setTimeout(() => addLog("ok", "response"), 200);
        }

        setInput("");
    };

    return (
        <div className="glass-panel console-container">
            <div className="console-header">
                <h2>G-CODE TERMINAL</h2>
                <div className="console-actions">
                    <button className="btn-small" onClick={() => addLog("FIRMWARE RESTART...", "command")}>RESTART</button>
                    <button className="btn-small error" onClick={() => addLog("M112", "command")}>EMERGENCY</button>
                </div>
            </div>

            <div className="console-output">
                {logs.length === 0 && <div className="log-line info">Ready to receive commands.</div>}
                {logs.map((l, i) => (
                    <div key={i} className={`log-line ${l.type}`}>
                        <span className="timestamp">{new Date(l.time).toLocaleTimeString()}</span>
                        <span className="message">{l.message}</span>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            <div className="console-input-area">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Send G-Code..."
                />
                <button className="btn-primary" onClick={handleSend}>SEND</button>
            </div>

            <style>{`
                .console-container {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    overflow: hidden;
                }
                .console-header {
                    padding: 1rem;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .console-output {
                    flex: 1;
                    padding: 1rem;
                    overflow-y: auto;
                    font-family: monospace;
                    background: rgba(0,0,0,0.3);
                }
                .log-line {
                    margin-bottom: 4px;
                    display: flex;
                    gap: 1rem;
                }
                .log-line.command { color: #fff; font-weight: bold; }
                .log-line.response { color: #aaa; }
                .log-line.error { color: #f55; }
                .timestamp { color: #555; font-size: 0.8em; }
                
                .console-input-area {
                    display: flex;
                    padding: 1rem;
                    gap: 1rem;
                    background: rgba(0,0,0,0.5);
                }
                input {
                    flex: 1;
                    background: rgba(255,255,255,0.1);
                    border: 1px solid rgba(255,255,255,0.2);
                    color: white;
                    padding: 0.8rem;
                    border-radius: 4px;
                    font-family: monospace;
                }
                input:focus {
                    outline: none;
                    border-color: var(--color-primary);
                }
                .btn-small {
                    background: rgba(255,255,255,0.1);
                    border: none;
                    color: #fff;
                    padding: 0.4rem 0.8rem;
                    cursor: pointer;
                    margin-left: 0.5rem;
                    font-size: 0.8rem;
                    border-radius: 4px;
                }
                .btn-small.error {
                    background: #500;
                    color: #fcc;
                }

            `}</style>
        </div>
    );
}
