export interface WorkerRequest {
    readonly inputs: ArrayBuffer;
    readonly labels: ArrayBuffer;
}

export const enum ResponseType {
    PROGRESS,
    READY,
}

export interface WorkerResponse {
    readonly type: ResponseType;
}

export interface ProgressResponse extends WorkerResponse {
    readonly type: ResponseType.PROGRESS;
    readonly step: number;
    readonly totalSteps: number;
}

export interface ReadyResponse extends WorkerResponse {
    readonly type: ResponseType.READY;
    readonly weights: Float32Array;
    readonly generation: number;
}
