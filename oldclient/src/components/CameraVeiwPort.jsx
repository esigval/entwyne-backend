import React, { useEffect, useRef, useState } from 'react'
import '../css/CamerView.css'

const CameraView = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [timer, setTimer] = useState(30) // 30 minutes in seconds
  const [recorder, setRecorder] = useState(null)
  const [chunks, setChunks] = useState([])
  const [blob, setBlob] = useState(null) // To keep track of the recorded blob

  const videoRef = useRef(null)
  const chunksRef = useRef([])

  const uploadToServer = async (videoBlob) => {
    const formData = new FormData();
    formData.append('video', videoBlob, 'recorded-video.webm');
  
    try {
      const response = await fetch('http://localhost:3001/collectMedia', { // Replace with your server endpoint
        method: 'POST',
        body: formData
      });
  
      if (!response.ok) {
        throw new Error('Server response was not ok');
      }
  
      const data = await response.json();
      console.log('Video uploaded:', data.message);
    } catch (error) {
      console.error('Upload error:', error);
    }
  };


  const downloadBlob = (downloadBlob) => {
    const a = document.createElement('a')
    document.body.appendChild(a)
    a.style.display = 'none'
    a.href = window.URL.createObjectURL(downloadBlob)
    a.download = 'recorded-video.webm'
    a.click()
    window.URL.revokeObjectURL(a.href)
  }

  const handleRecord = () => {
    if (!isRecording) {
      setIsRecording(true)

      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 0) {
            clearInterval(interval)
            setIsRecording(false)
            return 30 * 60 // reset to 30 minutes in seconds
          }
          return prevTimer - 1
        })
      }, 1000)

      const mediaRecorder = new MediaRecorder(videoRef.current.srcObject, {
        mimeType: 'video/webm; codecs=vp9,opus',
        audioBitsPerSecond: 128000
      })
      setRecorder(mediaRecorder)

      mediaRecorder.onstart = () => {
        console.log('Recording started')
      }

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        clearInterval(interval);
        console.log('Recording stopped');
    
        const newBlob = new Blob(chunksRef.current, { type: 'video/webm' });
        uploadToServer(newBlob);
        chunksRef.current = []; // Reset chunks
    };
    

      mediaRecorder.onerror = (e) => {
        console.error('Error during recording:', e)
      }

      mediaRecorder.start()
    } else {
      recorder.stop()
      setIsRecording(false)
    }
  }

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        })
        .catch((error) => {
          console.error('Error accessing the camera and microphone', error)
        })
    }
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [])

  return (
    <div className='camera-view'>
      <div className='camera-header'>Camera View PreRecord</div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className='camera-feed'
      ></video>
      <div className='camera-pre-record-container'>
        <div className='camera-content'>
          {!isRecording ? (
            <div className='left-instructions'>
              <div className='check-item'>
                <div className='checkmark'>✓</div>a Have Face in Center Thirds
              </div>
              <div className='check-item'>Sound Quality Good</div>
              <div className='check-item'>
                <div className='checkmark'>✓</div>
                Horizontal 16:9 Perspective
              </div>
            </div>
          ) : (
            <div className='timer'>
              {Math.floor(timer / 60)
                .toString()
                .padStart(2, '0')}
              :{(timer % 60).toString().padStart(2, '0')}
            </div>
          )}
        </div>
        <div className='camera-footer'>
          
        </div>
        <div className='record-button-container' onClick={handleRecord}>
        <div className='record-button'></div>
      </div>
      </div>
    </div>
  )
}

export default CameraView
