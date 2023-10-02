import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import HomeScreen from './views/homeScreen'
import ChatScreen from './views/chatScreen'
import QrCodeScreen from './views/qrCodeScreen'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/chat" element={<ChatScreen />} />
        <Route path="/qrcode" element={<QrCodeScreen />} />
      </Routes>
    </Router>
  )
}

export default App
