import React, { useState } from "react";
import Input from "../../shared/ui/Input";
import Button from "../../shared/ui/Button";
import {
  generateQrisImage,
  readQrisImage,
  updateQris,
} from "../../shared/lib/handleQris";
import { useTimeout } from "./hook/useTimeout";

const DownloadButton = ({ imageBase64 }) => {
  return (
    <a
      href={imageBase64}
      download="QRIS_Merchant_Baru.png"
      className="w-full text-white bg-green-600 hover:bg-green-700 p-2 rounded-md block text-center mt-4 my-2"
    >
      Download QRIS
    </a>
  );
};

const Loading = () => (
  <div className="w-full text-white bg-yellow-500 hover:bg-yellow-600 p-2 rounded-md block text-center mt-4 my-2">
    Processing...
  </div>
);
const ErrorMessage = ({ message }) => (
  <div className="aboslute top-0 left-0 w-full text-white bg-red-500 hover:bg-red-600 p-2 rounded-md block text-center mt-4 my-2">
    {message}
  </div>
);

function generateQris() {
  const [originalQris, setOriginalQris] = useState("");
  const [newname, setNewname] = useState("");
  const [amount, setAmount] = useState("");
  const [isPending, setisPending] = useState(false);
  const [finalQris, setFinalQris] = useState("");
  const [value, showValue] = useTimeout(2000);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setisPending(true);
      // Proses QRIS di sini, misalnya dengan memanggil fungsi handleQris dari lib
      const rawQris = await readQrisImage(originalQris);
      const newQris = await updateQris(rawQris, newname, amount);
      const newQrisImage = await generateQrisImage(newQris);
      setFinalQris(newQrisImage);
    } catch (error) {
      showValue(error.message || "Trejadi kesalahan");
    } finally {
      setisPending(false);
    }
  };

  return (
    <div className="w-full h-full bg-slate-50">
      {/* FORM GENERATE QRIS */}

      <div className="p-6 shadow-md rounded-md bg-white w-full max-w-lg mx-auto mt-10">
        <h3 className="uppercase text-center m-1 font-bold">generate qris</h3>
        <Input
          placeholder="Nama Merchant"
          className="mb-4 border border-slate-950 rounded-sm"
          onChange={(e) => setNewname(e.target.value)}
        />
        <Input
          placeholder="nominal ( opsional )"
          className="mb-4  border-slate-950 rounded-sm"
          onChange={(e) => setAmount(e.target.value)}
          type='number'
        />
        <Input
          placeholder="Foto Qris"
          type="file"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setOriginalQris(file);
            }
          }}
          className="mb-4  border-slate-950 rounded-sm"
        />
        <Button className={"p-2 rounded-md "} onClick={handleSubmit}>
          Generate QRIS
        </Button>
      </div>
      {value && <ErrorMessage message={value} />}
      {isPending && <Loading />}
      {finalQris !== "" && (
        <div className="shadow border-slate-950 rounded-md p4 mx-auto mt-10 w-full max-w-sm">
          <h3 className="text-slate-900 text-center m-2">Results</h3>
          <img src={finalQris} alt="Generated QRIS" className="aspect-square" />
          <DownloadButton imageBase64={finalQris} />
        </div>
      )}
    </div>
  );
}

export default generateQris;
