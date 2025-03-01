import CameraCapture from '../components/CameraCapture';

const ReceiptUpload = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Receipt</h1>
      <CameraCapture />
    </div>
  );
};

export default ReceiptUpload;