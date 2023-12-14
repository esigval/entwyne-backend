import React, { useState, useEffect } from 'react'
import logo from '../assets/images/logo.png'
import backgroundImage from '../assets/images/drew-beamer-kUHfMW8awpE-unsplash.jpg'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const renderMessage = (message, handleLinkClick) => {
  if (message.includes('[GetScannableCodeLink]')) {
    const parts = message.split('[GetScannableCodeLink]')
    return (
      <>
        {parts[0]}
        <div style={styles.purpleBox}>
          <Link
            to='/qrCode'
            style={styles.linkInsidePurpleBox}
            onClick={handleLinkClick}
          >
            Get Scannable Code
          </Link>
        </div>
        {parts[1]}
      </>
    )
  }
  return message
}

const ChatScreen = () => {
  const [message, setMessage] = useState('')
  const [chatHistory, setChatHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  useEffect(() => {
    const lastMessage = chatHistory[chatHistory.length - 1]

    if (
      lastMessage &&
      lastMessage.sender === 'server' &&
      lastMessage.message.includes('[GetScannableCodeLink]')
    ) {
      // Simulate a "fake" server message
      const simulatedServerMessage = {
        sender: 'server',
        message: 'Click the link above to get your scannable code!'
      }

      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        simulatedServerMessage
      ])
    }
  }, [chatHistory])
  const sendMessage = async () => {
    setLoading(true)
    // Send message to server
    setChatHistory((prevChatHistory) => [
      ...prevChatHistory,
      { sender: 'user', message }
    ])

    try {
      const response = await axios.post('http://localhost:3001/gpt', {
        sender: 'user',
        message: message
      })

      const { content } = response.data
      setLoading(false)

      // Append the server's response to chat history
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { sender: 'server', message: content }
      ])
      console.log('Server Response:', response.data)
    } catch (error) {
      setLoading(false)
      console.error('Error sending message:', error)
    }

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
        <p style={styles.messageText}>
          {renderMessage(message, handleLinkClick)}
        </p>
      </div>
    )
  }

  const handleLinkClick = () => {
    navigate('/qrCode')
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <img src={logo} alt='Logo' style={styles.logo} />
      </header>
      <main style={styles.mainContainer}>
        <div style={styles.innerChatContainer}>
          {chatHistory.map((chat, index) => {
            if (chat.sender === 'user') {
              return displayUserMessage(chat.message)
            } else {
              return displayServerMessage(chat.message)
            }
          })}
          {loading && (
            <div style={styles.loadingBubble}>
              <div style={styles.loadingAnimation}>...</div>
            </div>
          )}
        </div>
      </main>
      <footer style={styles.footer}>
        <div className='messageInputContainer'>
          <input
            type='text'
            placeholder='Type your message here'
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            style={styles.inputBox}
          />
          <button onClick={sendMessage} style={styles.sendButton}>
            Send
          </button>
        </div>
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
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 'calc(100% - 200px)'
  },
  innerChatContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '50%',
    height: '90%',
    overflowY: 'scroll',
    padding: '20px'
  },
  messageInputContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    height: '90%',
    overflowY: 'scroll',
    padding: '2px'
  },
  purpleBox: {
    backgroundColor: 'purple',
    padding: '10px',
    borderRadius: '5px',
    display: 'inline-block',
    margin: '5px'
  },
  linkInsidePurpleBox: {
    color: 'white',
    textDecoration: 'none'
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
    alignSelf: 'flex-end',
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
    marginRight: 'px',
    fontSize: '16px',
    backgroundColor: '#F1F0F0'
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
  },
  loadingBubble: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    alignSelf: 'flex-end',
    maxWidth: '60%',
    marginBottom: '10px'
  },
  loadingAnimation: {
    fontSize: '16px',
    animation: 'loadingEllipsis 1.5s infinite'
  },
  '@keyframes loadingEllipsis': {
    '0%': { content: "'.'" },
    '33%': { content: "'..'" },
    '66%': { content: "'...'" },
    '100%': { content: "'.'" }
  }
}

export default ChatScreen