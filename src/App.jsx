import { IoIosMenu } from "react-icons/io";
import { CiLogin } from "react-icons/ci";

function App() {
  return (
    <>
      <div className="max-w-sm w-full mx-auto">
        <div className="w-full flex justify-between">
          <div>
            <IoIosMenu size={28} />
          </div>
          <div className="flex gap-4">
            <p>
              <CiLogin />
            </p>
            <p>signin</p>
          </div>
        </div>

        <h1 className=" font-bold text-red-500 py-4 text-center border-b border-gray-300">QR Scanner</h1>
      </div>
    </>
  );
}

export default App;
