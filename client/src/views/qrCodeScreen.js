import React, { useState, useEffect } from 'react'
import qrCodeImage from '../assets/images/QR_code_for_mobile_English_Wikipedia.svg.png'

const QrCodeScreen = () => {
  const [creditCount, setCreditCount] = useState(1)
  const handleDirectionsClick = () => {
    window.open('https://www.google.com/maps', '_blank')
  }

  useEffect(() => {
    const maxCount = 10
    const interval = setInterval(() => {
      setCreditCount((prevCount) => {
        if (prevCount < maxCount) {
          return prevCount + 1
        }
        clearInterval(interval)
        return prevCount
      })
    }, 600) // 300ms * 10 steps = 3000ms or 3s

    return () => clearInterval(interval) // Cleanup on component unmount
  }, [])

  return (
    <div style={styles.outerContainer}>
      <div style={styles.innerContainer}>
        <header style={styles.header}></header>
        <div style={styles.qrCodeContainer}>
          <h1 style={styles.headerText}>Scan At Ace Hardware</h1>
          <div style={styles.availabilityTextContainer}>
            <p style={styles.addressText}>
              <i>660 NE 3rd St #1, Bend, OR 97701</i>
            </p>
            <p style={styles.availabilityText}>
              All items on your list are currently available at Ace Hardware.
            </p>

            <p style={styles.availabilityText}>Show this code to an employee</p>
            <p style={styles.availabilityText}>
              to be directed to the items on your list.
            </p>
          </div>
          <img src={qrCodeImage} alt='QR Code' style={styles.qrCodeImage} />
        </div>
        <div style={styles.directionsButtonContainer}>
          <button
            style={styles.directionsButton}
            onClick={handleDirectionsClick}
          >
            Directions
          </button>
        </div>
        <div style={styles.creditInfoContainer}>
          <h2 style={styles.creditNumber}>{creditCount} Pts Earned</h2>
          <p style={styles.creditText}>
            Points are Earned For Making Progress on Projects. Keep it up!
          </p>
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
    fontSize: '36px',
    margin: '0',
    align: 'center',
    justifyContent: 'center'
  },
  qrCodeContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50%',
    width: '100%'
  },
  addressText: {
    fontSize: '24px',
    fontStyle: 'italic',
    color: 'purple',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  qrCodeImage: {
    maxWidth: '80%',
    marginBottom: '40px'
  },
  availabilityText: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '2px'
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
  },
  creditInfoContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  creditNumber: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: 'purple'
  },
  creditText: {
    fontSize: '16px'
  }
}

export default QrCodeScreen
