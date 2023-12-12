import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import HomeScreen from './views/homeScreen'
import ChatScreen from './views/chatScreen'
import QrCodeScreen from './views/qrCodeScreen'
import MicrositeFrame from './components/MicrositeFrame'
import CameraView from './components/CameraVeiwPort'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<MicrositeFrame />} />
        <Route path='/camera' element={<CameraView />} />
        <Route path='/home' element={<HomeScreen />} />
        <Route path='/chat' element={<ChatScreen />} />
        <Route path='/qrcode' element={<QrCodeScreen />} />
      </Routes>
    </Router>
  )
}

export default App
