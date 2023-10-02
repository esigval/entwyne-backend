import React from 'react';
import logo from './logo.png';  // Assuming you have a logo.png file in the same directory
import backgroundImage from './background.jpg';  // Assuming you have a background.jpg file in the same directory

const HomeScreen = () => {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <img src={logo} alt="Logo" style={styles.logo} />
      </header>
      <div style={styles.content}>
        <button style={styles.beginButton} onClick={() => console.log('Navigate to Chat Screen')}>
          Begin Project
        </button>
      </div>
      <footer style={styles.footer}>
        Copyright All Rights Reserved 2023
      </footer>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  header: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '200px',  // Adjust the dimensions as needed
  },
  content: {
    flex: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  beginButton: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  footer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
    color: '#fff',
    textAlign: 'center',
  },
};

export default HomeScreen;
