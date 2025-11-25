#!/usr/bin/env node
// scripts/remove_unsplash_images.js
// Removes Unsplash URLs from product.images by calling the API.
// Usage:
//   DRY run (default): node scripts/remove_unsplash_images.js
//   Apply changes: ADMIN_TOKEN=token node scripts/remove_unsplash_images.js --apply

const API_URL = (process.env.API_URL || 'http://localhost:5000').replace(/\/+$/, '');
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || process.env.TOKEN || '';
const args = process.argv.slice(2);
const APPLY = args.includes('--apply');

(async function main() {
  try {
    console.log('Fetching products from', `${API_URL}/api/products`);
    const res = await fetch(`${API_URL}/api/products`);
    if (!res.ok) {
      console.error('Failed to fetch products:', res.status, await res.text());
      process.exit(1);
    }
    const body = await res.json();
    const products = body.data || body || [];
    console.log(`Found ${products.length} products`);

    const toUpdate = [];

    for (const p of products) {
      const images = Array.isArray(p.images) ? p.images : (p.image ? [p.image] : []);
      const filtered = images.filter(url => typeof url === 'string' && !/unsplash\.com/.test(url));
      // If filtered results differ, schedule update
      const origCount = images.length;
      const newCount = filtered.length;
      if (newCount !== origCount) {
        toUpdate.push({ id: p.id || p._id || p._id?.toString(), name: p.name, before: images, after: filtered });
      }
    }

    if (toUpdate.length === 0) {
      console.log('No Unsplash URLs found in product images. Nothing to do.');
      return;
    }

    console.log(`Products to update (${toUpdate.length}):`);
    toUpdate.forEach(u => console.log(`- ${u.id} (${u.name}) images ${u.before.length} -> ${u.after.length}`));

    if (!APPLY) {
      console.log('\nDry run complete. To apply changes, run with --apply and provide ADMIN_TOKEN env var.');
      console.log('Example: ADMIN_TOKEN=yourtoken node scripts/remove_unsplash_images.js --apply');
      return;
    }

    if (!ADMIN_TOKEN) {
      console.error('ADMIN_TOKEN not provided. Cannot apply updates.');
      process.exit(1);
    }

    console.log('\nApplying updates...');
    for (const u of toUpdate) {
      const payload = { images: u.after };
      const updRes = await fetch(`${API_URL}/api/products/${u.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ADMIN_TOKEN}`
        },
        body: JSON.stringify(payload)
      });
      const text = await updRes.text();
      let data;
      try { data = JSON.parse(text); } catch (e) { data = text; }
      if (updRes.ok) {
        console.log(`Updated ${u.id}: ${u.before.length} -> ${u.after.length}`);
      } else {
        console.error(`Failed to update ${u.id}: status ${updRes.status}`, data);
      }
    }

    console.log('Done.');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
