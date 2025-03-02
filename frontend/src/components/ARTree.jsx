import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const ARTree = () => {
  const [cameraStatus, setCameraStatus] = useState('Initializing...');
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const sceneInitialized = useRef(false);
  const streamRef = useRef(null);
  const navigate = useNavigate();

  // Function to properly clean up all resources
  const cleanupResources = () => {
    console.log("Starting thorough cleanup...");
    
    // 1. Stop our tracked stream
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => {
        track.stop();
        console.log("Explicitly tracked track stopped:", track.kind);
      });
      streamRef.current = null;
    }
    
    // 2. Clear the video source on our video element
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.load();
      console.log("Video element reset");
    }

    // 3. Find and stop ALL video streams in the document - this catches AR.js created videos
    document.querySelectorAll('video').forEach(videoElement => {
      if (videoElement.srcObject) {
        const mediaStream = videoElement.srcObject;
        const tracks = mediaStream.getTracks();
        tracks.forEach(track => {
          track.stop();
          console.log("Additional video track stopped:", track.kind);
        });
        videoElement.srcObject = null;
        videoElement.load();
      }
    });

    // 4. Remove only the A-Frame scene and its elements
    const scenes = document.querySelectorAll('a-scene[data-app-scene="true"]');
    scenes.forEach(scene => {
      scene.parentNode.removeChild(scene);
      console.log("A-Frame scene removed");
    });

    // 5. Clean up A-Frame global resources if they exist
    if (window.ARjs && window.ARjs.Context) {
      // AR.js might have its own context to clean up
      try {
        delete window.ARjs.Context;
        console.log("AR.js Context cleaned");
      } catch (e) {
        console.log("Couldn't clean AR.js Context:", e);
      }
    }
    
    sceneInitialized.current = false;
    console.log("Cleanup complete");
  };

  // Initialize A-Frame scene imperatively after the component mounts
  useEffect(() => {
    console.log("Component mounted");
    
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
      scene.setAttribute('arjs', 'sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;');
      scene.setAttribute('renderer', 'antialias: true; alpha: true;');
      scene.setAttribute('vr-mode-ui', 'enabled: false');
      scene.style.width = '100%';
      scene.style.height = '100vh';
      scene.style.position = 'absolute';
      scene.style.top = '0';
      scene.style.left = '0';
      scene.style.zIndex = '1';
      
      // Add a custom attribute to help identify our scene for cleanup
      scene.setAttribute('data-app-scene', 'true');
      
      // Create marker element
      const marker = document.createElement('a-marker');
      marker.setAttribute('preset', 'hiro');
      
      // Create a container entity for the entire tree to control orientation
      const treeContainer = document.createElement('a-entity');
      // Rotate the tree to be parallel with the Hiro marker
      // The Hiro marker is typically viewed from above, so rotate tree to match
      treeContainer.setAttribute('rotation', '-90 0 0');
      
      // Create tree elements
      const trunk = document.createElement('a-cylinder');
      trunk.setAttribute('position', '0 -1 0');
      trunk.setAttribute('radius', '0.25');
      trunk.setAttribute('height', '1.5');
      trunk.setAttribute('color', '#8B4513');
      
      const foliage1 = document.createElement('a-cone');
      foliage1.setAttribute('position', '0 0 0');
      foliage1.setAttribute('radius-bottom', '1.2');
      foliage1.setAttribute('radius-top', '0.2');
      foliage1.setAttribute('height', '1.8');
      foliage1.setAttribute('color', '#006400');
      
      const foliage2 = document.createElement('a-cone');
      foliage2.setAttribute('position', '0 1 0');
      foliage2.setAttribute('radius-bottom', '1.0');
      foliage2.setAttribute('radius-top', '0.2');
      foliage2.setAttribute('height', '1.5');
      foliage2.setAttribute('color', '#228B22');
      
      const foliage3 = document.createElement('a-cone');
      foliage3.setAttribute('position', '0 2 0');
      foliage3.setAttribute('radius-bottom', '0.8');
      foliage3.setAttribute('radius-top', '0.1');
      foliage3.setAttribute('height', '1.2');
      foliage3.setAttribute('color', '#32CD32');
      
      const ground = document.createElement('a-circle');
      ground.setAttribute('position', '0 -1.7 0');
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
      
      // Assemble the tree inside the container
      treeContainer.appendChild(trunk);
      treeContainer.appendChild(foliage1);
      treeContainer.appendChild(foliage2);
      treeContainer.appendChild(foliage3);
      treeContainer.appendChild(ground);
      
      // Add the tree container to the marker
      marker.appendChild(treeContainer);
      
      // Assemble the scene
      scene.appendChild(marker);
      scene.appendChild(camera);
      
      // Add to container
      containerRef.current.appendChild(scene);
      sceneInitialized.current = true;
      
      // Watch for scene-specific events
      scene.addEventListener('loaded', () => {
        console.log('A-Frame scene loaded');
      });
    };
    
    // Check if camera access is available
    const initializeCamera = () => {
      navigator.mediaDevices.enumerateDevices()
        .then(devices => {
          const videoDevices = devices.filter(device => device.kind === 'videoinput');
          const backCamera = videoDevices.find(device => device.label.toLowerCase().includes('back')) || videoDevices[0];

          const constraints = {
            video: { 
              deviceId: backCamera.deviceId ? { exact: backCamera.deviceId } : undefined,
              width: { ideal: 640 },
              height: { ideal: 480 }
            }
          };
          
          return navigator.mediaDevices.getUserMedia(constraints);
        })
        .then((stream) => {
          // Store stream in ref for later cleanup
          streamRef.current = stream;
          
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
        console.log("A-Frame loaded");
        initializeARScene();
        initializeCamera();
      })
      .catch((error) => {
        console.error('Failed to initialize AR scene:', error);
        setCameraStatus('AR initialization failed. Please refresh the page.');
      });

    // Handle navigation button press
    const handleBackButton = () => {
      cleanupResources();
      navigate('/garden');
    };

    // Event listener for Escape key
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        cleanupResources();
        console.log("Navigated via Escape key");
        navigate('/garden');
      }
    };

    // Prepare for page unload
    const handleBeforeUnload = () => {
      console.log("Page unloading, cleaning up...");
      cleanupResources();
    };

    // Add all event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Add a visibility change listener to handle when the page is hidden/shown
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        console.log("Page hidden, pausing camera");
        // Optionally pause camera when tab is not visible
        if (videoRef.current) {
          videoRef.current.pause();
        }
      } else {
        console.log("Page visible again");
        // Resume camera when tab is visible again
        if (videoRef.current) {
          videoRef.current.play().catch(e => console.error("Resume video error:", e));
        }
      }
    });

    // Cleanup function that runs when component unmounts
    return () => {
      console.log("Component unmounting, performing cleanup");
      cleanupResources();
      
      // Remove all event listeners
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleBeforeUnload);
    };
  }, [navigate]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {/* Container for AR Scene */}
      <div 
        ref={containerRef} 
        style={{ width: '100%', height: '100vh', position: 'relative' }}
      ></div>
      
      {/* Video element for our tracked stream */}
      <video
        ref={videoRef}
        style={{ display: 'none' }}
        muted
        playsInline
      ></video>
      
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
      
      {/* Back button */}
      <button
        onClick={() => {
          cleanupResources();
          navigate('/dashboard');
        }}
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          backgroundColor: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '10px 15px',
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer',
          zIndex: 1001
        }}
      >
        Exit AR (or press ESC)
      </button>
      
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