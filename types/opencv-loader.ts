export function loadOpenCvScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Si OpenCV est déjà chargé, on résout directement
    if (window.cv) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = '/opencv/opencv.js'
    script.async = true
    script.onload = () => {
      // On attend que cv soit effectivement disponible
      const checkCv = () => {
        if (window.cv) {
          resolve()
        } else {
          setTimeout(checkCv, 10)
        }
      }
      checkCv()
    }
    script.onerror = () => reject(new Error('Failed to load OpenCV'))
    document.body.appendChild(script)
  })
}

export function isOpenCvLoaded(): boolean {
  return typeof window !== 'undefined' && !!window.cv
} 