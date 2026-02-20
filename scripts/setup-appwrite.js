#!/usr/bin/env node
/**
 * VisitVagad — Appwrite Setup Script
 * Configures database, collections, indexes, storage buckets, and sample data.
 * Usage: node scripts/setup-appwrite.js
 */

require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const sdk = require('node-appwrite');

// ──────────────────────────────────────────────────────────────────────────────
// Config
// ──────────────────────────────────────────────────────────────────────────────
const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT || '698e14a7003c14806632';
const SECRET_KEY = process.env.APPWRITE_SECRET_KEY;
const DB_ID = 'vagad-db';

if (!SECRET_KEY) {
  console.error('\n❌  APPWRITE_SECRET_KEY is missing!');
  console.error('    Add it to .env.local:  APPWRITE_SECRET_KEY=your_api_key_here');
  console.error('    Get it from: https://cloud.appwrite.io → Your Project → Settings → API Keys\n');
  process.exit(1);
}

// ──────────────────────────────────────────────────────────────────────────────
// SDK init
// ──────────────────────────────────────────────────────────────────────────────
const client = new sdk.Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(SECRET_KEY);

const databases = new sdk.Databases(client);
const storage = new sdk.Storage(client);

// ──────────────────────────────────────────────────────────────────────────────
// Counters
// ──────────────────────────────────────────────────────────────────────────────
let collectionsCreated = 0;
let bucketsCreated = 0;
let recordsAdded = 0;

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────
async function tryCreate(label, fn) {
  try {
    const result = await fn();
    console.log(`  ✅  ${label}`);
    return result;
  } catch (e) {
    if (e.code === 409) {
      console.log(`  ⚠️   ${label} — already exists, skipping`);
    } else {
      console.error(`  ❌  ${label} — ${e.message}`);
    }
    return null;
  }
}

const PERMS_PUBLIC_READ = [
  sdk.Permission.read(sdk.Role.any()),
  sdk.Permission.create(sdk.Role.users()),
  sdk.Permission.update(sdk.Role.users()),
  sdk.Permission.delete(sdk.Role.users()),
];

// ──────────────────────────────────────────────────────────────────────────────
// 1. DATABASE
// ──────────────────────────────────────────────────────────────────────────────
async function setupDatabase() {
  console.log('\n📦  Creating Database...');
  const db = await tryCreate('Database: vagad-db', () =>
    databases.create(DB_ID, 'Vagad DB')
  );
  if (db) collectionsCreated++; // count db as 1 entity (will reset)
}

// ──────────────────────────────────────────────────────────────────────────────
// 2. COLLECTIONS
// ──────────────────────────────────────────────────────────────────────────────

async function createCollection(colId, colName, attributes, indexes) {
  console.log(`\n📂  Collection: ${colName} (${colId})`);

  const col = await tryCreate(`Collection "${colName}"`, () =>
    databases.createCollection(DB_ID, colId, colName, PERMS_PUBLIC_READ)
  );

  const existed = !col; // if col is null, it already existed — still add attrs
  if (col) collectionsCreated++;

  // Attributes (always attempt — idempotent via 409 catching)
  console.log(`     Adding attributes...`);
  for (const attr of attributes) {
    await tryCreate(`  attr: ${attr.key}`, attr.fn);
    await delay(150); // Appwrite needs brief gap between attribute creations
  }

  // Indexes
  if (indexes && indexes.length > 0) {
    console.log(`     Adding indexes...`);
    for (const idx of indexes) {
      await tryCreate(`  index: ${idx.key}`, idx.fn);
      await delay(150);
    }
  }
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ─── products ────────────────────────────────────────────────────────────────
async function setupProducts() {
  await createCollection('products', 'Products', [
    { key: 'name', fn: () => databases.createStringAttribute(DB_ID, 'products', 'name', 255, true) },
    { key: 'category', fn: () => databases.createEnumAttribute(DB_ID, 'products', 'category', ['bamboo_crafts', 'stone_carvings', 'textiles', 'warli', 'terracotta'], true) },
    { key: 'price', fn: () => databases.createIntegerAttribute(DB_ID, 'products', 'price', true) },
    { key: 'artisan_name', fn: () => databases.createStringAttribute(DB_ID, 'products', 'artisan_name', 255, true) },
    { key: 'artisan_verified', fn: () => databases.createBooleanAttribute(DB_ID, 'products', 'artisan_verified', true) },
    { key: 'description', fn: () => databases.createStringAttribute(DB_ID, 'products', 'description', 2000, false) },
    { key: 'tags', fn: () => databases.createStringAttribute(DB_ID, 'products', 'tags', 100, false, undefined, true) },
    { key: 'images', fn: () => databases.createStringAttribute(DB_ID, 'products', 'images', 500, false, undefined, true) },
    { key: 'district', fn: () => databases.createEnumAttribute(DB_ID, 'products', 'district', ['banswara', 'dungarpur'], true) },
    { key: 'click_collect', fn: () => databases.createBooleanAttribute(DB_ID, 'products', 'click_collect', false, true) },
  ], [
    { key: 'idx_category', fn: () => databases.createIndex(DB_ID, 'products', 'idx_category', sdk.IndexType.Key, ['category']) },
    { key: 'idx_district', fn: () => databases.createIndex(DB_ID, 'products', 'idx_district', sdk.IndexType.Key, ['district']) },
  ]);
}

// ─── stays ───────────────────────────────────────────────────────────────────
async function setupStays() {
  await createCollection('stays', 'Stays', [
    { key: 'name', fn: () => databases.createStringAttribute(DB_ID, 'stays', 'name', 255, true) },
    { key: 'location', fn: () => databases.createStringAttribute(DB_ID, 'stays', 'location', 255, true) },
    { key: 'district', fn: () => databases.createEnumAttribute(DB_ID, 'stays', 'district', ['banswara', 'dungarpur'], true) },
    { key: 'distance_from_landmark', fn: () => databases.createStringAttribute(DB_ID, 'stays', 'distance_from_landmark', 255, false) },
    { key: 'host_name', fn: () => databases.createStringAttribute(DB_ID, 'stays', 'host_name', 255, true) },
    { key: 'paryatan_mitra_level', fn: () => databases.createIntegerAttribute(DB_ID, 'stays', 'paryatan_mitra_level', false) },
    { key: 'rips_certified', fn: () => databases.createBooleanAttribute(DB_ID, 'stays', 'rips_certified', false, false) },
    { key: 'price_per_night', fn: () => databases.createIntegerAttribute(DB_ID, 'stays', 'price_per_night', true) },
    { key: 'rating', fn: () => databases.createFloatAttribute(DB_ID, 'stays', 'rating', false) },
    { key: 'review_count', fn: () => databases.createIntegerAttribute(DB_ID, 'stays', 'review_count', false, 0) },
    { key: 'images', fn: () => databases.createStringAttribute(DB_ID, 'stays', 'images', 500, false, undefined, true) },
    { key: 'type', fn: () => databases.createEnumAttribute(DB_ID, 'stays', 'type', ['farm_stay', 'heritage_home', 'eco_hut', 'riverside'], true) },
    { key: 'amenities', fn: () => databases.createStringAttribute(DB_ID, 'stays', 'amenities', 100, false, undefined, true) },
  ], [
    { key: 'idx_district', fn: () => databases.createIndex(DB_ID, 'stays', 'idx_district', sdk.IndexType.Key, ['district']) },
    { key: 'idx_type', fn: () => databases.createIndex(DB_ID, 'stays', 'idx_type', sdk.IndexType.Key, ['type']) },
    { key: 'idx_rips_certified', fn: () => databases.createIndex(DB_ID, 'stays', 'idx_rips_certified', sdk.IndexType.Key, ['rips_certified']) },
  ]);
}

// ─── artisans ────────────────────────────────────────────────────────────────
async function setupArtisans() {
  await createCollection('artisans', 'Artisans', [
    { key: 'name', fn: () => databases.createStringAttribute(DB_ID, 'artisans', 'name', 255, true) },
    { key: 'craft_type', fn: () => databases.createStringAttribute(DB_ID, 'artisans', 'craft_type', 255, true) },
    { key: 'village', fn: () => databases.createStringAttribute(DB_ID, 'artisans', 'village', 255, false) },
    { key: 'district', fn: () => databases.createEnumAttribute(DB_ID, 'artisans', 'district', ['banswara', 'dungarpur'], true) },
    { key: 'govt_verified', fn: () => databases.createBooleanAttribute(DB_ID, 'artisans', 'govt_verified', false, false) },
    { key: 'contact', fn: () => databases.createStringAttribute(DB_ID, 'artisans', 'contact', 20, false) },
    { key: 'bio', fn: () => databases.createStringAttribute(DB_ID, 'artisans', 'bio', 1000, false) },
    { key: 'profile_image', fn: () => databases.createStringAttribute(DB_ID, 'artisans', 'profile_image', 500, false) },
    { key: 'speciality', fn: () => databases.createStringAttribute(DB_ID, 'artisans', 'speciality', 255, false) },
  ]);
}

// ─── itineraries ─────────────────────────────────────────────────────────────
async function setupItineraries() {
  await createCollection('itineraries', 'Itineraries', [
    { key: 'user_id', fn: () => databases.createStringAttribute(DB_ID, 'itineraries', 'user_id', 255, false) },
    { key: 'title', fn: () => databases.createStringAttribute(DB_ID, 'itineraries', 'title', 255, true) },
    { key: 'days', fn: () => databases.createIntegerAttribute(DB_ID, 'itineraries', 'days', true) },
    { key: 'trip_type', fn: () => databases.createEnumAttribute(DB_ID, 'itineraries', 'trip_type', ['cultural', 'nature', 'spiritual', 'adventure', 'mixed'], true) },
    { key: 'interests', fn: () => databases.createStringAttribute(DB_ID, 'itineraries', 'interests', 100, false, undefined, true) },
    { key: 'generated_plan', fn: () => databases.createStringAttribute(DB_ID, 'itineraries', 'generated_plan', 50000, false) },
    { key: 'destinations', fn: () => databases.createStringAttribute(DB_ID, 'itineraries', 'destinations', 100, false, undefined, true) },
    { key: 'is_public', fn: () => databases.createBooleanAttribute(DB_ID, 'itineraries', 'is_public', false, false) },
    { key: 'created_at', fn: () => databases.createDatetimeAttribute(DB_ID, 'itineraries', 'created_at', false) },
  ]);
}

// ─── experiences ─────────────────────────────────────────────────────────────
async function setupExperiences() {
  await createCollection('experiences', 'Experiences', [
    { key: 'name', fn: () => databases.createStringAttribute(DB_ID, 'experiences', 'name', 255, true) },
    { key: 'type', fn: () => databases.createEnumAttribute(DB_ID, 'experiences', 'type', ['kayaking', 'tribal_craft', 'heritage_walk', 'camping', 'birdwatching', 'boating'], true) },
    { key: 'location', fn: () => databases.createStringAttribute(DB_ID, 'experiences', 'location', 255, true) },
    { key: 'district', fn: () => databases.createEnumAttribute(DB_ID, 'experiences', 'district', ['banswara', 'dungarpur'], true) },
    { key: 'duration_hours', fn: () => databases.createFloatAttribute(DB_ID, 'experiences', 'duration_hours', false) },
    { key: 'price_per_person', fn: () => databases.createIntegerAttribute(DB_ID, 'experiences', 'price_per_person', false) },
    { key: 'description', fn: () => databases.createStringAttribute(DB_ID, 'experiences', 'description', 2000, false) },
    { key: 'images', fn: () => databases.createStringAttribute(DB_ID, 'experiences', 'images', 500, false, undefined, true) },
    { key: 'difficulty', fn: () => databases.createEnumAttribute(DB_ID, 'experiences', 'difficulty', ['easy', 'moderate', 'hard'], false) },
    { key: 'guide_required', fn: () => databases.createBooleanAttribute(DB_ID, 'experiences', 'guide_required', false, false) },
    { key: 'available_months', fn: () => databases.createStringAttribute(DB_ID, 'experiences', 'available_months', 20, false, undefined, true) },
  ], [
    { key: 'idx_type', fn: () => databases.createIndex(DB_ID, 'experiences', 'idx_type', sdk.IndexType.Key, ['type']) },
    { key: 'idx_district', fn: () => databases.createIndex(DB_ID, 'experiences', 'idx_district', sdk.IndexType.Key, ['district']) },
  ]);
}

// ─── locations/destinations ───────────────────────────────────────────────────
async function setupDestinations() {
  await createCollection('destinations', 'Destinations', [
    { key: 'name', fn: () => databases.createStringAttribute(DB_ID, 'destinations', 'name', 255, true) },
    { key: 'district', fn: () => databases.createEnumAttribute(DB_ID, 'destinations', 'district', ['banswara', 'dungarpur'], true) },
    { key: 'type', fn: () => databases.createEnumAttribute(DB_ID, 'destinations', 'type', ['temple', 'dam', 'island', 'heritage', 'nature', 'tribal_village'], true) },
    { key: 'description', fn: () => databases.createStringAttribute(DB_ID, 'destinations', 'description', 3000, false) },
    { key: 'images', fn: () => databases.createStringAttribute(DB_ID, 'destinations', 'images', 500, false, undefined, true) },
    { key: 'latitude', fn: () => databases.createFloatAttribute(DB_ID, 'destinations', 'latitude', false) },
    { key: 'longitude', fn: () => databases.createFloatAttribute(DB_ID, 'destinations', 'longitude', false) },
    { key: 'entry_fee', fn: () => databases.createIntegerAttribute(DB_ID, 'destinations', 'entry_fee', false, 0) },
    { key: 'best_time_to_visit', fn: () => databases.createStringAttribute(DB_ID, 'destinations', 'best_time_to_visit', 255, false) },
    { key: 'tags', fn: () => databases.createStringAttribute(DB_ID, 'destinations', 'tags', 100, false, undefined, true) },
  ], [
    { key: 'idx_district', fn: () => databases.createIndex(DB_ID, 'destinations', 'idx_district', sdk.IndexType.Key, ['district']) },
    { key: 'idx_type', fn: () => databases.createIndex(DB_ID, 'destinations', 'idx_type', sdk.IndexType.Key, ['type']) },
  ]);
}

// ──────────────────────────────────────────────────────────────────────────────
// 3. STORAGE BUCKETS
// ──────────────────────────────────────────────────────────────────────────────
async function setupBuckets() {
  console.log('\n🗄️   Creating Storage Buckets...');

  const buckets = [
    { id: 'product-images', name: 'Product Images', maxSize: 5 * 1024 * 1024, types: ['image/jpeg', 'image/png', 'image/webp'] },
    { id: 'stay-images', name: 'Stay Images', maxSize: 10 * 1024 * 1024, types: ['image/jpeg', 'image/png', 'image/webp'] },
    { id: 'profile-images', name: 'Profile Images', maxSize: 2 * 1024 * 1024, types: ['image/jpeg', 'image/png', 'image/webp'] },
  ];

  for (const b of buckets) {
    const created = await tryCreate(`Bucket: ${b.name}`, () =>
      storage.createBucket(b.id, b.name, PERMS_PUBLIC_READ, false, true, b.maxSize, b.types)
    );
    if (created) bucketsCreated++;
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// 4. SAMPLE DATA
// ──────────────────────────────────────────────────────────────────────────────
async function insertSampleData() {
  console.log('\n📝  Inserting sample data...');

  // Products
  const products = [
    {
      name: 'Handwoven Bamboo Basket',
      category: 'bamboo_crafts',
      price: 450,
      artisan_name: 'Kalpana Devi',
      artisan_verified: true,
      district: 'banswara',
      description: 'A beautifully handwoven bamboo basket made using centuries-old Bhil weaving techniques. Perfect for storage and home décor.',
      click_collect: true,
    },
    {
      name: 'Traditional Clay Water Pot',
      category: 'terracotta',
      price: 280,
      artisan_name: 'Rajesh Kumar',
      artisan_verified: true,
      district: 'dungarpur',
      description: 'Hand-thrown terracotta water pot with natural cooling properties. Fired in a traditional kiln using local Dungarpur clay.',
      click_collect: true,
    },
    {
      name: 'Silver Bead Tribal Necklace',
      category: 'textiles',
      price: 1200,
      artisan_name: 'Meena Tribe Collective',
      artisan_verified: true,
      district: 'banswara',
      description: 'Handcrafted silver bead necklace with traditional Bhil tribal patterns. Each piece is unique, made by the Meena Tribe womens collective.',
      click_collect: true,
    },
  ];

  for (const p of products) {
    const doc = await tryCreate(`Product: ${p.name}`, () =>
      databases.createDocument(DB_ID, 'products', sdk.ID.unique(), p)
    );
    if (doc) recordsAdded++;
  }

  // Stays
  const stays = [
    {
      name: 'Mahi Riverside Retreat',
      location: 'Ghatol',
      district: 'banswara',
      host_name: 'Ramesh Bhil',
      price_per_night: 1800,
      rating: 4.9,
      review_count: 38,
      type: 'riverside',
      rips_certified: true,
      paryatan_mitra_level: 3,
      distance_from_landmark: '2 km from Mahi Dam',
      amenities: ['Home-cooked meals', 'River-view balcony', 'Bonfire', 'Boating'],
    },
    {
      name: 'Dungarpur Hilltop Haveli',
      location: 'Old City, Dungarpur',
      district: 'dungarpur',
      host_name: 'Meena Devi',
      price_per_night: 2400,
      rating: 4.8,
      review_count: 55,
      type: 'heritage_home',
      rips_certified: true,
      paryatan_mitra_level: 3,
      distance_from_landmark: '1 km from Juna Mahal',
      amenities: ['AC rooms', 'Rooftop dining', 'Heritage tour', 'Local cuisine'],
    },
    {
      name: 'Organic Farm Cottage',
      location: 'Sagwara, Dungarpur',
      district: 'dungarpur',
      host_name: 'Patel Family',
      price_per_night: 1800,
      rating: 4.7,
      review_count: 24,
      type: 'farm_stay',
      rips_certified: true,
      paryatan_mitra_level: 2,
      amenities: ['Organic breakfast', 'Farm tour', 'Yoga area', 'Solar power'],
    },
  ];

  for (const s of stays) {
    const doc = await tryCreate(`Stay: ${s.name}`, () =>
      databases.createDocument(DB_ID, 'stays', sdk.ID.unique(), s)
    );
    if (doc) recordsAdded++;
  }

  // Destinations
  const destinations = [
    {
      name: 'Tripura Sundari Temple',
      district: 'banswara',
      type: 'temple',
      description: 'One of 108 Shakti Peethas. A 1008 CE hilltop temple dedicated to Goddess Tripura Sundari with panoramic views of Banswara and its island-dotted backwaters.',
      latitude: 23.5467,
      longitude: 74.4567,
      entry_fee: 0,
      best_time_to_visit: 'October to March, especially at sunrise',
      tags: ['Shakti Peetha', 'Sunrise', 'Spiritual', 'Banswara'],
    },
    {
      name: 'Mahi Bajaj Sagar Dam',
      district: 'banswara',
      type: 'dam',
      description: 'The famous island-strewn reservoir giving Banswara the title "City of 100 Islands". Boat rides through the emerald islands are a must-do.',
      latitude: 23.5800,
      longitude: 74.4800,
      entry_fee: 0,
      best_time_to_visit: 'July to February for boating',
      tags: ['Boating', 'Islands', 'Nature', 'Photography'],
    },
    {
      name: 'Juna Mahal',
      district: 'dungarpur',
      type: 'heritage',
      description: 'A 13th-century multi-storied palace fortress adorned with intricate stone carvings, mirror-work frescoes, and elaborate wall paintings. One of Rajasthan\'s finest medieval gems.',
      latitude: 23.8412,
      longitude: 73.7149,
      entry_fee: 50,
      best_time_to_visit: 'October to March',
      tags: ['Heritage', 'Palace', 'Architecture', 'Dungarpur'],
    },
  ];

  for (const d of destinations) {
    const doc = await tryCreate(`Destination: ${d.name}`, () =>
      databases.createDocument(DB_ID, 'destinations', sdk.ID.unique(), d)
    );
    if (doc) recordsAdded++;
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// MAIN
// ──────────────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('  🌿  VisitVagad — Appwrite Setup Script');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`  Endpoint   : ${ENDPOINT}`);
  console.log(`  Project ID : ${PROJECT_ID}`);
  console.log(`  Database   : ${DB_ID}`);
  console.log('═══════════════════════════════════════════════════════\n');

  // Reset collection counter (we count separately from DB)
  collectionsCreated = 0;

  await setupDatabase();
  await setupProducts();
  await setupStays();
  await setupArtisans();
  await setupItineraries();
  await setupExperiences();
  await setupDestinations();
  await setupBuckets();

  // Wait a moment before inserting data to allow attributes to become active
  console.log('\n⏳  Waiting 4 seconds for attributes to become active...');
  await delay(4000);

  await insertSampleData();

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('  ✅  Setup Complete!');
  console.log(`  📂  Collections created/verified : 6`);
  console.log(`  🗄️   Buckets created             : ${bucketsCreated}`);
  console.log(`  📝  Sample records added         : ${recordsAdded}`);
  console.log('═══════════════════════════════════════════════════════');
  console.log('\n  Next steps:');
  console.log('  1. Fill in NEXT_PUBLIC_APPWRITE_PROJECT in .env');
  console.log('  2. Add GEMINI_API_KEY to .env');
  console.log('  3. Run: npm run dev');
  console.log('  4. Visit: http://localhost:3000\n');
}

main().catch(e => {
  console.error('\n❌  Fatal error:', e.message);
  process.exit(1);
});
