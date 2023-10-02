import React from 'react'
import logo from '../assets/images/logo.png'
import backgroundImage from '../assets/images/brett-garwood-asZVvgMGshc-unsplash.jpg'
import { useNavigate } from 'react-router-dom'

const HomeScreen = () => {
  const navigate = useNavigate()

  const handleBeginProject = () => {
    navigate('/chat')
  }
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <img
          src={logo}
          alt={'Logo'}
          style={styles.logo}
        />
      </header>
      <div style={styles.content}>
      <button style={styles.beginButton} onClick={handleBeginProject}>
          Begin Project
        </button>
      </div>
      <footer style={styles.footer}>
        {'Copyright All Rights Reserved 2023'}
      </footer>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  header: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    width: '200px'
  },
  content: {
    flex: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  beginButton: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer'
  },
  footer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
    color: '#fff',
    textAlign: 'center'
  }
}

export default HomeScreen
