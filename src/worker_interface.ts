export const enum RequestType {
    SUPERVISED = 'supervised',
    UNSUPERVISED = 'unsupervised'
}

export interface WorkerRequest {
    readonly type: RequestType;
}

export interface WorkerResponse {
    readonly type: RequestType;
}

export interface UnsupervisedWorkerRequest  extends WorkerRequest {

}

export interface SupervisedWorkerRequest extends WorkerRequest {
    readonly inputs: Float32Array;
    readonly labels: Uint8Array;
}


export interface SupervisedWorkerResponse extends WorkerResponse {
    readonly weights: Float32Array;
    readonly generation: number;
}

export interface UnsupervisedWorkerResponse extends WorkerResponse {
    readonly weigths: Float32Array;
    readonly generation: number;
}
