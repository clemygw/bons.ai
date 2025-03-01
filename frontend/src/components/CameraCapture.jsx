import { useState, useRef, useEffect } from 'react';

const CameraCapture = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  useEffect(() => {
    console.log('isCapturing state changed:', isCapturing);
    if (isCapturing && videoRef.current && stream) {
      console.log('Setting up video stream...');
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        console.log('Video metadata loaded, playing...');
        videoRef.current.play()
          .then(() => console.log('Video playing successfully'))
          .catch(err => {
            console.error('Error playing video:', err);
            setError('Failed to play video stream');
          });
      };
    }
  }, [isCapturing, stream]);

  const startCamera = async () => {
    try {
      console.log('Requesting camera access...');
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      
      console.log('Camera access granted:', mediaStream);
      setStream(mediaStream);
      setIsCapturing(true);
      setError(null);
      
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError(`Camera error: ${err.message}`);
      setIsCapturing(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCapturing(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(videoRef.current, 0, 0);
      
      ctx.filter = 'contrast(110%) brightness(105%)';
      ctx.drawImage(canvas, 0, 0);
      
      // Create blob and display image immediately
      canvas.toBlob((blob) => {
        setCapturedImage(URL.createObjectURL(blob));
        stopCamera();

        // Process the image in the background
        const formData = new FormData();
        formData.append('receipt', blob, 'receipt.jpg');

        fetch(`${import.meta.env.VITE_API_URL}/api/receipts/upload`, {
          method: 'POST',
          body: formData,
        })
          .then(response => {
            if (!response.ok) {
              return response.text().then(text => {
                console.error('Server response:', text);
                throw new Error(`Server error: ${response.status}`);
              });
            }
            return response.json();
          })
          .then(data => {
            if (data.success) {
              try {
                let resultData = data.data;
                // Remove markdown code block if present
                if (typeof resultData === 'string') {
                  // Extract just the JSON part by taking everything between the first { and last }
                  const jsonMatch = resultData.match(/\{[\s\S]*\}/);
                  if (jsonMatch) {
                    resultData = jsonMatch[0];
                  } else {
                    throw new Error('No valid JSON found in response');
                  }
                }
                const result = typeof resultData === 'string' ? JSON.parse(resultData) : resultData;
                setAnalysisResult(result);
                
                const calculatedTotal = result.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                if (Math.abs(calculatedTotal - result.amount) > 0.01) {
                  console.warn('Warning: Some items might be missing from the receipt analysis');
                }
              } catch (parseError) {
                console.error('Error parsing result:', data.data);
                setError('Failed to parse receipt analysis');
              }
            }
          })
          .catch(error => {
            console.error('Error uploading receipt:', error);
            setError('Failed to process receipt. Please try again.');
          });
      }, 'image/jpeg', 0.95);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {error && (
        <div className="text-red-500 mb-4">
          {error}
        </div>
      )}

      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-4">
          <p>Camera Status: {isCapturing ? 'Active' : 'Inactive'}</p>
        </div>

        {!isCapturing && !capturedImage && (
          <button
            onClick={startCamera}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Open Camera
          </button>
        )}

        {isCapturing && (
          <div className="relative" style={{ minHeight: '400px' }}>
            <p className="text-center mb-4">Camera is active</p>
            <div className="bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-auto"
                style={{ 
                  minHeight: '400px',
                  transform: 'scaleX(-1)'
                }}
              />
            </div>
            <button
              onClick={captureImage}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 
                       bg-blue-500 text-white px-6 py-3 rounded-full 
                       hover:bg-blue-600 shadow-lg"
            >
              Take Photo
            </button>
          </div>
        )}

        {capturedImage && (
          <div className="text-center">
            <img
              src={capturedImage}
              alt="Captured receipt"
              className="max-w-full h-auto rounded-lg mb-4"
            />
            <button
              onClick={() => {
                setCapturedImage(null);
                startCamera();
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Retake Photo
            </button>
          </div>
        )}

        {analysisResult && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Receipt Analysis</h3>
            <div className="space-y-2">
              <p><strong>Store:</strong> {analysisResult.merchant}</p>
              <p><strong>Date:</strong> {analysisResult.date || 'Not found'}</p>
              <p><strong>Total Amount:</strong> ${analysisResult.amount.toFixed(2)}</p>
              <p><strong>CO2 Emissions:</strong> {analysisResult.co2Emissions.toFixed(2)} kg</p>
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">Items:</h4>
                <ul className="space-y-1">
                  {analysisResult.items.map((item, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{item.name} (x{item.quantity})</span>
                      <span>${item.price.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default CameraCapture;