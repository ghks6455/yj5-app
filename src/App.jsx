import { IoIosMenu } from "react-icons/io";
import { CiLogin } from "react-icons/ci";
import { GoSignIn } from "react-icons/go";
import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [userLocation, setUserLocation] = useState({});
  const [videoStream, setVideoStream] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(null);
  const [qrData, setQrData] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  //

  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
          },
        });

        setVideoStream(stream);
        setPermissionGranted(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (permissionGranted === null) {
      requestCameraPermission();
    }

    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, [permissionGranted, videoStream]);

  //

  useEffect(() => {
    if (qrData) {
      //데이터베이스에서 보내는 작업
      // toast.success(`${qrData} 성공`, {
      //   position: "top-center",
      //   autoClose: 5000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   theme: "light",
      // });
      alert("성공");
    }
  }, [qrData]);

  //

  useEffect(() => {
    if (videoStream) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const canvasContext = canvas.getContext("2d");

      const scan = () => {
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = videoWidth;
          canvas.height = videoHeight;
          canvasContext.clearRect(0, 0, canvas.width, canvas.height);
          canvasContext.drawImage(video, 0, 0, videoWidth, videoHeight);
          const imageData = canvasContext.getImageData(0, 0, videoWidth, videoHeight);

          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code) {
            setQrData(code.data);
          }
        }
        requestAnimationFrame(scan);
      };
      requestAnimationFrame(scan);
    }
  }, [permissionGranted, videoStream]);

  // 위도 경도 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      console.error("브라우저가 Geolocation API를 지원하지 않습니다. ");
    }
  }, []);

  console.log(userLocation);

  return (
    <div className="max-w-sm mx-auto w-full ">
      <div className="w-full flex justify-between">
        <div>
          <IoIosMenu size={28} />
        </div>
        <div className="flex gap-4">
          <p>
            <CiLogin size={28} />
          </p>
          <p>
            <GoSignIn size={28} />
          </p>
        </div>
      </div>
      <h1 className=" font-bold text-gray-900 py-4 text-center border-b border-gray-400">QR Scanner</h1>

      <div className="relative w-full h-[500px] border border-gray-400">
        <video
          className="absolute tip-0 left-0 w-full h-full"
          id="videoElement"
          ref={videoRef}
          autoPlay={true}
          playsInline
        ></video>
        <canvas className="absolute tip-0 left-0 w-full h-full" id="canvasElement" ref={canvasRef}></canvas>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
