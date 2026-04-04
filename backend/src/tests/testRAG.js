require('dotenv').config();
const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));

async function runTest() {
  const BASE_URL = 'http://localhost:5000/api/v1/rag';
  
  console.log('Key loaded:', !!process.env.OPENAI_API_KEY);
  console.log('--- 1. Training RAG with sample data ---');
  const trainData = {
    text: "CraftCore is a unified platform for designers and developers. It features real-time collaboration, AI-powered UI generation, and seamless integration with Figma. The core team consists of elite AI engineers dedicated to pushing the boundaries of creative technology.",
    metadata: {
      source: "CraftCore Documentation",
      sourceId: "docs_001"
    }
  };

  try {
    const trainResponse = await fetch(`${BASE_URL}/train`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trainData)
    });

    const trainResult = await trainResponse.json();
    console.log('Train Response:', JSON.stringify(trainResult, null, 2));

    if (!trainResult.success) {
      console.error('Training failed. Stopping test.');
      return;
    }

    console.log('\n--- 2. Waiting 2 seconds for indexing ---');
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('\n--- 3. Asking a related question ---');
    const askData = {
      question: "What are the main features of CraftCore?"
    };

    const askResponse = await fetch(`${BASE_URL}/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(askData)
    });

    const askResult = await askResponse.json();
    console.log('Ask Response:', JSON.stringify(askResult, null, 2));

    if (askResult.success && askResult.data.answer.toLowerCase().includes('information')) {
      console.warn('Warning: AI returned restricted info message. Ensure Vector DB is correctly populated.');
    } else if (askResult.success) {
      console.log('RAG Test passed successfully!');
    }

  } catch (error) {
    console.error('Test Execution Error:', error.message);
    console.log('\nTIP: Make sure your backend server is running on http://localhost:5000');
  }
}

runTest();
