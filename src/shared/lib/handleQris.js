import jsQR from "jsqr";
import QRCode from "qrcode";
/**
 * Mengekstrak string teks dari sebuah file gambar QRIS menggunakan jsQR.
 *
 * @param {File} file - Objek file gambar yang didapat dari input <input type="file" />.
 * @returns {Promise<string>} - Mengembalikan Promise yang berisi string QRIS (000201...).
 * @throws {Error} - Jika QR Code tidak terdeteksi atau file bukan gambar yang valid.
 */
export const readQrisImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);

        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height,
        );

        const qrCode = jsQR(imageData.data, imageData.width, imageData.height);

        if (qrCode && qrCode.data) {
          resolve(qrCode.data);
        } else {
          reject(
            new Error(
              "QRIS tidak terdeteksi. Pastikan gambar jelas dan tidak terpotong.",
            ),
          );
        }
      };

      img.onerror = () => reject(new Error("Gagal memuat gambar."));
      img.src = event.target.result;
    };

    reader.onerror = () => reject(new Error("Gagal membaca file."));
    reader.readAsDataURL(file);
  });
};

/**
 * @param {string} rawQris - String QRIS asli yang diekstrak dari gambar.
 * @param {string} newName - Nama merchant baru yang ingin diupdate (opsional).
 * @param {string|number} amount - Nominal baru yang ingin diupdate (opsional).
 * @returns {string} - String QRIS yang sudah diperbarui dengan nama dan/atau nominal baru.
 *
 * Fungsi ini akan mencari tag 59 untuk nama merchant dan tag 54 untuk nominal, lalu menggantinya dengan nilai baru.
 * Setelah itu, fungsi akan menghitung ulang CRC16 untuk memastikan QRIS tetap valid. I
 */

export const updateQris = (rawQris, newName, amount) => {
  let qrisData = rawQris.substring(0, rawQris.length - 4);

  // Helper untuk Replace/Inject Tag
  const replaceTag = (data, tag, newValue, rentang = 4) => {
    const tagIndex = data.indexOf(tag);
    if (tagIndex === -1) return data; // Jika tag tidak ada

    // ( 2 digit ) setelah tag
    const oldLength = parseInt(
      data.substring(tagIndex + 2, tagIndex + rentang),
    );
    const fullTagOld = data.substring(tagIndex, tagIndex + rentang + oldLength);

    const newLengthStr = newValue.length.toString().padStart(2, "0");
    const fullTagNew = `${tag}${newLengthStr}${newValue}`;

    return data.replace(fullTagOld, fullTagNew);
  };

  // Update Nama Merchant (Tag 59)
  if (newName) {
    qrisData = replaceTag(qrisData, "59", newName);
  }

  // Update Nominal (Tag 54) - Format: 54 + 2 digit length + value
  if (amount) {
    if (Number(amount) <= 0) {
      throw new Error("Nominal harus lebih besar dari 0.");
    }
    const indx = qrisData.indexOf("11");
    const am = amount.toString();
    const leng = am.length < 10 ? "0" + am.length : am.length.toString();
    qrisData =
      qrisData.slice(0, indx - 1) +
      "21254" +
      leng +
      am +
      qrisData.slice(indx + 2);
  }

  // Hitung ulang CRC16
  const crc = hitungCRC16(qrisData);
  return qrisData + crc;
};

// Fungsi hitung ulang Checksum
function hitungCRC16(str) {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
    }
  }
  return (crc & 0xffff).toString(16).toUpperCase().padStart(4, "0");
}

/**
 * Mengonversi string QRIS menjadi Data URL Gambar (Base64).
 * @param {string} qrisString - String QRIS yang sudah diupdate.
 * @returns {Promise<string>} - Base64 Image string.
 */
export const generateQrisImage = async (qrisString) => {
  try {
    const options = {
      errorCorrectionLevel: "M",
      margin: 2,
      width: 400,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    };

    const qrDataUrl = await QRCode.toDataURL(qrisString, options);
    return qrDataUrl;
  } catch (err) {
    console.error("Gagal generate gambar QRIS:", err);
    throw err;
  }
};
