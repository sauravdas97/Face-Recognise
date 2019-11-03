const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)


function startVideo() 
{
    navigator.getUserMedia(
      { video: {} },
      stream => video.srcObject = stream,
      err => console.error(err)
    )
}
video.addEventListener('play',() =>{
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const dispSize = {width : video.width, height: video.height}
  faceapi.matchDimensions(canvas,dispSize)
  setInterval(async() => {
    const detection = await faceapi.detectAllFaces(video,new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    console.log(detection);
    const resizeDetection = faceapi.resizeResults(detection,dispSize)
    canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height)
    faceapi.draw.drawDetections(canvas, resizeDetection)
    faceapi.draw.drawFaceLandmarks(canvas,resizeDetection)
    faceapi.draw.drawFaceExpressions(canvas,resizeDetection)
  },100)
  })
