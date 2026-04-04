const { HfInference } = require('@huggingface/inference');

const hf = new HfInference(process.env.HF_API_TOKEN);

/**
 * Generates an embedding for a given text using HuggingFace free inference.
 * Model: sentence-transformers/all-MiniLM-L6-v2 (384 dimensions)
 * @param {string} text - The input text or chunk.
 * @returns {Promise<number[]>} - The generated embedding vector.
 */
exports.generateEmbedding = async (text) => {
  try {
    const result = await hf.featureExtraction({
      model: 'sentence-transformers/all-MiniLM-L6-v2',
      inputs: text,
    });
    // HuggingFace returns a nested array or a single array depending on input.
    // Ensure it's a flat array of numbers.
    return Array.from(result);
  } catch (error) {
    console.error('HuggingFace Embedding Error:', error.message);
    throw new Error(`Failed to generate embedding: ${error.message}`);
  }
};
