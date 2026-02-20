require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const sdk = require('node-appwrite');

const client = new sdk.Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject('698e14a7003c14806632')
    .setKey(process.env.APPWRITE_SECRET_KEY);

const storage = new sdk.Storage(client);

const PERMS = [
    sdk.Permission.read(sdk.Role.any()),
    sdk.Permission.create(sdk.Role.users()),
    sdk.Permission.update(sdk.Role.users()),
    sdk.Permission.delete(sdk.Role.users()),
];

async function main() {
    // 1. List existing buckets
    const list = await storage.listBuckets();
    console.log(`\nFound ${list.total} existing bucket(s):`);
    for (const b of list.buckets) {
        console.log(`  - ${b.$id} | ${b.name}`);
    }

    // 2. Delete all existing buckets
    if (list.total > 0) {
        console.log('\nDeleting existing buckets...');
        for (const b of list.buckets) {
            try {
                await storage.deleteBucket(b.$id);
                console.log(`  ✅ Deleted: ${b.$id}`);
            } catch (e) {
                console.log(`  ❌ Could not delete ${b.$id}: ${e.message}`);
            }
        }
    }

    // 3. Create single shared bucket
    console.log('\nCreating vagad-media bucket...');
    try {
        const bucket = await storage.createBucket(
            'vagad-media',
            'Vagad Media',
            PERMS,
            false,   // fileSecurity
            true,    // enabled
            10 * 1024 * 1024, // 10MB max file size
            ['image/jpeg', 'image/png', 'image/webp']
        );
        console.log(`  ✅ Created bucket: ${bucket.$id} | ${bucket.name}`);
    } catch (e) {
        if (e.code === 409) {
            console.log('  ⚠️  vagad-media already exists — skipping');
        } else {
            console.log(`  ❌ Failed: ${e.message}`);
        }
    }

    console.log('\nDone! Update your .env:');
    console.log('  NEXT_PUBLIC_APPWRITE_BUCKET_ID=vagad-media\n');
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
