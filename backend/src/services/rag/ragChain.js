const { getEncoding } = require('js-tiktoken');
const Groq = require('groq-sdk');
const { generateEmbedding } = require('./embeddings');
const { querySimilarChunks, upsertChunks } = require('./vectorStore');

// Use cl100k_base for more general tokenization
const enc = getEncoding('cl100k_base');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MAX_TOKENS_PER_CHUNK = 500;

/**
 * Splits text into chunks based on token count.
 * @param {string} text - The input text.
 * @returns {Array<string>} - Array of text chunks.
 */
const splitTextIntoChunks = (text) => {
  const tokens = enc.encode(text);
  const chunks = [];
  
  for (let i = 0; i < tokens.length; i += MAX_TOKENS_PER_CHUNK) {
    const chunkTokens = tokens.slice(i, i + MAX_TOKENS_PER_CHUNK);
    chunks.push(enc.decode(chunkTokens));
  }
  
  return chunks;
};

exports.splitTextIntoChunks = splitTextIntoChunks;

/**
 * Processes text, embeds chunks, and stores them.
 * @param {string} text - The input text.
 * @param {object} metadata - Metadata for the chunks.
 */
exports.trainWithText = async (text, metadata = {}) => {
  const chunks = splitTextIntoChunks(text);
  const records = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const embedding = await generateEmbedding(chunk);
    records.push({
      id: `${metadata.sourceId || 'doc'}_${Date.now()}_${i}`,
      vector: embedding,
      metadata: {
        ...metadata,
        text: chunk,
      },
    });
  }

  await upsertChunks(records);
};

/**
 * Executes the RAG pipeline to answer a question.
 * @param {string} question - The user's question.
 * @returns {Promise<{ answer: string, sources: string[] }>}
 */
exports.askQuestion = async (question) => {
  // 1. Generate embedding for query
  const queryEmbedding = await generateEmbedding(question);

  // 2. Fetch similar chunks
  const searchResults = await querySimilarChunks(queryEmbedding, 5);
  console.log(`[RAG Debug] Retrieved ${searchResults?.length || 0} similar chunks from Vector DB.`);
  
  if (!searchResults || searchResults.length === 0) {
    return {
      answer: "I don't have enough information to answer that question.",
      sources: [],
    };
  }

  // 3. Prepare context
  const context = searchResults
    .map((res) => res.metadata.text)
    .join('\n\n---\n\n');
  
  const sources = searchResults.map((res) => res.metadata.source || 'Unknown');

  // 4. Generate answer with Groq (Llama 3.3)
  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { 
          role: 'system', 
          content: 'You are a helpful AI assistant. Answer the user\'s question based ONLY on the following context. If the context does not contain enough information to answer, say "I don\'t have enough information".' 
        },
        { 
          role: 'user', 
          content: `Context:\n${context}\n\nQuestion: ${question}\n\nAnswer:` 
        }
      ],
      temperature: 0,
    });

    const answer = response.choices[0].message.content.trim();

    return {
      answer,
      sources: [...new Set(sources)], // Unique sources
    };
  } catch (error) {
    console.error('Groq LLM Error:', error.message);
    throw new Error(`Failed to generate answer via Groq: ${error.message}`);
  }
};
