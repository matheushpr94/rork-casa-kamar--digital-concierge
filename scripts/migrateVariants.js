#!/usr/bin/env node

/**
 * Firestore Migration Script: Normalize Service Variants
 * 
 * This script normalizes service variants in Firestore by ensuring both
 * 'name' and 'label' fields exist for backward compatibility.
 * 
 * Usage:
 *   node scripts/migrateVariants.js
 * 
 * Prerequisites:
 *   - Set GOOGLE_APPLICATION_CREDENTIALS environment variable
 *   - Install firebase-admin: npm install firebase-admin
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  // Check if service account key is provided via environment variable
  const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  
  if (!serviceAccountPath) {
    console.error('❌ Error: GOOGLE_APPLICATION_CREDENTIALS environment variable not set');
    console.error('   Please set it to the path of your Firebase service account key JSON file');
    console.error('   Example: export GOOGLE_APPLICATION_CREDENTIALS="/path/to/serviceAccountKey.json"');
    process.exit(1);
  }
  
  try {
    const serviceAccount = require(path.resolve(serviceAccountPath));
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      // Add your project ID if needed
      // projectId: 'your-project-id'
    });
    
    console.log('✅ Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing Firebase Admin SDK:', error.message);
    process.exit(1);
  }
}

const db = admin.firestore();

async function migrateServiceVariants() {
  console.log('🚀 Starting service variants migration...');
  
  let scannedCount = 0;
  let updatedCount = 0;
  let errorCount = 0;
  
  try {
    // Get all documents in the services collection
    const snapshot = await db.collection('services').get();
    
    console.log(`📊 Found ${snapshot.docs.length} service documents to scan`);
    
    // Process each document
    for (const doc of snapshot.docs) {
      scannedCount++;
      const data = doc.data();
      
      console.log(`\n📄 Processing service: ${data.name || doc.id}`);
      
      if (!data.variants) {
        console.log('   ⏭️  No variants found, skipping');
        continue;
      }
      
      let needsUpdate = false;
      let normalizedVariants;
      
      if (Array.isArray(data.variants)) {
        console.log(`   📋 Found ${data.variants.length} variants (array format)`);
        
        // Normalize array variants
        normalizedVariants = data.variants.map((variant, index) => {
          const normalized = { ...variant };
          
          // Ensure both name and label exist
          if (!normalized.name && normalized.label) {
            normalized.name = normalized.label;
            needsUpdate = true;
            console.log(`   ✏️  Variant ${index}: Added name from label: "${normalized.label}"`);
          }
          
          if (!normalized.label && normalized.name) {
            normalized.label = normalized.name;
            needsUpdate = true;
            console.log(`   ✏️  Variant ${index}: Added label from name: "${normalized.name}"`);
          }
          
          // Ensure id exists
          if (!normalized.id) {
            normalized.id = normalized.name || normalized.label || `variant_${index}`;
            needsUpdate = true;
            console.log(`   ✏️  Variant ${index}: Added id: "${normalized.id}"`);
          }
          
          return normalized;
        });
        
      } else if (typeof data.variants === 'object') {
        console.log('   🔄 Converting object variants to array format');
        
        // Convert object to array and normalize
        normalizedVariants = Object.entries(data.variants).map(([key, value]) => {
          const normalized = {
            id: key,
            name: value.name || value.label || key,
            label: value.label || value.name || key,
            price: value.price || 0,
            ...value // Preserve any other fields
          };
          
          console.log(`   ✏️  Converted variant "${key}" to array format`);
          return normalized;
        });
        
        needsUpdate = true;
      }
      
      // Update the document if changes were made
      if (needsUpdate && normalizedVariants) {
        try {
          await doc.ref.update({ variants: normalizedVariants });
          updatedCount++;
          console.log(`   ✅ Updated service "${data.name || doc.id}"`);
        } catch (updateError) {
          errorCount++;
          console.error(`   ❌ Error updating service "${data.name || doc.id}":`, updateError.message);
        }
      } else {
        console.log('   ✅ No changes needed');
      }
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
  
  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 MIGRATION SUMMARY');
  console.log('='.repeat(50));
  console.log(`📄 Documents scanned: ${scannedCount}`);
  console.log(`✅ Documents updated: ${updatedCount}`);
  console.log(`❌ Errors encountered: ${errorCount}`);
  console.log(`⏭️  Documents skipped: ${scannedCount - updatedCount - errorCount}`);
  
  if (updatedCount > 0) {
    console.log('\n🎉 Migration completed successfully!');
    console.log('   All service variants now have both "name" and "label" fields.');
  } else {
    console.log('\n✨ No updates were needed. All variants are already normalized.');
  }
  
  if (errorCount > 0) {
    console.log(`\n⚠️  ${errorCount} errors occurred during migration. Please check the logs above.`);
    process.exit(1);
  }
}

// Run the migration
migrateServiceVariants()
  .then(() => {
    console.log('\n👋 Migration script completed. Exiting...');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });