import React from 'react'
import logo from '../assets/images/logo.png'
import backgroundImage from '../assets/images/brett-garwood-asZVvgMGshc-unsplash.jpg'
import qrCodeImage from '../assets/images/QR_code_for_mobile_English_Wikipedia.svg.png'

const QrCodeScreen = () => {
  const handleDirectionsClick = () => {
    window.open('https://www.google.com/maps', '_blank')
  }

  return (
    <div style={styles.outerContainer}>
      <div style={styles.innerContainer}>
        <header style={styles.header}>
          <img src={logo} alt="Logo" style={styles.logo} />
          <h1 style={styles.headerText}>Scan This At Ace Hardware</h1>
        </header>
        <div style={styles.qrCodeContainer}>
          <img
            src={qrCodeImage}
            alt="QR Code"
            style={styles.qrCodeImage}
          />
        </div>
        <div style={styles.availabilityText}>
          <p>6 of 6 items Are Available At Ace Hardware</p>
        </div>
        <div style={styles.directionsButtonContainer}>
          <button style={styles.directionsButton} onClick={handleDirectionsClick}>
            Directions
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
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover'
  },
  innerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: '10px',
    maxWidth: '500px',
    height: '80vh',
    padding: '20px'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px'
  },
  logo: {
    width: '50px',
    height: '50px',
    marginRight: '10px'
  },
  headerText: {
    fontSize: '24px',
    margin: '0'
  },
  qrCodeContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px'
  },
  qrCodeImage: {
    maxWidth: '100%'
  },
  availabilityText: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px'
  },
  directionsButtonContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  directionsButton: {
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

export default QrCodeScreen
