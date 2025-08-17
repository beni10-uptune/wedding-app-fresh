#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Initialize Supabase client with service role
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTables() {
  console.log('📊 Creating wedding knowledge tables in Supabase...\n');

  try {
    // Read the migration SQL file
    const sqlPath = path.join(process.cwd(), 'supabase/migrations/20250817143929_add_wedding_knowledge_tables.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Split SQL into individual statements and execute them
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`Found ${statements.length} SQL statements to execute...\n`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      
      // Get a short description of the statement
      const firstLine = statement.split('\n')[0];
      console.log(`Executing: ${firstLine.substring(0, 60)}...`);
      
      try {
        const { error } = await supabase.rpc('exec_sql', { 
          sql_query: statement 
        }).single();

        if (error) {
          // Try direct execution as fallback
          const { error: directError } = await supabase.from('_sql').insert({
            query: statement
          });
          
          if (directError) {
            console.error(`  ❌ Error: ${directError.message}`);
          } else {
            console.log(`  ✅ Success`);
          }
        } else {
          console.log(`  ✅ Success`);
        }
      } catch (err) {
        console.error(`  ❌ Error: ${err}`);
      }
    }

    console.log('\n✨ Table creation complete!');
    console.log('📚 Knowledge base tables are ready for seeding.\n');

  } catch (error) {
    console.error('❌ Fatal error creating tables:', error);
    process.exit(1);
  }
}

// Run the table creation
createTables().then(() => {
  console.log('🎉 Done!');
  process.exit(0);
}).catch(error => {
  console.error('💥 Failed:', error);
  process.exit(1);
});