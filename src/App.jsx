// 리액트 아이콘 라이브러리
import { IoIosMenu } from "react-icons/io";
import { CiLogin } from "react-icons/ci";
// 토스트 라이브러리
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";

function App() {
  const [userLocation, setUserLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [viedoStream, setViedoStream] = useState(null);
  const [permissonGranted, stePermissonGranted] = useState(null);
  const [qrData, setQrData] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // 카메라 촬영
  useEffect(() => {
    const requestCameraPermisson = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
          },
        });
        setViedoStream(stream);
        stePermissonGranted(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.log(error);
      }
      if (permissonGranted === null) {
        requestCameraPermisson();
      }

      return () => {
        if (viedoStream) {
          viedoStream.getTracks().forEach((track) => {
            track.stop();
          });
        }
      };
    };
  }, [permissonGranted, viedoStream]);
  // QR 코드 해석
  useEffect(() => {
    if (viedoStream) {
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
  }, [permissonGranted, viedoStream]);

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
      console.log("브라우저가 Geolocation API를 지원하지 않습니다. ");
    }
  }, []);
  console.log(userLocation);
  // QR 데이터 검증 및 전송
  useEffect(() => {
    if (qrData) {
      // 데이터베이스에서 보내는 작업

      // QR 인증 완료!
      // alert(`${qrData}`);
      toast.success(`🦄 ${qrData} 인증 성공!`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }, [qrData]);
  return (
    <>
      <div className="max-w-sm w-full mx-auto">
        <div className="w-full flex justify-between">
          <div>
            <IoIosMenu size={28} />
          </div>
          <div className="flex gap-4">
            <div>
              <CiLogin size={28} />
            </div>
            <p>signin</p>
          </div>
        </div>

        <h1 className=" font-bold text-red-500 py-4 text-center border-b border-gray-300">QR Scanner</h1>

        <div className="relative w-full h-[500px] border border-green-300">
          <video
            className="absolute top-0 left-0 w-full h-full"
            id="videoElement"
            ref={videoRef}
            autoPlay={true}
            playsInline
          ></video>
          <canvas className="absolute top-0 left-0 w-full h-full" id="canvasElement" ref={canvasRef}></canvas>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default App;
