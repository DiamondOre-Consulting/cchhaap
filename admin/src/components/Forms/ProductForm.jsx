import React, { useEffect, useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { getAllCategories } from "@/Redux/Slices/categorySlice";
import { productDefaultValues } from "@/constant/formDefaults";
import { useDispatch } from "react-redux";
import JoditEditor from "jodit-react";
import { HexColorPicker } from "react-colorful";
import { getAllAttributes } from "@/Redux/Slices/attributesSlice";
import { v4 as uuidv4 } from "uuid";
import { createProduct, editProduct } from "@/Redux/Slices/productSlice";

const ProductForm = ({
  formState,
  allAttributes,
  setProductPopUp,
  singleData,
  handleGetAllProducts,
}) => {
  const [categories, setCategories] = useState([]);
  const [subOptions, setSubOptions] = useState([]);
  const [selectedAttributeDefinition, setSelectedAttributeDefinition] =
    useState(null);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const dispatch = useDispatch();
  const editor = useRef(null);
  const fileInputRefs = useRef({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useForm({ defaultValues: productDefaultValues });

  const {
    fields: variationFields,
    append: appendVariation,
    remove: removeVariation,
  } = useFieldArray({
    control,
    name: "variations",
  });

  const config = {
    readonly: false,
    placeholder: "Enter text here...",
    height: 250,
  };

  useEffect(() => {
    const handleGetAllCategories = async () => {
      try {
        const response = await dispatch(getAllCategories());
        setCategories(response?.payload?.data);
      } catch (error) {
        console.log(error);
      }
    };
    handleGetAllCategories();
  }, [dispatch]);

  useEffect(() => {
    const selectedCat = watch("category");
    const cat = categories.find((c) => c._id === selectedCat);
    setSubOptions(cat?.subCategories || []);
  }, [watch("category"), categories]);

  const getUniqueCode = () => uuidv4().slice(0, 8);

  const handleThumbnailChange = (e, idx) => {
    const file = e.target.files[0];
    if (file) {
      const existingThumbnail = getValues(`variations.${idx}.thumbnailImage`);
      const uniqueCode = existingThumbnail?.uniqueId || getUniqueCode();
      const fileName = `${uniqueCode}.${file.name.split(".").pop()}`;
      const previewUrl = URL.createObjectURL(file);
      setValue(`variations.${idx}.thumbnailImage`, {
        secureUrl: previewUrl,
        publicId: "",
        uniqueId: uniqueCode,
        file: new File([file], fileName, { type: file.type }),
        isNew: true,
      });
    }
    e.target.value = null;
  };

  const handleImageReplace = (e, idx, imgIdx) => {
    const file = e.target.files[0];
    if (file) {
      const currentImages = [...getValues(`variations.${idx}.images`)];
      const existingImage = currentImages[imgIdx];
      const uniqueCode =
        existingImage?.uniqueId || `${getUniqueCode()}-${imgIdx}`;
      const fileName = `${uniqueCode}.${file.name.split(".").pop()}`;

      currentImages[imgIdx] = {
        secureUrl: URL.createObjectURL(file),
        publicId: "",
        uniqueId: uniqueCode,
        file: new File([file], fileName, { type: file.type }),
        type: file.type.startsWith("video") ? "video" : "image",
        isNew: true,
      };

      setValue(`variations.${idx}.images`, currentImages, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
    e.target.value = null;
  };

  const handleMediaChange = (e, idx) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const currentMedia = getValues(`variations.${idx}.images`) || [];

    const newMedia = files.map((file, i) => {
      const uniqueCode = `${getUniqueCode()}`;
      const fileName = `${uniqueCode}.${file.name.split(".").pop()}`;
      return {
        secureUrl: URL.createObjectURL(file),
        publicId: "",
        uniqueId: uniqueCode,
        file: new File([file], fileName, { type: file.type }),
        type: file.type.startsWith("video") ? "video" : "image",
        isNew: true,
      };
    });

    e.target.value = null;
    setValue(`variations.${idx}.images`, [...currentMedia, ...newMedia], {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const removeImageAtIndex = (idx, imageIdx) => {
    const currentImages = getValues(`variations.${idx}.images`);
    const imageToRemove = currentImages[imageIdx];

    if (imageToRemove.publicId) {
      console.log(
        `Image with publicId ${imageToRemove.publicId} should be deleted`
      );
    }

    const updatedImages = currentImages.filter((_, i) => i !== imageIdx);
    setValue(`variations.${idx}.images`, updatedImages);
  };

  const handleAttributeDefChange = (e, idx) => {
    const selectedId = e.target.value;
    const selectedDefinition = allAttributes.find(
      (attr) => attr._id === selectedId
    );
    setValue(`variations.${idx}.attributeDefinition`, selectedDefinition?._id);
    setSelectedAttributeDefinition(selectedDefinition);
    setSelectedLabel(null);
  };

  const handleLabelChange = (e) => {
    const selectedLabelId = e.target.value;
    if (!selectedAttributeDefinition) return;

    const selectedLabel = selectedAttributeDefinition.attributes.find(
      (attr) => attr._id === selectedLabelId
    );
    setSelectedLabel(selectedLabel);
  };

 const handleOptionChange = (e, idx) => {
  const selectedOption = e.target.value;
  const labelName = selectedLabel?.name;

  if (!labelName || !selectedOption) return;

  // Get current attributes
  const currentAttributes = getValues(`variations.${idx}.attributes`) || {};
  
  // Update with new attribute
  setValue(`variations.${idx}.attributes`, {
    ...currentAttributes,
    [labelName]: selectedOption
  });

  // Clear selection UI (keep definition)
  setSelectedLabel(null);
};
  const removeAttribute = (idx, key) => {
    const currentAttrs = getValues(`variations.${idx}.attributes`);
    const newAttrs = { ...currentAttrs };
    delete newAttrs[key];
    setValue(`variations.${idx}.attributes`, newAttrs);
  };

  const addNewAttribute = (idx) => {
    const labelName = selectedLabel?.name;
    const selectedValue = getValues(
      `variations.${idx}.attributes.${labelName}`
    );

    if (labelName && selectedValue) {
      setValue(`variations.${idx}.attributeDefinition`, "");
      setSelectedAttributeDefinition(null);
      setSelectedLabel(null);
    }
  };

  const addVariation = () => {
    appendVariation({
      size: "",
      color: { name: "", hex: "" },
      price: 0,
      gender: "",
      discountPrice: 0,
      quantity: 0,
      sku: "",
      inStock: true,
      soldCount: 0,
      thumbnailImage: {
        secureUrl: "",
        publicId: "",
        uniqueId: getUniqueCode(),
        file: null,
        isNew: false,
      },
      images: [],
      attributes: {},
      attributeDefinition: "",
    });
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    setIsSubmitting(true);

    formData.append("productName", data.productName);
    formData.append("brandName", data.brandName);
    formData.append("category", data.category);
    formData.append("description", data.description);
    formData.append("isActive", data.isActive);
    formData.append("featuredProduct", data.featuredProduct);

    formData.append("sku", data.sku);

    data.subCategory.forEach((sub, i) => {
      formData.append(`subCategory[${i}]`, sub);
    });

    data.variations.forEach((variation, index) => {
      if (variation._id) {
        console.log("enter", variation._id);
        formData.append(`variations[${index}][_id]`, variation._id);
      }
      if (variation.size)
        formData.append(`variations[${index}][size]`, variation.size);
      if (variation.color?.name)
        formData.append(
          `variations[${index}][color][name]`,
          variation.color.name
        );
      if (variation.color?.hex)
        formData.append(
          `variations[${index}][color][hex]`,
          variation.color.hex
        );
      if (variation.price !== undefined)
        formData.append(`variations[${index}][price]`, variation.price);
      if (variation.gender !== undefined)
        formData.append(`variations[${index}][gender]`, variation.gender);
      if (variation.discountPrice !== undefined)
        formData.append(
          `variations[${index}][discountPrice]`,
          variation.discountPrice
        );
      if (variation.quantity !== undefined)
        formData.append(`variations[${index}][quantity]`, variation.quantity);
      formData.append(`variations[${index}][inStock]`, variation.inStock);
      if (variation.attributeDefinition)
        formData.append(
          `variations[${index}][attributeDefinition]`,
          variation.attributeDefinition
        );

      if (variation.thumbnailImage?.isNew && variation.thumbnailImage.file) {
        // Create new File with uniqueId name
        const renamedFile = new File(
          [variation.thumbnailImage.file],
          `${
            variation.thumbnailImage.uniqueId
          }.${variation.thumbnailImage.file.name.split(".").pop()}`,
          { type: variation.thumbnailImage.file.type }
        );
        formData.append(`variations[${index}][thumbnailImage]`, renamedFile);
      }
      formData.append(
        `variations[${index}][thumbnailImage][uniqueId]`,
        variation.thumbnailImage.uniqueId
      );

      if (variation.images && variation.images.length > 0) {
        variation.images.forEach((img, imgIndex) => {
          if (img.isNew && img.file) {
            formData.append(`variations[${index}][images]`, img.file);
          }
          formData.append(
            `variations[${index}][images][${imgIndex}][uniqueId]`,
            img.uniqueId
          );
        });
      }

      Object.entries(variation.attributes || {}).forEach(([key, value]) => {
        formData.append(`variations[${index}][attributes][${key}]`, value);
      });
    });

    let res;
    try {
      if (singleData?._id) {
    res=  await dispatch(editProduct({ id: singleData._id, formData }));
      } else {
     res=   await dispatch(createProduct(formData));
      }
      await handleGetAllProducts()
     if (res?.payload?.success) {
      setProductPopUp(false);
    }
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (singleData && categories.length > 0) {
      const formattedData = {
        productName: singleData.productName || "",
        brandName: singleData.brandName || "",
        category: singleData.category?._id || "",
        subCategory: singleData.subCategory || [""],
        description: singleData.description || "",
        isActive: singleData.isActive ?? true,
        featuredProduct: singleData.featuredProduct ?? true,

        sku: singleData.sku || "",
        variations: (singleData.variations || []).map((v) => ({
          _id: v._id,
          size: v.size || "",
          color: {
            name: v.color?.name || "",
            hex: v.color?.hex || "#000000",
          },
          gender: v.gender || "",
          price: v.price || 0,
          discountPrice: v.discountPrice || 0,
          quantity: v.quantity || 0,
          inStock: v.inStock ?? true,
          soldCount: v.soldCount || 0,
          attributeDefinition: v.attributeDefinition || "",
          attributes: v.attributes || {},
          thumbnailImage: {
            secureUrl: v.thumbnailImage?.secureUrl || "",
            publicId: v.thumbnailImage?.publicId || "",
            uniqueId: v.thumbnailImage?.uniqueId || getUniqueCode(),
            file: null,
            isNew: false,
          },
          images: (v.images || []).map((img) => ({
            secureUrl: img.secureUrl || "",
            publicId: img.publicId || "",
            uniqueId: img.uniqueId || getUniqueCode(),
            file: null,
            type: img.secureUrl?.includes(".mp4") ? "video" : "image",
            isNew: false,
          })),
        })),
      };
      reset(formattedData);
    }
  }, [singleData, categories, reset]);

  console.log("formData".formData);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-2 h-[80vh] overflow-y-auto p-4"
    >
      <h2 className="text-xl font-semibold mb-4">
        {singleData ? "Edit Product" : "Add New Product"}
      </h2>

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
                  multiple
                  {...register("subCategory.0", f.validation)}
                  className={`w-full border rounded px-3 py-2 ${
                    !watch("category") ? "bg-gray-300" : ""
                  }`}
                  disabled={!watch("category")}
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

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Variations</h3>
        {variationFields.map((vf, idx) => {
          const variation = watch(`variations.${idx}`);
          return (
            <div
              key={vf.id}
              className="border p-4 rounded mb-4 bg-gray-50 space-y-3"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="flex flex-col text-sm">
                  <label className="px-1">Size</label>
                  <select
                    {...register(`variations.${idx}.size`)}
                    className="border rounded bg-white py-2"
                  >
                    <option value="">Select Size</option>
                    {["XS", "S", "M", "L", "XL", "XXL", "Free Size"].map(
                      (s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      )
                    )}
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
                  <label className="px-1">Fabric</label>
                  <select
                    {...register(`variations.${idx}.fabric`)}
                    className="border rounded px-2 py-2 bg-white"
                  >
                    <option value="">Select Fabric</option>
                    {[
                      "Cotton",
                      "Silk",
                      "Rayon",
                      "Polyester",
                      "Linen",
                      "Wool",
                      "Blended",
                      "Other",
                    ].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
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
                  <label className="px-1">Discount Type</label>
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
                  <label className="px-1">Gender</label>
                  <select
                    {...register(`variations.${idx}.gender`)}
                    className="border rounded px-2 py-2 bg-white"
                  >
                    <option value="">Select Gender</option>
                    {["Men", "Women", "Unisex", "Kids"].map((s) => (
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
              </div>

            <div className="col-span-full space-y-2">
  <h4 className="font-medium">Attributes</h4>

  {variation.attributes &&
    Object.entries(variation.attributes).map(([key, value]) => (
      <div key={key} className="flex gap-2 items-center">
        <span className="font-medium">{key}:</span>
        <span>{value}</span>
        <button
          type="button"
          onClick={() => removeAttribute(idx, key)}
          className="text-red-500 text-sm"
        >
          Remove
        </button>
      </div>
    ))}

  <div className="border p-4 rounded bg-gray-50">
    <label className="block mb-1 text-sm">Attribute Definition</label>
    <select
      onChange={(e) => handleAttributeDefChange(e, idx)}
      value={watch(`variations.${idx}.attributeDefinition`) || ""}
      className="w-full border px-3 py-2 rounded text-sm mb-4"
    >
      <option value="">Select Definition</option>
      {allAttributes.map((attr) => (
        <option key={attr._id} value={attr._id}>
          {attr.category?.categoryName}
        </option>
      ))}
    </select>

    {selectedAttributeDefinition && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block mb-1 text-sm">Label</label>
          <select
            onChange={handleLabelChange}
            value={selectedLabel?._id || ""}
            className="w-full border px-3 py-2 rounded text-sm"
          >
            <option value="">Select Label</option>
            {selectedAttributeDefinition?.attributes?.map((label) => (
              <option key={label._id} value={label._id}>
                {label.name}
              </option>
            ))}
          </select>
        </div>

        {selectedLabel && (
          <div>
            <label className="block mb-1 text-sm">Value</label>
            <select
              onChange={(e) => handleOptionChange(e, idx)}
              value="" // Force empty selection after choosing
              className="w-full border px-3 py-2 rounded text-sm"
            >
              <option value="">Select Value</option>
              {selectedLabel?.options?.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    )}
  </div>
</div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">
                  Thumbnail Image
                </label>
                <input
                  type="file"
                  id={`thumbnail-input-${idx}`}
                  accept="image/*"
                  onChange={(e) => handleThumbnailChange(e, idx)}
                  className="hidden"
                  ref={(el) => (fileInputRefs.current[`thumbnail-${idx}`] = el)}
                />
                {variation?.thumbnailImage?.secureUrl ? (
                  <div className="relative inline-block w-24 h-32 mt-2">
                    <img
                      src={variation?.thumbnailImage?.secureUrl}
                      alt="Thumbnail Preview"
                      className="absolute inset-0 w-full h-full rounded object-cover cursor-pointer"
                      onClick={() =>
                        fileInputRefs.current[`thumbnail-${idx}`]?.click()
                      }
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setValue(`variations.${idx}.thumbnailImage`, {
                          secureUrl: "",
                          publicId: "",
                          uniqueId: "",
                          file: null,
                          isNew: false,
                        });
                      }}
                      className="absolute top-0 size-5 cursor-pointer right-0 bg-red-500 text-white p-1 rounded-full text-xs"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      fileInputRefs.current[`thumbnail-${idx}`]?.click()
                    }
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
                  >
                    + Add Thumbnail
                  </button>
                )}
              </div>

              <div className="mb-4">
                <label className="block mb-1 font-medium">Product Images</label>
                <input
                  type="file"
                  id={`product-images-input-${idx}`}
                  accept="image/*,video/*"
                  multiple
                  onChange={(e) => handleMediaChange(e, idx)}
                  className="hidden"
                  ref={(el) => (fileInputRefs.current[`images-${idx}`] = el)}
                />
                <button
                  type="button"
                  onClick={() =>
                    fileInputRefs.current[`images-${idx}`]?.click()
                  }
                  className="bg-c1 text-sm text-white px-4 py-1 rounded hover:bg-c1/90"
                >
                  + Add Images and Videos
                </button>

                <div className="mt-4 flex flex-wrap gap-3">
                  {variation?.images?.map((img, imgIdx) => {
                    const inputId = `image-replace-${idx}-${imgIdx}`;
                    return (
                      <div
                        key={img?.uniqueId || imgIdx}
                        className="relative w-24 h-24 inline-block"
                      >
                        <input
                          type="file"
                          id={inputId}
                          accept="image/*,video/*"
                          onChange={(e) => handleImageReplace(e, idx, imgIdx)}
                          className="hidden"
                          ref={(el) =>
                            (fileInputRefs.current[`replace-${idx}-${imgIdx}`] =
                              el)
                          }
                        />
                        {img.type === "video" ? (
                          <video
                            src={img.secureUrl}
                            className="absolute inset-0 w-full h-full rounded object-cover cursor-pointer"
                            controls
                            onClick={() =>
                              fileInputRefs.current[
                                `replace-${idx}-${imgIdx}`
                              ]?.click()
                            }
                          />
                        ) : (
                          <img
                            src={img?.secureUrl}
                            alt={`Preview ${imgIdx + 1}`}
                            className="absolute inset-0 w-full h-full rounded object-cover cursor-pointer"
                            onClick={() =>
                              fileInputRefs.current[
                                `replace-${idx}-${imgIdx}`
                              ]?.click()
                            }
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => removeImageAtIndex(idx, imgIdx)}
                          className="absolute -top-2 -right-1 bg-red-600 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center"
                          title="Remove Image"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register(`variations.${idx}.inStock`)}
                />
                In Stock
              </label>

              <button
                type="button"
                onClick={() => removeVariation(idx)}
                className="text-sm text-red-600 cursor-pointer mt-2"
              >
                Remove Variation
              </button>
            </div>
          );
        })}

        <button
          type="button"
          onClick={addVariation}
          className="bg-c1 text-sm cursor-pointer text-white px-3 py-1 rounded"
        >
          Add Variation
        </button>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <input type="checkbox" {...register("isActive")} />
        <label className="font-medium">Product is Active</label>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <input type="checkbox" {...register("featuredProduct")} />
        <label className="font-medium">Featured Product </label>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button
          type="button"
          onClick={() => setProductPopUp(false)}
          className="bg-gray-500 text-white px-6 py-2 rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-c1 text-white px-6 py-2 rounded"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Processing..."
            : singleData
            ? "Update Product"
            : "Create Product"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
