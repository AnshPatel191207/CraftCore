require('dotenv').config();
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testKey() {
  console.log('Testing key:', process.env.OPENAI_API_KEY ? 'Present' : 'Missing');
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: 'Test embedding',
    });
    console.log('Success!', response.data[0].embedding.slice(0, 5));
  } catch (error) {
    console.error('OpenAI Test Error:', error.message);
    if (error.status === 401) {
      console.error('ERROR: 401 Unauthorized. The API key is likely invalid or revoked.');
    }
  }
}

testKey();
