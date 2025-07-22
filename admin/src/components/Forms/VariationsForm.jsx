import {
  createAttributes,
  editAttribute,
} from "@/Redux/Slices/attributesSlice";
import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useDispatch } from "react-redux";

const VariationsForm = ({
  allCategories,
  setVariationsPopUp,
  handleGetAllAttributes,
  editAttributeData,
}) => {
  const [loader, setLoader] = useState(false);
  console.log(editAttributeData?.category?.categoryName);
  const { register, control, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      category: "",
      attributes: [
        {
          name: "",
          options: [""],
        },
      ],
    },
  });

  useEffect(() => {
    if (editAttributeData) {
      reset({
        category: editAttributeData?.category?._id,
        attributes: editAttributeData.attributes.map((attr) => ({
          name: attr.name,
          options: attr.options,
        })),
      });
    }
  }, []);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "attributes",
  });

  const dispatch = useDispatch();
  const onSubmit = async (data) => {
    console.log(data);
    setLoader(true);
    try {
      if (editAttributeData) {
        const response = await dispatch(
          editAttribute({
            id: editAttributeData?.category?._id,
            data,
          })
        );

        console.log(response);
      } else {
        const res = await dispatch(createAttributes(data));
        console.log(res);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
      setVariationsPopUp(false);
      await handleGetAllAttributes();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-4 max-h-[80vh] overflow-y-auto"
    >
      <h2 className="text-xl font-semibold mb-4">Add Variations</h2>

      <div className="mb-4">
        <label className="block mb-1">Category</label>
        <select
          {...register("category", { required: true })}
          className="border px-2 py-2 rounded w-full"
        >
          <option value="">Select Category</option>
          {allCategories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.categoryName}
            </option>
          ))}
        </select>
      </div>
      {fields.map((field, attrIndex) => {
        const options = watch(`attributes.${attrIndex}.options`) || [];

        return (
          <div key={field.id} className="border relative bg-gray-50 p-4 mb-4">
            <input
              {...register(`attributes.${attrIndex}.name`)}
              placeholder="Attribute Name"
              className="border p-2 w-full mb-2 bg-white  rounded"
            />

            {options.map((option, optIndex) => (
              <div key={optIndex} className="flex  gap-2  mb-2">
                <input
                  {...register(`attributes.${attrIndex}.options.${optIndex}`)}
                  placeholder={`Option ${optIndex + 1}`}
                  className="border p-2 flex-1 bg-white rounded "
                />
                <button
                  type="button"
                  onClick={() => {
                    const updatedOptions = options.filter(
                      (_, i) => i !== optIndex
                    );
                    setValue(`attributes.${attrIndex}.options`, updatedOptions);
                  }}
                  className="bg-red-400 text-white px-2 w-10 text-2xl rounded"
                >
                  ×
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                setValue(`attributes.${attrIndex}.options`, [...options, ""])
              }
              className="bg-green-400 text-white px-4 py-1 rounded mb-2"
            >
              Add Option
            </button>

            <button
              type="button"
              onClick={() => remove(attrIndex)}
              className="block absolute  bg-red-600 -top-4 -right-2 cursor-pointer text-white size-5 flex items-center justify-center rounded-full mt-2"
            >
              ×
            </button>
          </div>
        );
      })}

      <button
        type="button"
        onClick={() => append({ name: "", options: [""] })}
        className="bg-c1 text-white px-4 py-2 rounded"
      >
        Add Attribute
      </button>

      <button
        type="submit"
        className="bg-c1 w-full text-white px-4 py-2 rounded mt-4"
      >
        {loader ? (
          <div role="status" className="flex items-center justify-center">
            <svg
              aria-hidden="true"
              className="inline w-6 h-6 text-gray-200 animate-spin  fill-gray-600 "
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
            <span className="ml-2">Loading...</span>
          </div>
        ) : (
          "Submit"
        )}
      </button>
    </form>
  );
};

export default VariationsForm;
