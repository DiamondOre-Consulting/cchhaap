


const attributeDefinitionSchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  attributes: [
    {
      name: { type: String, required: true },            
      options: [{ type: String, required: true }]
    }
  ]
});

const AttributeDefinition = mongoose.model("AttributeDefinition", attributeDefinitionSchema);
