import { useState } from 'react';

// Mock File Data for development
const MOCK_FILES = [
    { name: "benchy_pla.gcode", size: 540231, modified: 1709234567, status: "ready" },
    { name: "calibration_cube.gcode", size: 12405, modified: 1708123456, status: "ready" },
    { name: "voron_part_fan.gcode", size: 892341, modified: 1707012345, status: "printed" },
];

export default function FileManager() {
    const [files, setFiles] = useState(MOCK_FILES);

    const handleDelete = (name: string) => {
        setFiles(prev => prev.filter(f => f.name !== name));
    };

    const handlePrint = (name: string) => {
        alert(`Starting print: ${name}`);
        // Here we would call printer.printFile(name)
    };

    return (
        <div className="glass-panel files-container">
            <div className="files-header">
                <h2>G-CODE LIBRARY</h2>
                <div className="actions">
                    <button className="btn-primary">UPLOAD</button>
                    <button className="btn-small">REFRESH</button>
                </div>
            </div>

            <div className="file-list">
                <div className="file-row header">
                    <span className="col-name">Filename</span>
                    <span className="col-size">Size</span>
                    <span className="col-date">Date</span>
                    <span className="col-actions">Actions</span>
                </div>
                {files.map(file => (
                    <div key={file.name} className="file-row item">
                        <span className="col-name file-icon">{file.name}</span>
                        <span className="col-size">{(file.size / 1024).toFixed(1)} KB</span>
                        <span className="col-date">{new Date(file.modified * 1000).toLocaleDateString()}</span>
                        <div className="col-actions">
                            <button className="btn-small action-print" onClick={() => handlePrint(file.name)}>PRINT</button>
                            <button className="btn-small action-del" onClick={() => handleDelete(file.name)}>DEL</button>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .files-container {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }
                .files-header {
                    padding: 1.5rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }
                .file-list {
                    padding: 1rem;
                    overflow-y: auto;
                }
                .file-row {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1fr 1.5fr;
                    padding: 0.8rem;
                    align-items: center;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                }
                .file-row.header {
                    font-weight: bold;
                    color: #888;
                    text-transform: uppercase;
                    font-size: 0.8rem;
                }
                .file-row.item:hover {
                    background: rgba(255,255,255,0.05);
                    border-radius: 6px;
                }
                .file-icon::before {
                    content: "📄";
                    margin-right: 0.5rem;
                }
                .action-print {
                    background: var(--color-primary);
                    color: #fff;
                    border: none;
                }
                .action-del {
                    background: #522;
                    color: #fcc;
                    border: none;
                    margin-left: 0.5rem;
                }
            `}</style>
        </div>
    );
}
