import React, { useEffect, useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { getAllCategories } from "@/Redux/Slices/categorySlice";
import { productDefaultValues } from "@/constant/formDefaults";
import { useDispatch } from "react-redux";
import JoditEditor from "jodit-react";
import { HexColorPicker } from "react-colorful";

const ProductForm = ({ formState }) => {
  const [categories, setCategories] = useState([]);
  const [subOptions, setSubOptions] = useState([]);
  const dispatch = useDispatch();
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: productDefaultValues });

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailPreview(URL.createObjectURL(file));
      setThumbnailFile(file);
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const filePreviews = files.map((file) => URL.createObjectURL(file));
    console.log("file priview", filePreviews);
    setImageFiles((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...filePreviews]);
  };

  const removeThumbnail = () => {
    setThumbnailPreview(null);
    setThumbnailFile(null);
  };

  const removeImageAtIndex = (index) => {
    const newPreviews = [...imagePreviews];
    const newFiles = [...imageFiles];

    newPreviews.splice(index, 1);
    newFiles.splice(index, 1);

    setImagePreviews(newPreviews);
    setImageFiles(newFiles);
  };

  const selectedCat = watch("category");
  const { fields, append, remove } = useFieldArray({
    control,
    name: "images",
  });

  const {
    fields: variationFields,
    append: appendVariation,
    remove: removeVariation,
  } = useFieldArray({ control, name: "variations" });

  const handleGetAllCategories = async () => {
    try {
      const response = await dispatch(getAllCategories());
      console.log(response);
      setCategories(response?.payload?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetAllCategories();
  }, []);

  useEffect(() => {
    const cat = categories.find((c) => c._id === selectedCat);
    console.log("mycat", cat);
    setSubOptions(cat?.subCategories || []);
  }, [selectedCat, categories]);

  console.log("categoryies", categories);
  console.log("suboptionsss", subOptions);

  const editor = useRef(null);

  const config = {
    readonly: false,
    placeholder: "Enter text here...",
    height: 250,
  };

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-2  h-[80vh] overflow-y-auto  "
    >
      <h2 className="text-xl font-semibold mb-4">Add New Product</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {formState.map((f) => {
          const isFullWidth = f.name === "description";

          if (f.name === "category") {
            return (
              <div key={f.name}>
                <label className="block mb-1 font-medium">{f.label}</label>
                <select
                  {...register(f.name, f.validation)}
                  className="w-full border rounded text-black px-3 py-2"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id} className="text-black">
                      {c.categoryName}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-600 text-sm">
                    {errors.category.message}
                  </p>
                )}
              </div>
            );
          }

          if (f.name === "subCategory") {
            return (
              <div key={f.name}>
                <label className="block mb-1 font-medium">{f.label}</label>
                <select
                  {...register("subCategory.0", f.validation)}
                  className={`w-full border rounded px-3 py-2 ${
                    !selectedCat ? "bg-gray-300" : ""
                  }`}
                  disabled={!selectedCat}
                >
                  <option value="">Please Select category First</option>
                  {subOptions.map((sc) => (
                    <option key={sc} value={sc}>
                      {sc}
                    </option>
                  ))}
                </select>
                {errors.subCategory && (
                  <p className="text-red-600 text-sm">
                    {errors.subCategory.message}
                  </p>
                )}
              </div>
            );
          }

          return (
            <div key={f.name} className={isFullWidth ? "md:col-span-2" : ""}>
              <label className="block mb-1 font-medium">{f.label}</label>
              {f.inputType === "textarea" ? (
                <JoditEditor
                  ref={editor}
                  value={watch("description")}
                  config={config}
                  onBlur={(newContent) => setValue("description", newContent)}
                  onChange={() => {}}
                  className={`w-full border rounded px-3 py-2 ${
                    errors[f.name] ? "border-red-500" : "border-gray-400"
                  }`}
                />
              ) : f.inputType === "select" ? (
                <select
                  {...register(f.name, f.validation)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select</option>
                  {f.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={f.inputType}
                  {...register(f.name, f.validation)}
                  className="w-full border rounded px-3 py-2"
                />
              )}
              {errors[f.name] && (
                <p className="text-red-600 text-sm">{errors[f.name].message}</p>
              )}
            </div>
          );
        })}
      </div>

      <div>
        <h3 className="font-semibold mb-2">Variations</h3>
        {variationFields.map((vf, idx) => (
          <div
            key={vf.id}
            className="border p-4 rounded mb-4 bg-gray-50 space-y-3"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  grid-row-3 gap-3">
              <div className="flex flex-col text-sm">
                <label className="px-1">Size</label>
                <select
                  {...register(`variations.${idx}.size`)}
                  className="border rounded bg-white py-2"
                >
                  <option value="">Select Size</option>
                  {["XS", "S", "M", "L", "XL", "XXL", "Free Size"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col text-sm">
                <label className="px-1">Color Name</label>

                <input
                  {...register(`variations.${idx}.color.name`)}
                  placeholder="Color Name"
                  className="border rounded px-2 py-2 bg-white"
                />
              </div>
              <div className="flex flex-col row-span-4">
                <label className="px-1">Color</label>
                <HexColorPicker
                  color={watch(`variations.${idx}.color.hex`)}
                  onChange={(color) =>
                    setValue(`variations.${idx}.color.hex`, color)
                  }
                  style={{ width: "100%" }}
                />
                <input
                  {...register(`variations.${idx}.color.hex`)}
                  className="border mt-2 rounded px-2 py-1"
                  readOnly
                />
              </div>

              <div className="flex flex-col text-sm">
                <label className="px-1">Price</label>

                <input
                  type="number"
                  {...register(`variations.${idx}.price`)}
                  placeholder="Price"
                  className="border rounded px-2 py-2 bg-white"
                />
              </div>

              <div className="flex flex-col text-sm">
                <label className="px-1">Size</label>

                <select
                  {...register(`variations.${idx}.discountedType`)}
                  className="border rounded px-2 py-2 bg-white"
                >
                  <option value="">Select Discount Type</option>
                  {["Fixed", "Percentage"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col text-sm">
                <label className="px-1">Discounted Price</label>

                <input
                  type="number"
                  {...register(`variations.${idx}.discountPrice`)}
                  placeholder="Discount Price"
                  className="border rounded px-2 py-2 bg-white"
                />
              </div>

              <div className="flex flex-col text-sm">
                <label className="px-1">Quantity</label>
                <input
                  type="number"
                  {...register(`variations.${idx}.quantity`)}
                  placeholder="Quantity"
                  className="border rounded px-2 py-2 bg-white"
                />
              </div>

              <div className="flex flex-col text-sm">
                <label className="px-1">Size</label>

                <input
                  {...register(`variations.${idx}.sku`)}
                  placeholder="Variation SKU"
                  className="border rounded px-2 py-2 bg-white"
                />
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register(`variations.${idx}.inStock`)}
                />
                In Stock
              </label>
            </div>
            <button
              type="button"
              onClick={() => removeVariation(idx)}
              className="text-sm text-red-600 cursor-pointer  mt-2"
            >
              Remove Variation
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => appendVariation(productDefaultValues.variations[0])}
          className="bg-c1 text-sm cursor-pointer  text-white px-3 py-1 rounded"
        >
          Add Variation
        </button>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Thumbnail Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleThumbnailChange}
          className="border p-2 w-full"
        />
        {thumbnailPreview && (
          <div className="relative inline-block w-24 h-32  mt-2">
            <img
              src={thumbnailPreview}
              alt="Thumbnail Preview"
              className=" absolute inset-0 w-full h-full  rounded"
            />
            <button
              type="button"
              onClick={removeThumbnail}
              className="absolute top-0  size-5 cursor-pointer right-0 bg-red-500 text-white p-1 rounded-full text-xs"
            >
              ×
            </button>
          </div>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Product Images</label>
        <input
          type="file"
          id="product-images-input"
          accept="image/*"
          multiple
          onChange={handleImagesChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() =>
            document.getElementById("product-images-input").click()
          }
          className="bg-c1 text-sm text-white px-4 py-1 rounded hover:bg-c1/90"
        >
          + Add Images
        </button>

        {imagePreviews.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3">
            {imagePreviews.map((src, index) => (
              <div key={index} className="relative w-24 h-24 inline-block">
                <img
                  src={src}
                  alt={`Preview ${index + 1}`}
                  className="absolute inset-0 w-full h-full   rounded"
                />
                <button
                  type="button"
                  onClick={() => removeImageAtIndex(index)}
                  className="absolute -top-2 -right-1 bg-red-600 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center"
                  title="Remove Image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" {...register("isActive")} />
        <label className="font-medium">Product is Active</label>
      </div>

      <button
        type="submit"
        className="bg-c1 w-full text-white px-6 py-2 rounded"
      >
        Submit Product
      </button>
    </form>
  );
};

export default ProductForm;
