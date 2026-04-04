const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000';
const LOG_FILE = path.join(__dirname, '../../test_results.log');

const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));

let accessToken = '';
let testEmail = 'test@craftcore.com';

const results = {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    failures: []
};

function log(message, isEnd = false) {
    console.log(message);
    fs.appendFileSync(LOG_FILE, message + '\n');
}

async function runTest(name, endpoint, options = {}) {
    results.total++;
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
                ...options.headers
            }
        });

        const data = await response.json().catch(() => ({}));
        
        const isSuccess = options.expectedStatus 
            ? response.status === options.expectedStatus 
            : response.ok;

        if (isSuccess) {
            results.passed++;
            log(`✅ PASS — [${name}] → Status: ${response.status}`);
            return { success: true, data, status: response.status };
        } else {
            results.failed++;
            const errorMsg = data.message || response.statusText || 'Unknown Error';
            log(`❌ FAIL — [${name}] → Status: ${response.status}, Error: "${errorMsg}"`);
            results.failures.push({ name, status: response.status, error: errorMsg });
            return { success: false, data, status: response.status };
        }
    } catch (error) {
        results.failed++;
        log(`❌ FAIL — [${name}] → Error: "${error.message}"`);
        results.failures.push({ name, error: error.message });
        return { success: false, error: error.message };
    }
}

async function start() {
    if (fs.existsSync(LOG_FILE)) fs.unlinkSync(LOG_FILE);
    log(`Starting Backend Test Suite - ${new Date().toISOString()}\n`);

    // 1. Health & Misc
    await runTest('Health Check', '/health', { expectedStatus: 200 });

    // 2. Auth Suite - Register
    let regResult = await runTest('Auth: Register', '/api/v1/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name: "Test User", email: testEmail, password: "Test@1234" }),
        expectedStatus: 201
    });

    if (regResult.status === 409) {
        testEmail = `test_${Date.now()}@craftcore.com`;
        log(`Note: Email already exists, retrying with ${testEmail}...`);
        regResult = await runTest('Auth: Register (Retry)', '/api/v1/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name: "Test User", email: testEmail, password: "Test@1234" }),
            expectedStatus: 201
        });
    }

    // 3. Auth Suite - Login
    const loginResult = await runTest('Auth: Login', '/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: testEmail, password: "Test@1234" }),
        expectedStatus: 200
    });

    if (loginResult.success && loginResult.data.data && loginResult.data.data.accessToken) {
        accessToken = loginResult.data.data.accessToken;
    } else if (loginResult.success && loginResult.data.accessToken) {
        accessToken = loginResult.data.accessToken;
    }

    // 4. Auth Suite - Get Me
    if (accessToken) {
        await runTest('Auth: Get Me', '/api/v1/auth/me', { expectedStatus: 200 });
    } else {
        results.skipped++;
        log('⏭️ SKIP — [Auth: Get Me] → Reason: No access token from login');
    }

    // 5. RAG Suite
    await runTest('RAG: Train', '/api/v1/rag/train', {
        method: 'POST',
        body: JSON.stringify({ text: "CraftCore is an AI-powered design tool." }),
        expectedStatus: 200
    });

    await runTest('RAG: Ask', '/api/v1/rag/ask', {
        method: 'POST',
        body: JSON.stringify({ question: "What is CraftCore?" }),
        expectedStatus: 200
    });

    await runTest('RAG: Train (Validation)', '/api/v1/rag/train', {
        method: 'POST',
        body: JSON.stringify({}),
        expectedStatus: 400
    });

    await runTest('RAG: Ask (Validation)', '/api/v1/rag/ask', {
        method: 'POST',
        body: JSON.stringify({}),
        expectedStatus: 400
    });

    // 6. Rate Limit Test
    log('\n--- Starting Rate Limit Test (25 rapid requests to /ask) ---');
    let hitRateLimit = false;
    for (let i = 0; i < 25; i++) {
        const res = await fetch(`${BASE_URL}/api/v1/rag/ask`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: "Quick test" })
        });
        if (res.status === 429) {
            hitRateLimit = true;
            break;
        }
    }
    
    results.total++;
    if (hitRateLimit) {
        results.passed++;
        log('✅ PASS — [Rate Limit Test] → Hit 429 as expected');
    } else {
        results.failed++;
        log('❌ FAIL — [Rate Limit Test] → Did not hit 429 after 25 requests');
        results.failures.push({ name: 'Rate Limit Test', error: 'Did not hit 429' });
    }

    log('\n=================================');
    log(`Total: ${results.total} | Passed: ${results.passed} | Failed: ${results.failed} | Skipped: ${results.skipped}`);
    log('=================================');
}

start().catch(err => {
    console.error('Fatal Test Error:', err);
    process.exit(1);
});
