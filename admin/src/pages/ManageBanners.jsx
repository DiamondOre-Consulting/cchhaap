import React, { useEffect, useRef, useState } from "react";
import HomeLayout from "../Layout/HomeLayout";
import { FaSpinner, FaTrash, FaEdit } from "react-icons/fa";
import { MdCloudUpload } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import { useDispatch } from "react-redux";
import { addBannerImage, editBanner, getAllBanners } from "@/Redux/Slices/authSlice";

const ManageBanners = () => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const [allImage, setAllImage] = useState([]);
  const [files, setFiles] = useState([]);

  const getUniqueCode = () => uuidv4().slice(0, 8);

  const getFileExtension = (filename) => {
    return filename.split('.').pop();
  };

  const handleImageFileChange = (e, index = null) => {
    const selectedFile = e?.target.files?.[0];
    if (!selectedFile) return;

    const extension = getFileExtension(selectedFile.name);
    const uniqueId = index !== null ? allImage[index]?.uniqueId || getUniqueCode() : getUniqueCode();
    const fileName = `${uniqueId}.${extension}`;

    if (index === null) {
      // Adding new image
      setAllImage(prev => [
        ...prev,
        {
          uniqueId,
          secureUrl: URL.createObjectURL(selectedFile),
          publicId: "",
        }
      ]);
      
      setFiles(prev => [
        ...prev,
        new File([selectedFile], fileName, {
          type: selectedFile.type,
        })
      ]);
    } else {
      // Updating existing image
      setAllImage(prev => {
        const newImages = [...prev];
        newImages[index] = {
          ...newImages[index],
          uniqueId,
          secureUrl: URL.createObjectURL(selectedFile),
          publicId: "",
        };
        return newImages;
      });

      setFiles(prev => {
        const newFiles = [...prev];
        newFiles[index] = new File([selectedFile], fileName, {
          type: selectedFile.type,
        });
        return newFiles;
      });
    }
  };

  const handleImageDataRemove = (index) => {
    setAllImage(prev => prev.filter((_, i) => i !== index));
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (allImage.length === 0) return;
    
    setUploading(true);

    const formData = new FormData();
    formData.append("bannerImages", JSON.stringify(allImage.map(({ allImage, ...rest }) => rest)))

    files.forEach((file) => {
      if (file) {
        formData.append("bannerImages", file);
      }
    });

    try {
      const response = await dispatch(editBanner(formData));
      if (response?.payload?.success) {
        handleAllBanners(); // Refresh the data
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleAllBanners = async () => {
    try {
      const response = await dispatch(getAllBanners());
      const bannerImages = response?.payload?.data[0]?.bannerImage || [];
      setAllImage(bannerImages);
      setFiles(new Array(bannerImages.length).fill(null));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleAllBanners();
  }, []);

  return (
    <div>
      <HomeLayout>
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage Banner Images</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-700">Banner Images</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allImage?.map((image, index) => (
                <div key={index} className="border rounded-lg overflow-hidden relative group hover:shadow-lg transition-shadow">
                  {image.secureUrl ? (
                    <>
                      <img 
                        src={image.secureUrl} 
                        alt={`Banner ${index}`}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 flex items-center justify-center opacity-0 group-hover:bg-opacity-50 group-hover:opacity-100 transition-all duration-300">
                        <button
                          onClick={() => handleImageDataRemove(index)}
                          className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 mr-2 transition-colors"
                          title="Delete image"
                        >
                          <FaTrash size={14} />
                        </button>
                        <label className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 cursor-pointer transition-colors"
                               title="Edit image">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageFileChange(e, index)}
                            className="hidden"
                          />
                          <FaEdit size={14} />
                        </label>
                      </div>
                    </>
                  ) : (
                    <div className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                      <MdCloudUpload className="text-4xl text-gray-400 mb-2" />
                      <p className="text-gray-500 mb-2 text-center">Upload Banner Image</p>
                      <label className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm cursor-pointer hover:bg-blue-700 transition-colors">
                        Select Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageFileChange(e, index)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              ))}

              {/* Always show upload box at the end */}
              <div className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors cursor-pointer">
                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                  <MdCloudUpload className="text-4xl text-gray-400 mb-2" />
                  <p className="text-gray-500 mb-2 text-center">Click to upload new banner image</p>
                  <span className="text-sm text-blue-600">PNG, JPG, JPEG (Max 5MB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageFileChange(e)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {allImage?.length > 0 && (
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={uploading}
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors disabled:bg-green-400 flex items-center gap-2"
                >
                  {uploading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </HomeLayout>
    </div>
  );
};

export default ManageBanners;