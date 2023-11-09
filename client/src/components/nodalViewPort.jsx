import React, { Suspense, useEffect, useState } from 'react';
import axios from 'axios';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const Node = ({ position }) => (
  <mesh position={position}>
    <sphereGeometry args={[1, 32, 32]} />
    <meshStandardMaterial color="orange" />
  </mesh>
);

const App = () => {
    const [nodes, setNodes] = useState([]);
  
    useEffect(() => {
      const fetchNodes = () => {
        fetch('http://localhost:3001/collectCharacters', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Failed to fetch nodes');
            }
            return response.json();
          })
          .then((data) => {
            setNodes(data);
          })
          .catch((error) => {
            console.error('Error fetching nodes:', error);
          });
      };
  
      fetchNodes();
    }, []);

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Suspense fallback={null}>
        {nodes.map((node, index) => (
          <Node key={index} position={node.position} />
        ))}
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
}

export default App;