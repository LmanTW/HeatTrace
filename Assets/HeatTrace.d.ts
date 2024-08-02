declare namespace Color {
    interface RGB {
        r: number;
        g: number;
        b: number;
    }
    function getGradientColor(value: number, colors: Color.RGB[]): Color.RGB;
}

interface HeatTrace_Style {
    heatBoost: number;
    traceSize: number;
    traceOpacity: [number, number];
    traceLength: number;
    colors: Color.RGB[];
    cursor: {
        type: 'none' | 'color' | 'image';
        distribution: 'player' | 'replay';
        size: number;
        opacity: number;
        colors: Color.RGB[];
        images: string[];
        imageAlign: 'start' | 'center';
    };
    background: {
        type: 'none' | 'color' | 'image';
        brightness: number;
        color: Color.RGB;
        image: string;
    };
}
interface HeatTrace_Style_Optional {
    heatBoost?: number;
    traceSize?: number;
    traceOpacity?: [number, number];
    traceLength?: number;
    colors?: Color.RGB[];
    cursor?: {
        type?: 'none' | 'color' | 'image';
        distribution?: 'player' | 'replay';
        size?: number;
        opacity?: number;
        colors?: Color.RGB[];
        images?: string[];
        imageAlign?: 'start' | 'center';
    };
    background?: {
        type?: 'none' | 'color' | 'image';
        brightness?: number;
        color?: Color.RGB;
        image?: string;
    };
}

interface HeatTrace_Options {
    width: number;
    height: number;
    style: HeatTrace_Style;
    imageFormat: 'png' | 'jpeg' | 'raw';
    imageQuality: number;
    videoFPS: number;
    videoSpeed: number;
    threads: number;
    maxFrameQueue: number;
    maxCursorTravelDistance: number;
}
interface HeatTrace_Options_Optional {
    width?: number;
    height?: number;
    style?: HeatTrace_Style_Optional;
    imageFormat?: 'png' | 'jpeg' | 'raw';
    imageQuality?: number;
    videoFPS?: number;
    videoSpeed?: number;
    threads?: number;
    maxFrameQueue?: number;
    maxCursorTravelDistance?: number;
}

interface RawCursorData {
    xPositions: Float64Array;
    yPositions: Float64Array;
    timeStamps: Float64Array;
}

declare function loadReplay(data: Buffer): Promise<Replay>;
interface Replay {
    version: number;
    gameMode: 'standard' | 'taiko' | 'catch' | 'mania';
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
    cursor?: RawCursorData;
}

declare class export_default{
    private _Core;
    constructor(options?: HeatTrace_Options_Optional);
    get state(): "none" | "initializing" | "initialized" | "terminating";
    get options(): HeatTrace_Options;
    initialize(progress?: (info: {
        type: 'loadingTextures' | 'startingWorkers';
    }) => any): Promise<{
        error: boolean;
        message?: string;
    }>;
    terminate(): Promise<void>;
    loadReplays(replays: Buffer[], progress?: (info: {
        total: number;
        finished: number;
    }) => any): Promise<{
        error: boolean;
        message?: string;
        data?: {
            loaded: number;
            failed: number;
        };
    }>;
    renderImage(frame?: undefined | number, progress?: (info: {
        type: 'calculatingHeatmaps' | 'renderingLayers' | 'encodingImage';
        total: number;
        finished: number;
    }) => any): Promise<Uint8Array>;
    renderVideo(cachePath: string, start?: undefined | number, end?: undefined | number, progress?: (info: {
        type: 'renderingFrames' | 'encodingVideo';
        total: number;
        finished: number;
    }) => any): Promise<string>;
}

export { export_default as HeatTrace, type HeatTrace_Options, type HeatTrace_Options_Optional, type HeatTrace_Style, type HeatTrace_Style_Optional, type Replay, loadReplay };
