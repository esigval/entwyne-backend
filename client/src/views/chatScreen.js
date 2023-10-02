import React, { useState } from 'react'
import logo from '../assets/images/logo.png'
import backgroundImage from '../assets/images/brett-garwood-asZVvgMGshc-unsplash.jpg'
import { Link, useNavigate } from 'react-router-dom'

const ChatScreen = () => {
  const [message, setMessage] = useState('')
  const [chatHistory, setChatHistory] = useState([])
  const navigate = useNavigate()
  const sendMessage = () => {
    // Send message to server
    setChatHistory([...chatHistory, { sender: 'user', message }])
    setMessage('')
  }

  const displayUserMessage = (message) => {
    // Display user message as a chat bubble
    return (
      <div style={styles.userBubble}>
        <p style={styles.messageText}>{message}</p>
      </div>
    )
  }

  const displayServerMessage = (message) => {
    // Display message from server as a chat bubble
    return (
      <div style={styles.serverBubble}>
        <p style={styles.messageText}>{message}</p>
      </div>
    )
  }

  const handleLinkClick = () => {
    navigate('/qrCode')
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <img src={logo} alt="Logo" style={styles.logo} />
      </header>
      <main style={styles.chatContainer}>
        {chatHistory.map((chat, index) => {
          if (chat.sender === 'user') {
            return displayUserMessage(chat.message)
          } else {
            return displayServerMessage(chat.message)
          }
        })}
      </main>
      <footer style={styles.footer}>
        <input
          type="text"
          placeholder="Type your message here"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          style={styles.inputBox}
        />
        <button onClick={sendMessage} style={styles.sendButton}>
          Send
        </button>
        <Link to="/qrCode" style={styles.link} onClick={handleLinkClick}>
          Get Scannable Code
        </Link>
      </footer>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url(${backgroundImage})`,
    backgroundSize: 'cover'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '80px',
    backgroundColor: 'white'
  },
  logo: {
    width: '50px',
    height: '50px'
  },
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    height: 'calc(100% - 200px)',
    overflowY: 'scroll',
    padding: '200px'
  },
  userBubble: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    maxWidth: '60%',
    backgroundColor: '#DCF8C6',
    borderRadius: '10px',
    padding: '10px',
    marginBottom: '10px',
    margin: '0 30px'
  },
  serverBubble: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    maxWidth: '60%',
    backgroundColor: '#FFFFFF',
    borderRadius: '10px',
    padding: '10px',
    marginBottom: '10px'
  },
  messageText: {
    fontSize: '16px',
    margin: '0'
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '120px',
    backgroundColor: 'white',
    padding: '20px'
  },
  inputBox: {
    flex: '1',
    height: '40px',
    borderRadius: '20px',
    border: 'none',
    padding: '10px',
    marginRight: '10px',
    fontSize: '16px'
  },
  sendButton: {
    height: '40px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer'
  }
}

export default ChatScreen
