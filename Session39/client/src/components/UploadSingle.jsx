import axios from "axios";
import React, { useState } from "react";

export default function UploadSingle() {
  const [file, setFile] = useState(null);
  const [priview, setPreview] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Lấy giá trị từ input có type = file
  const handleChangeFile = (event) => {
    const fileName = event.target.files[0];

    if (fileName) {
      // Cập nhật lại giá trị từ input vào state
      setFile(event.target.files[0]);

      //   Tạo một ảnh preview
      setPreview(URL.createObjectURL(fileName));
    }
  };

  //   Gọi API để lưu trữ hình ảnh
  const handleUploadFile = async () => {
    if (!file) {
      alert("Vui lòng chọn ảnh");
      return;
    }

    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
    formData.append("cloud_name", import.meta.env.VITE_CLOUD_NAME);

    // Gọi API upload hình ảnh vào cloudinary
    const apiUrl = import.meta.env.VITE_API_CLOUD;

    setIsLoading(true);
    try {
      const response = await axios.post(apiUrl, formData);

      setImageUrl(response.data.url);
    } catch (error) {
      console.log(error);
    } finally {
      // Tắt hiệu ứng loading
      setIsLoading(false);

      // Tắt hình ảnh xem trước
      setPreview(false);
    }
  };

  return (
    <div>
      {isLoading && <div>Đang tải lên...</div>}

      {priview && (
        <>
          <h3>Hình ảnh xem trước:</h3>
          <img height={200} width={300} src={priview} alt="Ảnh xem trước" />
        </>
      )}

      {imageUrl && (
        <>
          <h3>Hình ảnh sau khi upload:</h3>
          <img
            height={200}
            width={300}
            src={imageUrl}
            alt="Ảnh xem sau khi upload"
          />
        </>
      )}

      <input type="file" onChange={handleChangeFile} />
      <button onClick={handleUploadFile}>Upload</button>
    </div>
  );
}
