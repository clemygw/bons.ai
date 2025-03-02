import React, { useEffect, useState, useRef } from 'react';
// Import A-Frame at the component level to avoid initialization issues
// A-Frame and React don't play well together with hot reloading

const ARTree = () => {
  const [cameraStatus, setCameraStatus] = useState('Initializing...');
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const sceneInitialized = useRef(false);

  // Initialize A-Frame scene imperatively after the component mounts
  useEffect(() => {
    // First load A-Frame scripts dynamically
    const loadAframe = () => {
      return new Promise((resolve) => {
        // Check if already loaded
        if (window.AFRAME) {
          return resolve();
        }
        
        const aframeScript = document.createElement('script');
        aframeScript.src = 'https://aframe.io/releases/1.4.0/aframe.min.js';
        aframeScript.onload = () => {
          const arjsScript = document.createElement('script');
          arjsScript.src = 'https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js';
          arjsScript.onload = resolve;
          document.head.appendChild(arjsScript);
        };
        document.head.appendChild(aframeScript);
      });
    };

    // Create and initialize the A-Frame scene
    const initializeARScene = () => {
      if (sceneInitialized.current || !containerRef.current) return;
      
      // Create scene element
      const scene = document.createElement('a-scene');
      scene.setAttribute('embedded', '');
      scene.setAttribute('arjs', 'sourceType: webcam; debugUIEnabled: true; detectionMode: mono_and_matrix; matrixCodeType: 3x3;');
      scene.setAttribute('renderer', 'antialias: true; alpha: true;');
      scene.setAttribute('vr-mode-ui', 'enabled: false');
      scene.style.width = '100%';
      scene.style.height = '100vh';
      scene.style.position = 'absolute';
      scene.style.top = '0';
      scene.style.left = '0';
      scene.style.zIndex = '1';
      
      // Create marker element
      const marker = document.createElement('a-marker');
      marker.setAttribute('preset', 'hiro');
      
      // Create tree elements
      const trunk = document.createElement('a-cylinder');
      trunk.setAttribute('position', '0 0.75 0');
      trunk.setAttribute('radius', '0.25');
      trunk.setAttribute('height', '1.5');
      trunk.setAttribute('color', '#8B4513');
      trunk.setAttribute('rotation', '0 0 0');
      
      const foliage1 = document.createElement('a-cone');
      foliage1.setAttribute('position', '0 2.2 0');
      foliage1.setAttribute('radius-bottom', '1.2');
      foliage1.setAttribute('radius-top', '0.2');
      foliage1.setAttribute('height', '1.8');
      foliage1.setAttribute('color', '#228B22');
      foliage1.setAttribute('rotation', '0 0 0');

      const foliage2 = document.createElement('a-cone');
      foliage2.setAttribute('position', '0 3 0');
      foliage2.setAttribute('radius-bottom', '1.0');
      foliage2.setAttribute('radius-top', '0.2');
      foliage2.setAttribute('height', '1.5');
      foliage2.setAttribute('color', '#32CD32');
      foliage2.setAttribute('rotation', '0 0 0');
      
      const foliage3 = document.createElement('a-cone');
      foliage3.setAttribute('position', '0 4 0');
      foliage3.setAttribute('radius-bottom', '0.8');
      foliage3.setAttribute('radius-top', '0.1');
      foliage3.setAttribute('height', '1.2');
      foliage3.setAttribute('color', '#006400');
      foliage3.setAttribute('rotation', '0 0 0');
      
      const ground = document.createElement('a-circle');
      ground.setAttribute('position', '0 0 0');
      ground.setAttribute('rotation', '-90 0 0');
      ground.setAttribute('radius', '1.5');
      ground.setAttribute('color', '#654321');
      
      // Create camera entity
      const camera = document.createElement('a-entity');
      camera.setAttribute('camera', '');
      
      // Add event listeners for markers
      marker.addEventListener('markerFound', () => {
        setCameraStatus('Marker Found - Tree Placed');
        console.log('Marker found!');
      });
      
      marker.addEventListener('markerLost', () => {
        setCameraStatus('Marker Lost - Find marker again');
        console.log('Marker lost!');
      });
      
      // Assemble the tree
      marker.appendChild(trunk);
      marker.appendChild(foliage1);
      marker.appendChild(foliage2);
      marker.appendChild(foliage3);
      marker.appendChild(ground);
    //   const treeModel = document.createElement('a-gltf-model');
    //   treeModel.setAttribute('src', './tree.gltf');
    //   treeModel.setAttribute('position', '0 0 0');
    //   treeModel.setAttribute('scale', '0.5 0.5 0.5');
    //   treeModel.setAttribute('rotation', '0 180 0');
    //   marker.appendChild(treeModel);
      
      // Assemble the scene
      scene.appendChild(marker);
      scene.appendChild(camera);
      
      // Add to container
      containerRef.current.appendChild(scene);
      sceneInitialized.current = true;
    };
    
    // Check if camera access is available
    const initializeCamera = () => {
        navigator.mediaDevices.enumerateDevices()
        .then(devices => {
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        const backCamera = videoDevices.find(device => device.label.toLowerCase().includes('back')) || videoDevices[0];

        const constraints = {
            video: { deviceId: backCamera.deviceId ? { exact: backCamera.deviceId } : undefined }
        };

        return navigator.mediaDevices.getUserMedia(constraints);
        })
        .then((stream) => {
        setCameraStatus('Camera Ready - Looking for marker');
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(e => console.error("Video play error:", e));
        }
        })
        .catch((err) => {
        setCameraStatus('Camera Access Denied: ' + err.message);
        });
    };
    
    // Main initialization
    loadAframe()
      .then(() => {
        initializeARScene();
        initializeCamera();
      })
      .catch((error) => {
        console.error('Failed to initialize AR scene:', error);
        setCameraStatus('AR initialization failed. Please refresh the page.');
      });
    
    // Cleanup function
    return () => {
      // Stop video stream if it exists
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
      
      // Remove the AR scene
      if (containerRef.current && sceneInitialized.current) {
        // Instead of removing child elements which can cause errors,
        // we'll replace the entire container content
        containerRef.current.innerHTML = '';
        sceneInitialized.current = false;
      }
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {/* Container for AR Scene */}
      <div 
        ref={containerRef} 
        style={{ width: '100%', height: '100vh', position: 'relative' }}
      ></div>
      
      {/* Debug video feed */}
      {/* <video
        ref={videoRef}
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          width: '200px',
          height: '150px',
          zIndex: 1000,
          border: '2px solid white',
          borderRadius: '5px',
          display: cameraStatus.includes('Camera Ready') ? 'block' : 'none'
        }}
        muted
        playsInline
      ></video> */}
      
      {/* Status overlay */}
      <div style={{
        position: 'fixed',
        top: '10px',
        left: '10px',
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        zIndex: 1001
      }}>
        Camera Status: {cameraStatus}
      </div>
      
      {/* Instructions */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        zIndex: 1001,
        textAlign: 'center',
        maxWidth: '80%'
      }}>
        Point your camera at a Hiro marker to place the AR tree
        <br />
        <a 
          href="https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/hiro.png" 
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#4fc3f7', marginTop: '8px', display: 'inline-block' }}
        >
          Click here to view/download the Hiro marker
        </a>
      </div>
    </div>
  );
};

export default ARTree;