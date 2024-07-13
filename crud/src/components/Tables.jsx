import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Tables() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUser] = useState([]);
  const [ismodalopen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState({ name: "", age: "", city: "" });

  const getAllUsers = async () => {
    await axios.get("http://localhost:8000/users").then((res) => {
      console.log(res.data);
      setUsers(res.data);
      setFilteredUser(res.data);
    });
  };
  useEffect(() => {
    getAllUsers();
  }, []);

  const searchChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredUsers = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchText) ||
        user.city.toLowerCase().includes(searchText)
    );
    setFilteredUser(filteredUsers);
  };

  const handleDelete = async (id) => {
    const isconfirm = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (isconfirm) {
      await axios.delete(`http://localhost:8000/users/${id}`).then((res) => {
        setUsers(res.data);
        setFilteredUser(res.data);
      });
    }
  };

  const handleAddRecord = () => {
    setUserData({ name: "", age: "", city: "" });
    setIsModalOpen(true);
  };

  const closemodal = () => {
    setIsModalOpen(false);
    getAllUsers();
  };

  const handleData = (e) =>{
    setUserData({...userData,[e.target.name]:e.target.value});
  };

  const handleSubmit = async(e) =>{
    e.preventDefault();
    if(userData.id){
  await axios.patch(`http://localhost:8000/users/${userData.id}`, userData).then((res) => {
    console.log(res);
  });
    }
    else{
      await axios.post("http://localhost:8000/users/", userData).then((res) => {
        console.log(res);
      });
    }
   closemodal();
setUserData({ name: "", age: "", city: "" });
  }

  const handleEdit = (user) =>{
    setUserData(user);
    setIsModalOpen(true);
  }

  return (
    <>
      <div className="">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-xl lg:text-3xl text-center font-bold my-10 mx-5 text-blue-500">
            CURD operations using Node js and React js
          </h1>
          <div className="input-search flex justify-between px-5 py-2 md:py-5 bg-slate-200 w-11/12 md:w-8/12 lg:w-6/12 rounded-xl">
            <div className="md:py-1 px-2 w-9/12 rounded-xl bg-white border-2 border-blue-500 flex justify-between items-center md:mx-4 me-4">
              <input
                type="text"
                placeholder="Search..."
                className="w-11/12 py-1 ms-2 rounded-lg outline-none placeholder:text-slate-400 placeholder:italic placeholder:ps-2"
                onChange={searchChange}
              />
              <i className="fa-solid fa-magnifying-glass w-1/12 text-center text-lg text-slate-500 hover:text-green-700 "></i>
            </div>
            <button
              className="text-white  text-md mx-auto bg-green-500 px-4 rounded-xl hover:bg-green-600 hover:ring-2 hover:ring-offset-2 hover:ring-green-500 duration-300"
              onClick={handleAddRecord}
            >
              Add Members
            </button>
          </div>
        </div>

        <div className="relative overflow-x-auto mx-5 my-10 ">
          <table className="w-6/12 md:w-8/12 lg:w-6/12  mx-auto text-center">
            <thead className="bg-blue-300 my-4 rounded-lg">
              <tr className="">
                <th className="py-1 px-2 uppercase border-2 border-slate-600">
                  S.no
                </th>
                <th className="px-2 uppercase border-2 border-slate-600">
                  Name
                </th>
                <th className="px-2 uppercase border-2 border-slate-600">
                  Age
                </th>
                <th className="px-2 uppercase border-2 border-slate-600">
                  City
                </th>
                <th className="px-2 uppercase border-2 border-slate-600">
                  Edit
                </th>
                <th className="px-2 uppercase border-2 border-slate-600">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody className="">
              {filteredUsers &&
                filteredUsers.map((user, index) => {
                  return (
                    <tr
                      className="hover:bg-slate-200  border-b-2 border-slate-600  duration-300 odd:bg-white even:bg-slate-100"
                      key={index}
                    >
                      <td className="py-2 border-2 border-slate-300">
                        {index + 1}
                      </td>
                      <td className=" border-2 border-slate-300">
                        {user.name}
                      </td>
                      <td className=" border-2 border-slate-300">{user.age}</td>
                      <td className=" border-2 border-slate-300">
                        {user.city}
                      </td>
                      <td className=" border-2 border-slate-300">
                        <i
                          className="fa-solid fa-pen-to-square cursor-pointer text-green-600"
                          onClick={() => handleEdit(user)}
                        ></i>
                      </td>
                      <td className=" border-2 border-slate-300">
                        <i
                          className="fa-solid fa-trash cursor-pointer text-red-500"
                          onClick={() => handleDelete(user.id)}
                        ></i>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>

          {ismodalopen && (
            <div className="modal block fixed z-10 left-0 top-0 bg-black bg-opacity-50 w-full h-full overflow-auto">
              <div className="modal-content bg-white mx-auto w-11/12 md:w-8/12 lg:w-6/12 rounded-xl my-12">
                <div className="flex justify-between w-10/12 mx-auto py-6">
                  <h2 className="text-2xl font-bold text-green-600">
                    {userData.id ? "Update Record" : "Add Record"}
                  </h2>
                  <div>
                    <i
                      className="fa-regular fa-circle-xmark text-2xl cursor-pointer hover:text-red-600"
                      onClick={closemodal}
                    ></i>
                  </div>
                </div>

                <div className="pb-10 w-11/12 md:w-8/12 mx-auto">
                  <div className="flex flex-col my-4 w-full">
                    <label className="font-bold">Name :</label>
                    <input
                      type="text"
                      className="gls-bg border-b-2  rounded-lg p-1 border-2 focus:border-b-2 focus:outline-none focus:ring-2 focus:text-blue-700 focus:border-blue-500  my-2  placeholder:ps-2"
                      placeholder="name"
                      value={userData.name}
                      id="name"
                      name="name"
                      onChange={handleData}
                    />
                  </div>
                  <div className="flex flex-col my-4 ">
                    <label className="font-bold">Age :</label>
                    <input
                      type="number"
                      className="gls-bg border-b-2  rounded-lg p-1 border-2 focus:border-b-2 focus:outline-none focus:ring-2 focus:text-blue-700 focus:border-blue-500  my-2  placeholder:ps-2"
                      placeholder="age"
                      value={userData.age}
                      id="age"
                      name="age"
                      onChange={handleData}
                    />
                  </div>
                  <div className="flex flex-col my-4 ">
                    <label className="font-bold">City :</label>
                    <input
                      type="text"
                      className="gls-bg border-b-2  rounded-lg p-1 border-2 focus:border-b-2 focus:outline-none focus:ring-2 focus:text-blue-700 focus:border-blue-500  my-2  placeholder:ps-2"
                      placeholder="city"
                      value={userData.city}
                      id="city"
                      name="city"
                      onChange={handleData}
                    />
                  </div>

                  <button
                    className="text-white  text-md mx-auto bg-blue-500 px-4 py-2 rounded-xl hover:bg-blue-600 hover:ring-2 hover:ring-offset-2 hover:ring-blue-500 duration-300"
                    onClick={handleSubmit}
                  >
                    {userData.id ? "Update" : "Add"}
                  </button>
                </div>
                
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
