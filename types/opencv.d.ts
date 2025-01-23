declare namespace cv {
  class Mat {
    constructor();
    delete(): void;
    empty(): boolean;
    size(): Size;
    roi(rect: Rect): Mat;
    convertTo(dst: Mat, type: number): void;
  }

  class MatVector {
    constructor();
    delete(): void;
    size(): number;
    get(index: number): Mat;
    push_back(mat: Mat): void;
  }

  class KeyPoint {
    constructor();
    delete(): void;
    pt: Point;
  }

  class DMatch {
    constructor();
    delete(): void;
    distance: number;
    queryIdx: number;
    trainIdx: number;
  }

  class KeyPointVector {
    constructor();
    delete(): void;
    size(): number;
    get(index: number): KeyPoint;
    push_back(kp: KeyPoint): void;
  }

  class DMatchVector {
    constructor();
    delete(): void;
    size(): number;
    get(index: number): DMatch;
  }

  interface Size {
    width: number;
    height: number;
  }

  interface Point {
    x: number;
    y: number;
  }

  interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
  }

  // Constants
  const CV_8U: number;
  const CV_8UC3: number;
  const CV_32F: number;
  const NORM_L2: number;

  // Functions
  function imread(imageSource: string | HTMLImageElement): Mat;
  function imshow(canvasSource: string | HTMLCanvasElement, mat: Mat): void;
  function cvtColor(src: Mat, dst: Mat, code: number): void;
  function SIFT_create(): Feature2D;
  function BFMatcher_create(normType?: number): DescriptorMatcher;
}

declare interface Feature2D {
  detect(image: cv.Mat, mask?: cv.Mat): cv.KeyPointVector;
  compute(image: cv.Mat, keypoints: cv.KeyPointVector, descriptors: cv.Mat): void;
}

declare interface DescriptorMatcher {
  match(queryDescriptors: cv.Mat, trainDescriptors: cv.Mat): cv.DMatchVector;
  knnMatch(queryDescriptors: cv.Mat, trainDescriptors: cv.Mat, k: number): cv.DMatchVector[];
}

declare module "*.wasm" {
  const content: any;
  export default content;
} 