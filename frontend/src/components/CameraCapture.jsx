import { useState, useRef, useEffect } from 'react';

const CameraCapture = ({ onUploadSuccess, onCancel, transactionId }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);
  const [stream, setStream] = useState(null);
  const [tempAnalysisResult, setTempAnalysisResult] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Start camera automatically when component mounts
  useEffect(() => {
    startCamera();
    // Cleanup function
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setStream(null);
      setIsCapturing(false);
      setCapturedImage(null);
      setTempAnalysisResult(null);
      setAnalysisResult(null);
    };
  }, []);

  useEffect(() => {
    if (isCapturing && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play()
          .catch(err => {
            console.error('Error playing video:', err);
            setError('Failed to play video stream');
          });
      };
    }
  }, [isCapturing, stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });
      
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

  const handleUploadSuccess = async (analysisResult) => {
    if (transactionId) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/transactions/${transactionId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            receiptUploaded: true,
            items: analysisResult.items,
            co2Emissions: analysisResult.co2Emissions,
            amount: analysisResult.amount,
          }),
        });
        
        onUploadSuccess?.(true);
      } catch (error) {
        console.error('Error updating transaction:', error);
        setError('Failed to update transaction with receipt data');
      }
    }
  };

  const handleConfirmResults = async () => {
    if (tempAnalysisResult && transactionId) {
      try {
        await handleUploadSuccess(tempAnalysisResult);
        setAnalysisResult(tempAnalysisResult);
        setTempAnalysisResult(null);
      } catch (error) {
        console.error('Error confirming results:', error);
        setError('Failed to update transaction with receipt data');
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setTempAnalysisResult(null);
    startCamera();
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
      
      canvas.toBlob((blob) => {
        setCapturedImage(URL.createObjectURL(blob));
        stopCamera();
        setIsProcessing(true);

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
          setIsProcessing(false);
          if (data.success) {
            try {
              let resultData = data.data;
              if (typeof resultData === 'string') {
                const jsonMatch = resultData.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                  resultData = jsonMatch[0];
                } else {
                  throw new Error('No valid JSON found in response');
                }
              }
              const result = typeof resultData === 'string' ? JSON.parse(resultData) : resultData;
              setTempAnalysisResult(result);
            } catch (parseError) {
              console.error('Error parsing result:', parseError);
              setError('Failed to parse receipt analysis');
            }
          }
        })
        .catch(error => {
          setIsProcessing(false);
          console.error('Error uploading receipt:', error);
          setError('Failed to process receipt. Please try again.');
        });
      }, 'image/jpeg', 0.95);
    }
  };

  const handleCancel = () => {
    stopCamera();
    onCancel?.(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {error && (
        <div className="text-red-500 mb-4">
          {error}
        </div>
      )}

      <div className="w-full mx-auto">
        {isCapturing && (
          <div className="relative">
            <div className="overflow-hidden rounded-lg">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ 
                  aspectRatio: '16/9',
                  background: '#000'
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

        {capturedImage && isProcessing && (
          <div className="text-center">
            <img
              src={capturedImage}
              alt="Processing receipt"
              className="w-full h-auto rounded-lg mb-4 max-h-[300px] object-contain"
            />
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
              <p className="text-gray-600">Processing receipt...</p>
            </div>
          </div>
        )}

        {capturedImage && tempAnalysisResult && !isProcessing && (
          <div className="text-center">
            <div className="bg-white rounded-lg shadow max-h-[600px] overflow-y-auto">
              <div className="sticky top-0 bg-white p-4 border-b">
                <h3 className="text-lg font-semibold">Receipt Analysis</h3>
              </div>
              <div className="p-4 space-y-2">
                <p><strong>Store:</strong> {tempAnalysisResult.merchant}</p>
                <p><strong>Total Amount:</strong> ${tempAnalysisResult.amount.toFixed(2)}</p>
                <p><strong>CO2 Emissions:</strong> {tempAnalysisResult.co2Emissions.toFixed(2)} kg</p>
                
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Items:</h4>
                  <ul className="space-y-1">
                    {tempAnalysisResult.items.map((item, index) => (
                      <li key={index} className="flex justify-between">
                        <span>{item.name} (x{item.quantity})</span>
                        <span>${item.price.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-3 mt-4">
              <button
                onClick={handleRetake}
                className="bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-600"
              >
                Retake Photo
              </button>
              <button
                onClick={handleConfirmResults}
                className="bg-emerald-500 text-white px-4 py-2 rounded-xl hover:bg-emerald-600"
              >
                Confirm Results
              </button>
              <button
                onClick={handleCancel}
                className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default CameraCapture;