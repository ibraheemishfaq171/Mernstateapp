import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSUccess,
  signOutUserFailure,
  signOutUserStart,
  updateUserFailure,
  updateUserstart,
  updateUserSuccess,
} from "../redux/user/userslice";

import { app } from "../firebase";
const Profile = () => {
  const fileref = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setfile] = useState(undefined);
  const [fileperc, setFileperc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [successupdate, setsuccessupdate] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  const dispatch = useDispatch();
  console.log(formData);

  console.log(fileperc);
  console.log(userListings);

  console.log(file);
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const filename = new Date().getTime() + file.name;
    const storageRef = ref(storage, filename);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFileperc(Math.round(progress));
        console.log("upload is" + progress + "done");
      },
      (error) => {
        setFileUploadError(true);
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };
  //
  // firebase Storage
  // allow read, write: if
  // request.resource.size<2 *1024 *1024 &&
  // request.resource.contentType.matches('image/.*')

  const handleinput = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserstart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setsuccessupdate(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handledeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
      }
      dispatch(deleteUserSUccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      return;
    }
  };
  const handlesignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSUccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };
  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (id) => {
    try {
      const res = await fetch(`/api/listing/delete/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) => prev.filter((listing) => listing._id !== id));
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col mt-4 gap-5" onSubmit={handlesubmit}>
        <input
          onChange={(e) => setfile(e.target.files[0])}
          type="file"
          ref={fileref}
          accept="image/*"
          hidden
        />
        <img
          onClick={() => fileref.current.click()}
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          src={formData.avatar || currentUser.avatar}
          alt="profile"
        />
        <p className="text-sm text-center">
          {fileUploadError ? (
            <span className="text-red-600">
              {" "}
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : fileperc > 0 && fileperc < 100 ? (
            <span className="text-slate-700">{`uploading ${fileperc} %`}</span>
          ) : fileperc === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          id="username"
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.username}
          onChange={handleinput}
        />
        <input
          id="email"
          type="text"
          placeholder="email"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.email}
          onChange={handleinput}
        />

        <input
          id="password"
          type="text"
          placeholder="password"
          className="border p-3 rounded-lg"
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95"
        >
          {loading ? "Loading..." : "update"}
        </button>

        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase
        text-center hover:opacity-35"
          to={"/create_listing"}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex  mt-5  justify-between">
        <span
          onClick={handledeleteUser}
          className="text-red-400 cursor-pointer"
        >
          Delete Account
        </span>
        <span onClick={handlesignOut} className="text-red-400 cursor-pointer">
          Sign Out
        </span>
        <p className="text-red-700 mt-6 text-center">{error ? error : ""}</p>
        <p className="text-green-700 mt-7">
          {successupdate ? "updated successfully" : ""}
        </p>
      </div>
      <button
        className="text-green-700 w-full rounded-lg border-gray-400"
        onClick={handleShowListings}
      >
        Show Listings
      </button>
      <p className="text-red-700 mt-5">
        {showListingsError ? "Error showing listings" : ""}
      </p>
      {userListings &&
        userListings.length > 0 &&
        userListings.map((listing) => (
          <div
            key={listing._id}
            className="border rounded-lg p-3 flex justify-between items-center mt-2"
          >
            <Link to={`/listing/${listing._id}`}>
              <img
                className="h-14 w-14 object-contain rounded-lg mt-2"
                src={listing.imageUrls[0]}
                alt="Not Found"
              />
            </Link>
            <Link to={`/listing/${listing._id}`}>
              <p className="text-slate-700 hover:underline truncate">
                {listing.name}
              </p>
            </Link>
            <div className="flex flex-col item-center">
              <button
                onClick={() => handleListingDelete(listing._id)}
                className="text-red-700"
              >
                Delete
              </button>

              <Link to={`/update_listing/${listing._id}`}>
                <button className="text-green-600">Edit</button>
              </Link>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Profile;
