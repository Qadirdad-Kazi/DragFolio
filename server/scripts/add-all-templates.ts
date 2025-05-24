import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory path in ES modules
const __filename = fileURLToPath(import.meta.url);
const scriptsDir = path.dirname(__filename);

console.log('Starting to add all templates to the database...');

// Function to run a script and return a promise
const runScript = (scriptName: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(scriptsDir, scriptName);
    console.log(`Running script: ${scriptName}`);
    
    exec(`npx tsx ${scriptPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing ${scriptName}:`, error);
        reject(error);
        return;
      }
      
      console.log(stdout);
      if (stderr) console.error(stderr);
      
      resolve();
    });
  });
};

// Run scripts in sequence
async function runAllScripts() {
  try {
    // First run add-sample-templates.ts to clear existing templates and add the first batch
    await runScript('add-sample-templates.ts');
    console.log('First batch of templates added successfully');
    
    // Then add more templates
    await runScript('add-more-templates.ts');
    console.log('Second batch of templates added successfully');
    
    // Finally add the last batch of templates
    await runScript('add-final-templates.ts');
    console.log('Final batch of templates added successfully');
    
    console.log('All templates have been added to the database!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding templates:', error);
    process.exit(1);
  }
}

runAllScripts();
