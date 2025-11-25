#!/usr/bin/env node
// scripts/create_product_test.js
// Simple test script to POST a product to the API. Set ADMIN_TOKEN and API_URL env vars if needed.

const API_URL = (process.env.API_URL || 'http://localhost:5000').replace(/\/+$/, '');
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || process.env.TOKEN || '';

async function run() {
  try {
    const imageUrl = process.env.TEST_IMAGE || `${API_URL}/uploads/1763948416380-861965060.png`;
    const product = {
      name: `Test Product ${Date.now()}`,
      description: 'Automated test product created by scripts/create_product_test.js',
      fullDescription: 'Full description for automated test product',
      price: 99.99,
      originalPrice: 129.99,
      discountPercentage: 23,
      images: [imageUrl],
      category: 'Test',
      rating: 4.5,
      features: ['auto-created', 'script-test'],
      inStock: true
    };

    const res = await fetch(`${API_URL}/api/products`, {
      method: 'POST',
      headers: Object.assign({ 'Content-Type': 'application/json' }, ADMIN_TOKEN ? { Authorization: `Bearer ${ADMIN_TOKEN}` } : {}),
      body: JSON.stringify(product)
    });

    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch (e) { data = text; }

    console.log('Request POST', `${API_URL}/api/products`);
    console.log('Status:', res.status);
    console.log('Response:', data);

    if (res.status >= 200 && res.status < 300) {
      console.log('✅ Product created (or API accepted request).');
    } else {
      console.warn('⚠️ Product creation returned non-2xx status.');
    }
  } catch (err) {
    console.error('❌ Error running create_product_test:', err);
    process.exit(1);
  }
}

run();
