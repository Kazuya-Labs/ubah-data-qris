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
        // 1. Siapkan Canvas untuk ekstraksi data pixel
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);

        // 2. Ambil data gambar (ImageData)
        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height,
        );

        // 3. Gunakan library jsQR untuk mencari teks di dalam gambar
        const qrCode = jsQR(imageData.data, imageData.width, imageData.height);

        if (qrCode && qrCode.data) {
          // Berhasil menemukan string QRIS
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

export const updateQris = (rawQris, newName, amount) => {
  // 1. Hapus CRC lama (4 karakter terakhir)
  let qrisData = rawQris.substring(0, rawQris.length - 4);

  // 2. Fungsi Helper untuk Replace/Inject Tag
  const replaceTag = (data, tag, newValue) => {
    const tagIndex = data.indexOf(tag);
    if (tagIndex === -1) return data; // Jika tag tidak ada

    // Ambil 2 digit setelah tag untuk tahu panjang datanya
    const oldLength = parseInt(data.substring(tagIndex + 2, tagIndex + 4));
    const fullTagOld = data.substring(tagIndex, tagIndex + 4 + oldLength);

    const newLengthStr = newValue.length.toString().padStart(2, "0");
    const fullTagNew = `${tag}${newLengthStr}${newValue}`;

    return data.replace(fullTagOld, fullTagNew);
  };

  // 3. Update Nama Merchant (Tag 59)
  if (newName) {
    qrisData = replaceTag(qrisData, "59", newName);
  }

  // 4. Update/Tambah Nominal (Tag 54)
  // Jika amount ada, kita masukkan. Jika tidak ada tag 54, kita harus menambahkannya
  // Biasanya tag 54 berada sebelum tag 58 (Currency)
  if (amount) {
    const formattedAmount = amount.toString();
    if (qrisData.includes("54")) {
      qrisData = replaceTag(qrisData, "54", formattedAmount);
    } else {
      // Injeksi manual sebelum Tag 58 (IDR Currency biasanya 5802360)
      const tag58Pos = qrisData.indexOf("58");
      const tag54 = `54${formattedAmount.length.toString().padStart(2, "0")}${formattedAmount}`;
      qrisData = qrisData.slice(0, tag58Pos) + tag54 + qrisData.slice(tag58Pos);
    }

    // 5. Ubah Point of Initiation Method ke Dinamis (Tag 01) -> "12"
    qrisData = replaceTag(qrisData, "01", "12");
  }

  // 6. Hitung ulang CRC16
  const crc = hitungCRC16(qrisData);
  return qrisData + crc;
};

// Fungsi pembantu untuk hitung ulang Checksum
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
      errorCorrectionLevel: "M", // Level M cukup aman untuk QRIS
      margin: 2,
      width: 400, // Ukuran pixel
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
