import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Button from "../../components/Button";

const Mahasiswa = () => {
  const [nim, setNim] = useState("");
  const [nama, setNama] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // State untuk mengatur loading saat submit

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Login diperlukan",
        text: "Anda harus login terlebih dahulu.",
      }).then(() => {
        window.location.href = "/";
      });
    } else {
      fetchData(token);
    }
  }, []); // Tidak ada dependensi agar hanya berjalan sekali saat pertama kali

  const handleNimChange = (e) => setNim(e.target.value);
  const handleNamaChange = (e) => setNama(e.target.value);

  const fetchData = async (token) => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://demo-api.syaifur.io/api/mahasiswa",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setData(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!nim.trim() || !nama.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "NIM dan Nama tidak boleh kosong!",
      });
      setIsSubmitting(false);
      return;
    }

    if (nim.length < 5 || nim.length > 20) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "NIM harus memiliki panjang antara 5 hingga 20 karakter.",
      });
      setIsSubmitting(false);
      return;
    }

    const token = localStorage.getItem("token");
    const payload = {
      progdi_id: 1,
      nim,
      nama,
      alamat: "Alamat default",
      umur: 20,
    };

    try {
      const response = await axios.post(
        "http://demo-api.syaifur.io/api/mahasiswa",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Menambahkan data yang berhasil ditambahkan ke state
      setData((prevData) => [...prevData, response.data.data]);
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Data mahasiswa berhasil ditambahkan!",
      });
      setNim("");
      setNama("");
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fungsi untuk menangani error dari API
  const handleApiError = (error) => {
    console.error("Error: ", error);
    if (error.response?.status === 422) {
      // Menampilkan pesan error yang lebih spesifik dari API
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Gagal memproses data: ${
          error.response?.data?.message || "Periksa data yang dikirimkan"
        }`,
      });
    } else if (error.response?.status === 401) {
      Swal.fire({
        icon: "error",
        title: "Sesi Habis",
        text: "Sesi Anda telah habis. Silakan login kembali.",
      }).then(() => {
        window.location.href = "/";
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Terjadi kesalahan saat memproses permintaan.",
      });
    }
  };

  const handleEdit = (item) => {
    Swal.fire({
      title: "Edit Data Mahasiswa",
      html: `
        <div class="mb-3">
          <label for="nim" class="text-sm font-medium text-gray-700">NIM</label>
          <input id="nim" class="swal2-input mt-1 w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500" placeholder="NIM" value="${item.nim}" />
        </div>
        <div class="mb-3">
          <label for="nama" class="text-sm font-medium text-gray-700">Nama</label>
          <input id="nama" class="swal2-input mt-1 w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500" placeholder="Nama" value="${item.nama}" />
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Update",
      cancelButtonText: "Batal",
      preConfirm: () => {
        const nim = document.getElementById("nim").value;
        const nama = document.getElementById("nama").value;
        if (!nim || !nama) {
          Swal.showValidationMessage("NIM dan Nama tidak boleh kosong!");
        }
        return { nim, nama };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const { nim, nama } = result.value;
        const token = localStorage.getItem("token");
        const payload = {
          progdi_id: 1,
          nim,
          nama,
          alamat: "Alamat default",
          umur: 20,
        };

        axios
          .put(`http://demo-api.syaifur.io/api/mahasiswa/${item.id}`, payload, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setData((prevData) =>
              prevData.map((data) =>
                data.id === item.id ? response.data.data : data
              )
            );
            Swal.fire({
              icon: "success",
              title: "Berhasil",
              text: "Data mahasiswa berhasil diperbarui!",
            });
          })
          .catch((error) => {
            handleApiError(error);
          });
      }
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Hapus Data Mahasiswa",
      text: "Apakah Anda yakin ingin menghapus data ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("token");

        axios
          .delete(`http://demo-api.syaifur.io/api/mahasiswa/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(() => {
            setData(data.filter((item) => item.id !== id)); // Menghapus data yang sudah dihapus dari state
            Swal.fire({
              icon: "success",
              title: "Berhasil",
              text: "Data mahasiswa berhasil dihapus!",
            });
          })
          .catch((error) => {
            handleApiError(error);
          });
      }
    });
  };

  return (
    <div>
      <h1 className="font-bold text-2xl">Data Mahasiswa</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label className="text-md font-medium text-gray-700">NIM:</label>
          <input
            type="text"
            value={nim}
            onChange={handleNimChange}
            placeholder="Masukkan NIM"
            className="mt-3 w-1/2 px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>
        <div>
          <label className="text-md font-medium text-gray-700">Nama:</label>
          <input
            type="text"
            value={nama}
            onChange={handleNamaChange}
            placeholder="Masukkan Nama"
            className="mt-3 w-1/2 px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting} // Disable tombol submit saat sedang mengirim data
          className={`mt-4 px-6 py-2 rounded-md ${
            isSubmitting ? "bg-gray-500" : "bg-green-500"
          } text-white hover:bg-green-700`}
        >
          {isSubmitting ? "Mengirim..." : "Tambah Data"}
        </button>
      </form>

      <br />
      <h2>Data Mahasiswa yang Terdaftar:</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table-auto w-full mt-4">
          <thead>
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">NIM</th>
              <th className="px-4 py-2">Nama</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td className="border px-4 py-2">{item.id}</td>
                <td className="border px-4 py-2">{item.nim}</td>
                <td className="border px-4 py-2">{item.nama}</td>
                <td className="border px-4 py-2">
                  <Button
                    style={`bg-blue-500 m-2`}
                    onClick={() => handleEdit(item)}
                    text={`Edit`}
                  />
                  <Button
                    style={`bg-red-500`}
                    onClick={() => handleDelete(item.id)}
                    text={`Delete`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Mahasiswa;
