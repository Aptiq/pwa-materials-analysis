declare namespace cv {
  class Mat {
    constructor();
    delete(): void;
    empty(): boolean;
    size(): Size;
    roi(rect: Rect): Mat;
    convertTo(dst: Mat, type: number): void;
    copyTo(dst: Mat): void;
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
    size(): number;
    get(index: number): KeyPoint;
    delete(): void;
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

  // Constantes pour la conversion de couleur
  const COLOR_RGB2GRAY: number
  const COLOR_RGBA2GRAY: number
  const COLOR_BGR2GRAY: number
  const COLOR_BGRA2GRAY: number

  // Constantes pour les types de matrices
  const CV_8U: number
  const CV_8UC3: number
  const CV_32F: number
  const NORM_L2: number

  // Classes pour la détection de caractéristiques
  class AKAZE {
    constructor();
    detect(image: Mat, keypoints: KeyPointVector): void;
    compute(image: Mat, keypoints: KeyPointVector, descriptors: Mat): void;
  }

  // Functions
  function imread(imageSource: string | HTMLImageElement): Mat;
  function imshow(canvasSource: string | HTMLCanvasElement, mat: Mat): void;
  function cvtColor(src: Mat, dst: Mat, code: number): void;
  function BFMatcher_create(normType?: number): DescriptorMatcher;

  // Fonctions de dessin
  function circle(img: Mat, center: Point, radius: number, color: Scalar, thickness?: number): void;
  function drawKeypoints(image: Mat, keypoints: KeyPointVector, outImage: Mat, color?: Scalar): void;

  // Type pour les couleurs
  class Scalar {
    constructor(r: number, g: number, b: number, a?: number);
  }

  // Fonctions pour l'alignement d'images
  function findHomography(srcPoints: Point[], dstPoints: Point[], method: number): Mat;
  function warpPerspective(src: Mat, dst: Mat, M: Mat, dsize: Size): void;
  
  // Constantes
  const RANSAC: number;
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

declare module '@techstark/opencv-js' {
  export interface Mat {
    delete(): void
    rows: number
    cols: number
  }

  export interface Point2 {
    x: number
    y: number
  }

  export interface Size {
    width: number
    height: number
  }

  export interface Rect {
    x: number
    y: number
    width: number
    height: number
  }

  export interface KeyPoint {
    pt: Point2
    size: number
    angle: number
    response: number
    octave: number
    class_id: number
  }
} 