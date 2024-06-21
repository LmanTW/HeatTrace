declare namespace Color {
    interface RGB {
        r: number;
        g: number;
        b: number;
    }
    function getGradientColor(value: number, colors: Color.RGB[]): Color.RGB;
}

declare function loadReplay(data: Buffer): Promise<Replay>;
type GameModes = 'standard' | 'taiko' | 'catch' | 'mania';
interface Replay {
    version: number;
    gameMode: GameModes;
    beatmapHash: string;
    replayHash: string;
    playerName: string;
    great: number;
    ok: number;
    meh: number;
    gekis: number;
    katus: number;
    misses: number;
    score: number;
    greatestCombo: number;
    perfect: boolean;
    cursor?: {
        xPositions: Float64Array;
        yPositions: Float64Array;
        timeStamps: Float64Array;
    };
}

interface HeatTraceOptions {
    width: number;
    height: number;
    style: HeatTraceStyle;
    imageFormat: 'png' | 'jpeg';
    videoFPS: number;
    videoSpeed: number;
    threads: number;
}
interface HeatTraceOptions_Optional {
    width?: number;
    height?: number;
    style?: HeatTraceStyle_Optional;
    imageFormat?: 'png' | 'jpeg';
    videoFPS?: number;
    videoSpeed?: number;
    threads?: number;
}
interface HeatTraceStyle {
    traceSize: number;
    heatBoost: number;
    cursor: {
        type: 'none' | 'color' | 'image';
        distribution: 'player' | 'replay';
        size: number;
        colors: Color.RGB[];
        images: string[];
    };
    background: {
        type: 'none' | 'color' | 'image';
        color: Color.RGB;
        image: string;
    };
    colors: Color.RGB[];
}
interface HeatTraceStyle_Optional {
    traceSize?: number;
    heatBoost?: number;
    cursor?: {
        type?: 'none' | 'color' | 'image';
        distribution?: 'player' | 'replay';
        size?: number;
        colors?: Color.RGB[];
        images?: string[];
    };
    background?: {
        type?: 'none' | 'color' | 'image';
        color?: Color.RGB[];
        image?: string;
    };
    colors?: Color.RGB[];
}

declare class export_default{
    private _Core;
    constructor(options?: HeatTraceOptions_Optional);
    initialize(): Promise<void>;
    loadReplays(replaysData: Buffer[], callback?: (info: {
        total: number;
        loaded: number;
    }) => any): Promise<{
        error: boolean;
        message?: string;
        data?: {
            failed: number;
        };
    }>;
    renderImage(callback?: (info: {
        type: 'calculatingHeatmap' | 'rendering';
        total: number;
        finished: number;
    }) => any): Promise<any>;
    renderVideo(dataPath: string, startFrame: number, progress?: (info: {
        type: 'calculatingHeatmap' | 'rendering' | 'encoding';
        total: number;
        finished: number;
    }) => any): Promise<string>;
}

export { Color, export_default as HeatTrace, type HeatTraceOptions, type HeatTraceOptions_Optional, type HeatTraceStyle, type HeatTraceStyle_Optional, type Replay, loadReplay };
