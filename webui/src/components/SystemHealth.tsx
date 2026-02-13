import { useKatanaLink, useGCodeStore, useServiceHealth } from '../lib/moonraker';

export default function SystemHealth() {
    const printer = useKatanaLink();
    const health = useServiceHealth();
    const { addLog } = useGCodeStore();

    // Online logic: must be connected to Moonraker
    const isOnline = printer && (printer as any).status !== 'offline';

    if (!isOnline) return (
        <div className="glass-panel health-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <div style={{ textAlign: 'center', color: '#f55', background: 'rgba(255,0,0,0.1)', padding: '2rem', borderRadius: '8px', border: '1px solid #f55' }}>
                <h2 style={{ margin: 0, fontSize: '2rem' }}>SYSTEM OFFLINE</h2>
                <p style={{ marginTop: '1rem', opacity: 0.8 }}>Waiting for Moonraker connection at ws://{window.location.hostname}:7125...</p>
            </div>
        </div>
    );

    const formatBytes = (bytes: number) => {
        if (!bytes) return "0 B";
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    return (
        <div className="glass-panel health-container">
            <div className="health-header">
                <h2>SYSTEM HEALTH</h2>
                <span className={`status-pill ${health.status === 'OK' ? 'ok' : 'err'}`}>
                    SYSTEM {health.status}
                </span>
            </div>

            <div className="health-grid">
                <div className="health-card">
                    <h3>Services</h3>
                    <div className="status-row">
                        <span>Klipper</span>
                        <span className={`chk ${printer?.status === 'ready' || printer?.status === 'printing' ? 'ok' : 'err'}`}>
                            ● {printer?.status?.toUpperCase() || 'UNKNOWN'}
                        </span>
                    </div>
                    <div className="status-row">
                        <span>Moonraker</span>
                        <span className="chk ok">● CONNECTED</span>
                    </div>
                </div>

                <div className="health-card">
                    <h3>Resources</h3>
                    <div className="res-row">
                        <span>CPU Load</span>
                        <div className="progress mini">
                            <div className={`fill ${health.cpu.usage > 80 ? 'warning' : ''}`} style={{ width: `${health.cpu.usage}%` }}></div>
                        </div>
                        <span className="val">{health.cpu.usage.toFixed(1)}%</span>
                    </div>
                    <div className="res-row">
                        <span>RAM Usage</span>
                        <div className="progress mini">
                            <div className="fill" style={{ width: `${(health.memory.used / health.memory.total) * 100}%` }}></div>
                        </div>
                        <span className="val">{formatBytes(health.memory.used)} / {formatBytes(health.memory.total)}</span>
                    </div>
                </div>

                <div className="health-card action-card">
                    <h3>Quick Actions</h3>
                    <button className="btn-action" onClick={() => addLog("FIRMWARE_RESTART", "command")}>
                        Restart Firmware
                    </button>
                    {/* Healer Disabled in Strict Mode */}
                    <button className="btn-action" disabled style={{ opacity: 0.3, cursor: 'not-allowed' }}>
                        AUTO-HEAL (DISABLED)
                    </button>
                </div>
            </div>

            <style>{`
                .health-container {
                     height: 100%;
                     overflow-y: auto;
                     padding: 1.5rem;
                 }
                 .health-header {
                     display: flex;
                     justify-content: space-between;
                     align-items: center;
                     margin-bottom: 2rem;
                     border-bottom: 1px solid rgba(255,255,255,0.1);
                     padding-bottom: 1rem;
                 }
                 .status-pill {
                     padding: 0.2rem 0.8rem;
                     border-radius: 99px;
                     border: 1px solid currentColor;
                     font-size: 0.8rem;
                     font-weight: bold;
                 }
                 .status-pill.ok { color: #5f5; background: rgba(0,255,100,0.1); }
                 .status-pill.err { color: #f55; background: rgba(255,0,0,0.1); }
                 
                 .health-grid {
                     display: grid;
                     grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                     gap: 1.5rem;
                 }
                 .health-card {
                     background: rgba(255,255,255,0.03);
                     border: 1px solid rgba(255,255,255,0.05);
                     padding: 1.5rem;
                     border-radius: 8px;
                 }
                 .health-card h3 {
                     margin-top: 0;
                     color: var(--color-primary);
                     font-size: 0.9rem;
                     text-transform: uppercase;
                 }
                 .status-row, .res-row {
                     display: flex;
                     justify-content: space-between;
                     align-items: center;
                     margin-bottom: 0.8rem;
                     font-family: monospace;
                     font-size: 0.9rem;
                 }
                 .chk.ok { color: #5f5; }
                 .chk.err { color: #f55; }
                 .progress.mini {
                     width: 100px;
                     height: 4px;
                     background: rgba(255,255,255,0.1);
                     border-radius: 2px;
                 }
                 .fill { height: 100%; background: var(--color-primary); }
                 .fill.warning { background: #fc0; }
                 
                 .btn-action {
                     width: 100%;
                     background: rgba(255,255,255,0.05);
                     border: 1px solid rgba(255,255,255,0.1);
                     color: white;
                     padding: 0.8rem;
                     margin-bottom: 0.5rem;
                     cursor: pointer; 
                 }
                 .btn-action:hover:not(:disabled) {
                      background: rgba(255,255,255,0.1);
                 }
            `}</style>
        </div>
    );
}
