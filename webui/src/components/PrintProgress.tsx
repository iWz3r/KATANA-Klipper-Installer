import { useState, useEffect } from 'react';

interface PrintProgressProps {
    printer: any;
}

export default function PrintProgress({ printer }: PrintProgressProps) {
    const [progress, setProgress] = useState(0);
    const [filename, setFilename] = useState('');
    const [eta, setEta] = useState<string | null>(null);
    const [layer, setLayer] = useState<{ current: number; total: number } | null>(null);

    const status = printer?.status || 'idle';
    
    useEffect(() => {
        if (status === 'printing') {
            fetchPrintStatus();
        }
    }, [status, printer]);

    const fetchPrintStatus = async () => {
        try {
            const response = await fetch('/api/print_stats');
            const data = await response.json();
            
            if (data.result) {
                const info = data.result;
                setFilename(info.filename || 'Unknown');
                
                if (info.progress !== undefined) {
                    setProgress(info.progress * 100);
                }
                
                if (info.print_duration !== undefined && info.total_duration !== undefined) {
                    const remaining = info.total_duration - info.print_duration;
                    if (remaining > 0) {
                        const hours = Math.floor(remaining / 3600);
                        const minutes = Math.floor((remaining % 3600) / 60);
                        setEta(`${hours}h ${minutes}m`);
                    } else {
                        setEta('Calculating...');
                    }
                }
                
                if (info.current_layer && info.total_layers) {
                    setLayer({
                        current: info.current_layer,
                        total: info.total_layers
                    });
                }
            }
        } catch (err) {
            console.error('Failed to fetch print stats:', err);
        }
    };

    if (status !== 'printing' && status !== 'paused') {
        return (
            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>🖨️</span>
                <span>No active print</span>
            </div>
        );
    }

    const isPaused = status === 'paused';

    return (
        <div style={{ padding: '1rem' }}>
            <div className="print-filename" title={filename}>
                {filename.split('/').pop()}
            </div>

            <div className="progress-container">
                <div className="progress-bar">
                    <div 
                        className="progress-fill" 
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="progress-text">
                    <span>{progress.toFixed(1)}%</span>
                    {eta && <span>ETA: {eta}</span>}
                </div>
            </div>

            {layer && (
                <div className="layer-info">
                    <span>Layer {layer.current} / {layer.total}</span>
                    <div className="layer-bar">
                        <div 
                            className="layer-fill" 
                            style={{ width: `${(layer.current / layer.total) * 100}%` }}
                        />
                    </div>
                </div>
            )}

            <div className="print-status">
                <span className={`status-badge ${isPaused ? 'paused' : 'printing'}`}>
                    {isPaused ? '⏸ PAUSED' : '▶ PRINTING'}
                </span>
            </div>

            <style>{`
                .print-filename {
                    font-weight: bold;
                    margin-bottom: 1rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-size: 0.9rem;
                }
                .progress-container {
                    margin-bottom: 1rem;
                }
                .progress-bar {
                    height: 8px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 4px;
                    overflow: hidden;
                    margin-bottom: 0.5rem;
                }
                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, var(--color-primary), #0af);
                    border-radius: 4px;
                    transition: width 0.5s ease;
                    box-shadow: 0 0 10px var(--color-primary-glow);
                }
                .progress-text {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.8rem;
                    font-family: monospace;
                    color: var(--text-secondary);
                }
                .layer-info {
                    margin-bottom: 1rem;
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                }
                .layer-bar {
                    height: 4px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 2px;
                    margin-top: 0.3rem;
                    overflow: hidden;
                }
                .layer-fill {
                    height: 100%;
                    background: #fc0;
                    border-radius: 2px;
                }
                .print-status {
                    text-align: center;
                }
                .status-badge {
                    display: inline-block;
                    padding: 0.4rem 1rem;
                    border-radius: 4px;
                    font-size: 0.8rem;
                    font-weight: bold;
                    letter-spacing: 1px;
                }
                .status-badge.printing {
                    background: rgba(0,255,100,0.15);
                    color: #5f5;
                    border: 1px solid rgba(0,255,100,0.3);
                }
                .status-badge.paused {
                    background: rgba(255,200,0,0.15);
                    color: #fc0;
                    border: 1px solid rgba(255,200,0,0.3);
                }
            `}</style>
        </div>
    );
}
