import React from 'react'
import { useNavigate } from 'react-router-dom'

const HomeScreen = () => {
  const navigate = useNavigate()

  const handleBeginProject = () => {
    navigate('/chat')
  }

  return (
    <div style={styles.outerContainer}>
      <div style={styles.innerContainer}>
        <h1 style={styles.headerText}>Start Your Next Project</h1>
        <div style={styles.buttonContainer}>
          <button style={styles.beginButton} onClick={handleBeginProject}>
            +
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  outerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f2f2f2',
    backgroundSize: 'cover'
  },
  innerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '10px',
    maxWidth: '500px',
    height: '80vh',
    padding: '20px'
  },
  headerText: {
    fontSize: '36px',
    margin: '0',
    marginBottom: '20px'
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  beginButton: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    fontSize: '24px',
    color: '#fff',
    backgroundColor: '#add8e6', // light blue
    border: 'none',
    cursor: 'pointer'
  }
}

export default HomeScreen
