export const enum RequestType {
    SUPERVISED = 'supervised',
    UNSUPERVISED = 'unsupervised'
}

export interface WorkerRequest {
    readonly type: RequestType;
}

export interface WorkerResponse {
    readonly type: RequestType;
    readonly weights: Float32Array;
    readonly generation: number;
}

export interface UnsupervisedWorkerRequest  extends WorkerRequest {

}

export interface SupervisedWorkerRequest extends WorkerRequest {
    readonly inputs: ArrayBuffer;
    readonly labels: ArrayBuffer;
}
