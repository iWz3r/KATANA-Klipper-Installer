
import { useState, useCallback, useEffect } from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// --- ROBUST IMPORT LOGIC FOR VITE/CJS ---
// The structure of 'GridLayout' varies depending on build (dev/prod) and bundler (Vite/Rollup)
// It might be the component itself (CJS default) or a module object with default property (ESM)
const RGL = (GridLayout as any).default || GridLayout;
const WidthProvider = (GridLayout as any).WidthProvider || (RGL as any).WidthProvider;

// Fallback: If WidthProvider is missing, use identity (won't be responsive but won't crash)
const ResponsiveGridLayout = WidthProvider ? WidthProvider(RGL) : RGL;

// Debug log to help diagnose if it fails again
console.log('DashboardLayout Debug:', {
    GridLayoutType: typeof GridLayout,
    RGLType: typeof RGL,
    HasWidthProvider: !!WidthProvider
});

// Local Type Definition (to avoid named import syntax error)
type Layout = {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    maxW?: number;
    minH?: number;
    maxH?: number;
    static?: boolean;
    isDraggable?: boolean;
    isResizable?: boolean;
};

type WidgetProps = {
    title: string;
    children: React.ReactNode;
    style?: React.CSSProperties;
};

// Generic Widget Wrapper
function Widget({ title, children, style, ...props }: WidgetProps) {
    return (
        <div
            style={{ ...style, display: 'flex', flexDirection: 'column' }}
            className="glass-panel"
            {...props}
        >
            <div className="widget-header cursor-move">
                <h3>{title}</h3>
                {/* Drag Handle Icon could go here */}
            </div>
            <div className="widget-content" style={{ flex: 1, overflow: 'hidden' }}>
                {children}
            </div>
            <style>{`
                .widget-header {
                    padding: 0.5rem 1rem;
                    background: rgba(255,255,255,0.05);
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    cursor: grab;
                }
                .widget-header:active { cursor: grabbing; }
                .widget-header h3 { margin: 0; font-size: 0.9rem; letter-spacing: 1px; color: #aaa; }
                .react-grid-item.react-grid-placeholder {
                    background: rgba(0, 255, 100, 0.2) !important;
                    border-radius: 8px;
                    opacity: 0.5;
                }
                .react-resizable-handle {
                    background: none;
                }
                .react-resizable-handle::after {
                    content: '';
                    position: absolute;
                    right: 3px;
                    bottom: 3px;
                    width: 8px;
                    height: 8px;
                    border-right: 2px solid rgba(255, 255, 255, 0.3);
                    border-bottom: 2px solid rgba(255, 255, 255, 0.3);
                    cursor: se-resize;
                }
            `}</style>
        </div>
    );
}

// Default Layout Config
const DEFAULT_LAYOUT: Layout[] = [
    { i: 'toolhead', x: 0, y: 0, w: 4, h: 6 },
    { i: 'thermals', x: 0, y: 6, w: 4, h: 6 },
    { i: 'viewport', x: 4, y: 0, w: 8, h: 10 },
    { i: 'job_status', x: 4, y: 10, w: 8, h: 4 },
];

// --- Mock Widgets ---
// (We will replace these with real components later)
const ToolheadWidget = () => (
    <div style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>X: 150.0</span><span>Y: 150.0</span><span>Z: 10.0</span>
        </div>
        <button className="btn-primary" style={{ width: '100%' }}>HOME ALL</button>
    </div>
);

const ViewportWidget = () => (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
        <span>LIVE FEED [OFFLINE]</span>
    </div>
);

export default function DashboardLayout() {
    const [layout, setLayout] = useState<Layout[]>(() => {
        const saved = localStorage.getItem('horizon_layout_v1');
        return saved ? JSON.parse(saved) : DEFAULT_LAYOUT;
    });

    const [isDraggable, setIsDraggable] = useState(false);

    const onLayoutChange = (newLayout: Layout[]) => {
        setLayout(newLayout);
        localStorage.setItem('horizon_layout_v1', JSON.stringify(newLayout));
    };

    const toggleEdit = () => setIsDraggable(!isDraggable);

    const resetLayout = () => {
        setLayout(DEFAULT_LAYOUT);
        localStorage.setItem('horizon_layout_v1', JSON.stringify(DEFAULT_LAYOUT));
    }

    return (
        <div className="dashboard-container" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="dashboard-controls" style={{ padding: '0.5rem 1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button className="btn-secondary" onClick={resetLayout}>RESET</button>
                <button className={`btn - primary ${isDraggable ? 'active' : ''} `} onClick={toggleEdit}>
                    {isDraggable ? 'SAVE LAYOUT' : 'EDIT LAYOUT'}
                </button>
            </div>

            <div style={{ flex: 1, overflow: 'auto' }}>
                <ResponsiveGridLayout
                    className="layout"
                    layout={layout}
                    cols={12}
                    rowHeight={30}
                    width={1200} // This is overridden by Valid WidthProvider usually, but good fallback
                    isDraggable={isDraggable}
                    isResizable={isDraggable}
                    onLayoutChange={onLayoutChange}
                    draggableHandle=".widget-header"
                    margin={[10, 10]}
                >
                    <div key="toolhead">
                        <Widget title="TOOLHEAD">
                            <ToolheadWidget />
                        </Widget>
                    </div>

                    <div key="thermals">
                        <Widget title="THERMALS">
                            <div style={{ padding: '1rem' }}>
                                <p>Nozzle: 200°C</p>
                                <p>Bed: 60°C</p>
                            </div>
                        </Widget>
                    </div>

                    <div key="viewport">
                        <Widget title="WEBCAM">
                            <ViewportWidget />
                        </Widget>
                    </div>

                    <div key="job_status">
                        <Widget title="JOB STATUS">
                            <div style={{ padding: '1rem' }}>
                                <strong>No active job</strong>
                            </div>
                        </Widget>
                    </div>

                </ResponsiveGridLayout>
            </div>
            <style>{`
                .active { border-color: #5f5; color: #5f5; }
            `}</style>
        </div>
    );
}
