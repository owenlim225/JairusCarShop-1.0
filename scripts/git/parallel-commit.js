#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Configuration
const config = {
  maxConcurrentCommits: 5, // Maximum number of parallel commits
  commitMessagePrefix: 'feat', // Default commit message prefix
  dryRun: false, // Set to true to see what would be committed without actually committing
  excludePatterns: [
    'node_modules/**',
    '.git/**',
    '*.log',
    '*.tmp',
    '.DS_Store',
    'Thumbs.db'
  ]
};

// Utility functions
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Get the git repository root directory
function getGitRoot() {
  try {
    const root = execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim();
    return root;
  } catch (error) {
    log('Error finding git root:', 'red');
    log(error.message, 'red');
    process.exit(1);
  }
}

function getChangedFiles() {
  try {
    const gitRoot = getGitRoot();
    const currentDir = process.cwd();
    
    // Run git status from repository root
    const output = execSync('git status --porcelain', { 
      encoding: 'utf8',
      cwd: gitRoot 
    });
    
    return output
      .split('\n')
      .filter(line => line.trim())
      .map(line => {
        const status = line.substring(0, 2);
        const file = line.substring(3);
        return { status, file };
      })
      .filter(({ file }) => {
        // Filter out excluded patterns
        return !config.excludePatterns.some(pattern => {
          const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'));
          return regex.test(file);
        });
      })
      .map(({ status, file }) => {
        // Handle files with spaces by ensuring proper quoting
        // Remove any existing quotes and re-add them properly
        const cleanFile = file.replace(/^["']|["']$/g, '');
        return { status, file: cleanFile };
      });
  } catch (error) {
    log('Error getting git status:', 'red');
    log(error.message, 'red');
    process.exit(1);
  }
}

function getCommitMessage(file, status) {
  const fileName = path.basename(file);
  const fileExt = path.extname(file);
  const fullPath = file.split('/');
  const dirName = fullPath.length > 1 ? fullPath[fullPath.length - 2] : '';
  const parentDir = fullPath.length > 2 ? fullPath[fullPath.length - 3] : '';
  
  // Determine file category and purpose
  let category = '';
  let purpose = '';
  
  // Planning documents
  if (file.includes('planning/')) {
    category = 'planning';
    if (fileName.includes('Executive-Summary')) purpose = 'executive summary';
    else if (fileName.includes('Objectives')) purpose = 'objectives and metrics';
    else if (fileName.includes('Scope')) purpose = 'scope definition';
    else if (fileName.includes('Architecture')) purpose = 'system architecture';
    else if (fileName.includes('Technical-Execution')) purpose = 'technical execution workflow';
    else if (fileName.includes('Timeline')) purpose = 'project timeline';
    else if (fileName.includes('Resource')) purpose = 'resource planning';
    else if (fileName.includes('Risk')) purpose = 'risk management';
    else if (fileName.includes('Execution-Strategy')) purpose = 'execution strategy';
    else if (fileName.includes('Monitoring')) purpose = 'monitoring and reporting';
    else if (fileName.includes('ROI')) purpose = 'ROI and value realization';
    else if (fileName.includes('Governance')) purpose = 'governance and decision-making';
    else if (fileName.includes('Lessons')) purpose = 'lessons learned';
    else if (fileName.includes('Master-Index')) purpose = 'master index';
  }
  // Documentation
  else if (file.includes('docs/mdx/')) {
    category = 'docs';
    if (fileName.includes('getting-started')) purpose = 'getting started guide';
    else if (fileName.includes('planning-framework')) purpose = 'planning framework docs';
    else if (fileName.includes('technical-guide')) purpose = 'technical guide';
    else if (fileName.includes('claude-skills')) purpose = 'Claude skills documentation';
    else if (fileName.includes('quick-reference')) purpose = 'quick reference';
    else if (fileName.includes('use-cases')) purpose = 'use cases';
    else if (fileName.includes('skills-examples')) purpose = 'skills examples';
    else if (fileName.includes('faq')) purpose = 'FAQ';
  }
  // Reference guides
  else if (file.includes('docs/reference/')) {
    category = 'docs';
    if (fileName.includes('TECHNICAL-SUMMARY')) purpose = 'technical summary';
    else if (fileName.includes('SYSTEM-ARCHITECTURE')) purpose = 'system architecture reference';
    else if (fileName.includes('COMPLETE-MONOREPO')) purpose = 'monorepo structure';
    else if (fileName.includes('ARCHITECTURE-VISUAL')) purpose = 'architecture visual map';
    else if (fileName.includes('MASTER-FILE-INDEX')) purpose = 'master file index';
    else if (fileName.includes('API-REFERENCE')) purpose = 'API reference';
  }
  // Claude Skills
  else if (file.includes('.claude/skills/')) {
    category = 'claude';
    if (fileName === 'SKILL.md') {
      const skillName = fullPath[fullPath.length - 2];
      purpose = `${skillName} skill definition`;
    } else if (file.includes('references/')) {
      purpose = 'skill reference documentation';
    } else if (file.includes('scripts/')) {
      purpose = 'skill automation script';
    }
  }
  // Configuration files
  else if (fileExt === '.json' && (fileName === 'package.json' || fileName === 'tsconfig.json')) {
    category = 'config';
    purpose = fileName.replace('.json', '') + ' configuration';
  }
  else if (fileExt === '.js' && (fileName.includes('config') || fileName.includes('eslint') || fileName.includes('prettier'))) {
    category = 'config';
    purpose = fileName.replace('.js', '') + ' configuration';
  }
  // Source code
  else if (file.includes('src/')) {
    category = 'src';
    if (file.includes('components/')) purpose = 'React component';
    else if (file.includes('app/')) purpose = 'Next.js page';
    else if (file.includes('lib/')) purpose = 'utility function';
    else if (file.includes('types/')) purpose = 'TypeScript type definition';
  }
  // Scripts
  else if (file.includes('scripts/')) {
    category = 'scripts';
    if (file.includes('git/')) purpose = 'git automation script';
    else if (file.includes('claude-skills/')) purpose = 'Claude skills setup script';
    else purpose = 'automation script';
  }
  // Tests
  else if (file.includes('__tests__/') || file.includes('.test.') || file.includes('.spec.')) {
    category = 'test';
    purpose = 'test file';
  }
  // Root documentation
  else if (fileExt === '.md' && (fileName === 'README.md' || fileName === 'START-HERE.md' || fileName === 'QUICK-START.md')) {
    category = 'docs';
    purpose = fileName.replace('.md', '').toLowerCase().replace('-', ' ') + ' documentation';
  }
  
  // Generate specific commit message
  let message = '';
  const action = status.includes('A') ? 'add' : 
                 status.includes('M') ? 'update' : 
                 status.includes('D') ? 'remove' : 
                 status.includes('R') ? 'refactor' : 
                 status.includes('??') ? 'add' : 'chore';
  
  if (category && purpose) {
    message = `${action}: ${purpose}`;
    if (dirName && dirName !== '.' && !dirName.includes('.') && !message.includes(dirName)) {
      message += ` in ${dirName}`;
    }
  } else {
    // Fallback to file-based message
    // For deleted files, extract meaningful name from path
    if (status.includes('D')) {
      const pathParts = file.split('/');
      const meaningfulName = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2] || fileName;
      message = `${action}: ${meaningfulName}`;
      if (file.includes('.claude-plugin')) {
        message = `${action}: Claude plugin ${meaningfulName}`;
      }
    } else {
      message = `${action}: ${fileName}`;
    }
    if (dirName && dirName !== '.' && !dirName.includes('.')) {
      message += ` in ${dirName}`;
    }
  }
  
  return message;
}

function commitFile(file, status) {
  return new Promise((resolve, reject) => {
    const commitMessage = getCommitMessage(file, status);
    const gitRoot = getGitRoot();
    
    if (config.dryRun) {
      log(`[DRY RUN] Would commit: "${file}" - "${commitMessage}"`, 'yellow');
      resolve({ file, success: true, message: commitMessage });
      return;
    }
    
    try {
      // Add the specific file with proper quoting for spaces
      // Run from git root to ensure correct path resolution
      execSync(`git add "${file}"`, { 
        stdio: 'pipe',
        cwd: gitRoot 
      });
      
      // Commit the file with proper quoting for the message
      execSync(`git commit -m "${commitMessage}"`, { 
        stdio: 'pipe',
        cwd: gitRoot 
      });
      
      log(`✅ Committed: "${file}"`, 'green');
      resolve({ file, success: true, message: commitMessage });
    } catch (error) {
      log(`❌ Failed to commit "${file}": ${error.message}`, 'red');
      reject({ file, success: false, error: error.message });
    }
  });
}

function processCommitsInBatches(files) {
  const batches = [];
  for (let i = 0; i < files.length; i += config.maxConcurrentCommits) {
    batches.push(files.slice(i, i + config.maxConcurrentCommits));
  }
  
  return batches.reduce((promise, batch, batchIndex) => {
    return promise.then(() => {
      log(`\n📦 Processing batch ${batchIndex + 1}/${batches.length} (${batch.length} files)`, 'cyan');
      
      const promises = batch.map(({ file, status }) => commitFile(file, status));
      
      return Promise.allSettled(promises).then(results => {
        const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
        const failed = results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success)).length;
        
        log(`Batch ${batchIndex + 1} completed: ${successful} successful, ${failed} failed`, 
            failed > 0 ? 'yellow' : 'green');
        
        return results;
      });
    });
  }, Promise.resolve());
}

function showSummary(results) {
  const allResults = results.flat();
  const successful = allResults.filter(r => r.status === 'fulfilled' && r.value.success);
  const failed = allResults.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success));
  
  log('\n📊 Summary:', 'bright');
  log(`Total files processed: ${allResults.length}`, 'blue');
  log(`Successfully committed: ${successful.length}`, 'green');
  log(`Failed: ${failed.length}`, failed.length > 0 ? 'red' : 'green');
  
  if (failed.length > 0) {
    log('\n❌ Failed files:', 'red');
    failed.forEach(result => {
      const file = result.status === 'fulfilled' ? result.value.file : result.reason.file;
      const error = result.status === 'fulfilled' ? result.value.error : result.reason.error;
      log(`  - "${file}": ${error}`, 'red');
    });
  }
}

// Main execution
async function main() {
  log('🚀 Parallel Git Commit Script', 'bright');
  log('================================', 'bright');
  
  // Parse command line arguments
  const args = process.argv.slice(2);
  if (args.includes('--dry-run')) {
    config.dryRun = true;
    log('🔍 DRY RUN MODE - No actual commits will be made', 'yellow');
  }
  
  if (args.includes('--help') || args.includes('-h')) {
    log('\nUsage: node parallel-commit.js [options]', 'cyan');
    log('Options:', 'cyan');
    log('  --dry-run    Show what would be committed without actually committing', 'cyan');
    log('  --help, -h   Show this help message', 'cyan');
    log('\nConfiguration:', 'cyan');
    log(`  Max concurrent commits: ${config.maxConcurrentCommits}`, 'cyan');
    log(`  Commit message prefix: ${config.commitMessagePrefix}`, 'cyan');
    log(`  Exclude patterns: ${config.excludePatterns.join(', ')}`, 'cyan');
    return;
  }
  
  try {
    // Check if we're in a git repository and get root
    const gitRoot = getGitRoot();
    log(`📁 Git repository root: ${gitRoot}`, 'cyan');
    log(`📁 Current directory: ${process.cwd()}`, 'cyan');
  } catch (error) {
    log('❌ Not in a git repository!', 'red');
    process.exit(1);
  }
  
  // Get changed files
  log('\n🔍 Scanning for changed files...', 'blue');
  const changedFiles = getChangedFiles();
  
  if (changedFiles.length === 0) {
    log('✅ No changes to commit', 'green');
    return;
  }
  
  log(`Found ${changedFiles.length} changed files:`, 'blue');
  changedFiles.forEach(({ file, status }) => {
    const statusIcon = status.includes('A') ? '🆕' : 
                      status.includes('M') ? '📝' : 
                      status.includes('D') ? '🗑️' : 
                      status.includes('R') ? '🔄' : '❓';
    log(`  ${statusIcon} "${file}" (${status})`, 'blue');
  });
  
  // Process commits
  log(`\n⚡ Processing commits (max ${config.maxConcurrentCommits} concurrent)...`, 'cyan');
  const results = await processCommitsInBatches(changedFiles);
  
  // Show summary
  showSummary(results);
  
  if (!config.dryRun && results.flat().some(r => r.status === 'fulfilled' && r.value.success)) {
    log('\n🎉 All commits completed!', 'green');
  }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  log(`\n💥 Uncaught Exception: ${error.message}`, 'red');
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  log(`\n💥 Unhandled Rejection: ${reason}`, 'red');
  process.exit(1);
});

// Run the script
if (require.main === module) {
  main().catch(error => {
    log(`\n💥 Script failed: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { main, getChangedFiles, commitFile, config };
