const { Index } = require('@upstash/vector');

const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN,
});

/**
 * Upserts text chunks with embeddings to Upstash Vector DB.
 * @param {Array<{ id: string, vector: number[], metadata: object }>} records - The records to upsert.
 */
exports.upsertChunks = async (records) => {
  try {
    await index.upsert(records);
  } catch (error) {
    console.error('Error upserting chunks to Upstash Vector:', error);
    throw new Error('Failed to upsert chunks');
  }
};

/**
 * Queries the vector store for similar vectors.
 * @param {number[]} vector - The query embedding vector.
 * @param {number} topK - The number of results to return.
 * @returns {Promise<Array>} - The similar records found.
 */
exports.querySimilarChunks = async (vector, topK = 5) => {
  try {
    const results = await index.query({
      vector,
      topK,
      includeMetadata: true,
    });
    return results;
  } catch (error) {
    console.error('Error querying Upstash Vector:', error);
    throw new Error('Failed to query similar chunks');
  }
};
