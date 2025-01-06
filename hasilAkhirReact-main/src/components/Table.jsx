import React from "react";
import Button from "./Button";
import Swal from "sweetalert2";

const Table = ({ data }) => {
  const handleEdit = (item) => {
    console.log("Edit: ", item);
  };

  const handleDelete = (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Deleted!", "Your data has been deleted.", "success");
        console.log("Delete:", item);
      }
    });
  };

  return (
    <table className="min-w-full table-auto border">
      <thead>
        <tr className="bg-gray-300">
          <th className="px-4 py-2">#</th>
          <th className="px-4 py-2">NIM</th>
          <th className="px-4 py-2">Nama</th>
          <th className="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index} className="text-center">
            <td className="border px-4 py-2">{index + 1}</td>
            <td className="border px-4 py-2">{item.nim}</td>
            <td className="border px-4 py-2">{item.nama}</td>
            <td className="border px-4 py-2 flex justify-center gap-2">
              <Button
                style="bg-yellow-500 hover:bg-yellow-600"
                text="Edit"
                onClick={() => handleEdit(item)}
              />
              <Button
                style="bg-red-500 hover:bg-red-600"
                text="Delete"
                onClick={() => handleDelete(item)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
