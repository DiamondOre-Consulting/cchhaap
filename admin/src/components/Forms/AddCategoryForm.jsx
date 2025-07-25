import { defaultCategoryValues } from "@/constant/formDefaults";
import { createCategory, editCategory } from "@/Redux/Slices/categorySlice";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { IoAdd } from "react-icons/io5";
import { useDispatch } from "react-redux";

const AddCategoryForm = ({
  formState,
  setAddCategoryPopUp,
  handleGetAllCategories,
  editData = null,
  addCategoryPopUp,
  subCategoryState,
  id,
}) => {
  const [previewImage, setPreviewImage] = useState("");
  const dispatch = useDispatch();
  console.log(editData);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: defaultCategoryValues,
  });

  useEffect(() => {
    if (editData) {
      reset({
        categoryName: editData.categoryName || "",
        categoryImage: editData.categoryImage || null,
      });
      setPreviewImage(editData.categoryImage?.secureUrl || "");
    } else {
      console.log("inelde");
      reset(defaultCategoryValues);
      setPreviewImage("");
    }
  }, [editData, reset, addCategoryPopUp, setAddCategoryPopUp]);

  console.log("add category popup deps changing ", addCategoryPopUp);

  const onSubmit = async (data) => {
    const formData = new FormData();
    const imageFile = data.categoryImage?.[0];

    if (imageFile) {
      formData.append("categoryImage", imageFile);
    }

    formData.append("categoryName", data.categoryName);

    let res;
    if (editData?._id) {
      res = await dispatch(editCategory({ id: editData._id, formData }));
    } else {
      res = await dispatch(createCategory(formData));
    }

    if (res?.payload?.success) {
      setAddCategoryPopUp(false);
      await handleGetAllCategories();
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center text-xl">
        <div className="flex items-center">
          <IoAdd /> {editData ? "Edit Category" : "Add Category"}
        </div>
        <div className="h-[1px] w-full bg-black/20 my-3"></div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {formState.map((field, index) => {
          if (field.inputType === "text") {
            return (
              <div key={index}>
                <label>{field.label}</label>
                <input
                  {...register(field.name, field.error)}
                  className="w-full border px-3 py-2 rounded"
                />
                {errors[field.name] && (
                  <p className="text-red-500 text-sm">
                    {errors[field.name]?.message}
                  </p>
                )}
              </div>
            );
          }

          if (field.inputType === "file") {
            return (
              <div key={index} className=" ">
                <label>{field.label}</label>
                <div className="flex gap-x-6 ">
                  <div class="flex items-center justify-center w-full">
                    <label
                      for="dropzone-file"
                      class="flex flex-col items-center justify-center w-full  border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                      <div class="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span class="font-semibold">Click to upload</span> or
                          drag and drop
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          SVG, PNG, JPG or GIF (MAX. 800x400px)
                        </p>
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        class="hidden"
                        accept="image/*"
                        {...register(field.name, {
                          ...(editData ? {} : field.error),
                          onChange: (e) => {
                            const uploadedFile = e.target.files[0];
                            const previewUrl =
                              URL.createObjectURL(uploadedFile);
                            setPreviewImage(previewUrl);
                          },
                        })}
                      />
                    </label>
                  </div>
                  {errors[field.name] && (
                    <p className="text-red-500 text-sm">
                      {errors[field.name]?.message}
                    </p>
                  )}
                  {previewImage && (
                    <div className="relative w-32 h-32">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="absolute inset-0 w-full h-full object-cover rounded"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          }

          // if (field.inputType === "array") {
          //   return (
          //     <div key={index}>
          //       <label>{field.label}</label>
          //       {fields.map((item, i) => (
          //         <div key={item.id} className="flex gap-2 mb-2">
          //           <input
          //             {...register(`subCategory.${i}.name`, {
          //               required: "Subcategory is required",
          //             })}
          //             placeholder={`Subcategory ${i + 1}`}
          //             className="border px-2 py-1 flex-1 rounded"
          //           />
          //           <button
          //             type="button"
          //             onClick={() => remove(i)}
          //             className="bg-red-500 text-white px-2 rounded cursor-pointer"
          //           >
          //             Remove
          //           </button>
          //         </div>
          //       ))}
          //       <button
          //         type="button"
          //         onClick={() => append({ name: "" })}
          //         className="mt-2 text-blue-600  cursor-pointer"
          //       >
          //         + Add Subcategory
          //       </button>
          //     </div>
          //   );
          // }

          return null;
        })}

        <button
          type="submit"
          className="bg-c1 cursor-pointer  w-full text-white px-6 py-4 rounded-md"
        >
          {isSubmitting ? (
            <>
              <div class="text-center">
                <div role="status">
                  <svg
                    aria-hidden="true"
                    class="inline w-6 h-6 text-gray-400 animate-spin dark:text-gray-600 fill-white"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
            </>
          ) : (
            <p>Submit</p>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddCategoryForm;
