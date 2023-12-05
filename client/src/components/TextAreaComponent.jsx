import React, { useState } from 'react';

function TextAreaComponent({endpoint}) {
  const [text, setText] = useState('');

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      if (response.ok) {
        console.log('Data sent successfully');
        // Handle successful response
      } else {
        console.error('Error sending data');
        // Handle error response
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle network error
    }
  };

  return (
    <div>
      <textarea 
        value={text} 
        onChange={handleTextChange} 
        style={{ width: '100%', height: '150px', padding: '10px', marginTop: '10px' }}
      />
      <button 
        onClick={handleSubmit} 
        style={{ backgroundColor: 'green', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}
      >
        Send Editing Instructions
      </button>
    </div>
  );
}

export default TextAreaComponent;
