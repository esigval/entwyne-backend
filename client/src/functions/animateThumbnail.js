const animateThumbnail = (path) => {
    const length = path.getTotalLength();
    let progress = 0;
  
    const animate = () => {
      progress += 1; // Adjust speed
      const point = path.getPointAtLength(progress);
      
      // Update thumbnail position
      // You need a way to access your thumbnail element and update its position
      thumbnail.style.transform = `translate(${point.x}px, ${point.y}px)`;
  
      if (progress < length) {
        requestAnimationFrame(animate);
      }
    };
  
    animate();
  };
  