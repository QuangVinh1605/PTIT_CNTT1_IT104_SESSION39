import React, { useState } from "react";
import axios from "axios";

export default function UploadMultiple() {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  // Lấy từ .env
  const cloudName = import.meta.env.VITE_CLOUD_NAME;       // ví dụ: nguyenvinh
  const uploadPreset = import.meta.env.VITE_UPLOAD_PRESET; // ví dụ: react_unsigned

  // API URL cho Cloudinary
  const apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  // Khi chọn nhiều file
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setUploadedUrls([]);

    const filePreviews = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );
    setPreviews(filePreviews);
  };

  // Upload nhiều file
const handleUpload = async () => {
  if (files.length === 0) {
    alert("Vui lòng chọn ít nhất 1 ảnh!");
    return;
  }

  setLoading(true);

  try {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);

      const apiUrl = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`;

      console.log("Uploading to:", apiUrl);
      console.log("Using preset:", import.meta.env.VITE_UPLOAD_PRESET);

      const res = await axios.post(apiUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return res.data.secure_url;
    });

    const urls = await Promise.all(uploadPromises);
    setUploadedUrls(urls);
    setPreviews([]);
  } catch (err) {
    console.error("Upload error:", err.response?.data || err.message);
    alert("Upload thất bại. Kiểm tra lại preset và cloud name trong .env");
  } finally {
    setLoading(false);
  }
};


  return (
    <div style={{ padding: "20px" }}>
      <h2>Upload Multiple Images</h2>

      {/* Input chọn nhiều file */}
      <input type="file" accept="image/*" multiple onChange={handleFileChange} />

      {/* Xem trước ảnh */}
      {previews.length > 0 && (
        <div style={{ marginTop: "15px" }}>
          <p>Ảnh xem trước:</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {previews.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`Preview ${idx + 1}`}
                style={{ width: "150px", border: "1px solid #ddd" }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Nút Upload */}
      <div style={{ marginTop: "15px" }}>
        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Đang upload..." : "Upload"}
        </button>
      </div>

      {/* Ảnh sau khi upload */}
      {uploadedUrls.length > 0 && (
        <div style={{ marginTop: "15px" }}>
          <p>Ảnh sau khi upload:</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {uploadedUrls.map((url, idx) => (
              <div key={idx}>
                <img
                  src={url}
                  alt={`Uploaded ${idx + 1}`}
                  style={{ width: "150px", border: "1px solid #ddd" }}
                />
                <p>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    Xem ảnh
                  </a>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
