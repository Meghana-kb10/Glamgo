import { execSync } from 'child_process';

/**
 * Glamgo Automated Git Synchronization Engine
 * Checks for unstaged or uncommitted changes, creates a structured commit,
 * and pushes to GitHub (master and main branches).
 */

function runCommand(command: string): string {
  try {
    return execSync(command, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch (err: any) {
    const stderr = err.stderr ? err.stderr.toString().trim() : err.message;
    throw new Error(`Command failed: ${command}\n${stderr}`);
  }
}

export function performGitSync(): { committed: boolean; message: string } {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  console.log(`\n[${timestamp}] 🔍 Checking git repository status...`);

  // 1. Check for uncommitted changes
  const status = runCommand('git status --porcelain');
  if (!status) {
    const msg = `✅ Working tree is clean. No uncommitted changes detected.`;
    console.log(`[${timestamp}] ${msg}`);
    return { committed: false, message: msg };
  }

  console.log(`[${timestamp}] 📝 Detected changes:\n${status}`);

  // 2. Stage all modifications (respecting .gitignore)
  console.log(`[${timestamp}] 📦 Staging files (git add -A)...`);
  runCommand('git add -A');

  // 3. Commit with structured timestamp
  const commitMessage = `auto(sync): daily backup snapshot [${timestamp}]`;
  console.log(`[${timestamp}] 💾 Committing: "${commitMessage}"...`);
  runCommand(`git commit -m "${commitMessage}"`);

  // 4. Push to remote branches
  console.log(`[${timestamp}] 🚀 Pushing to GitHub remote (origin master & main)...`);
  try {
    runCommand('git push origin master');
    runCommand('git push origin master:main');
    const successMsg = `🎉 Successfully committed and pushed changes to GitHub.`;
    console.log(`[${timestamp}] ${successMsg}`);
    return { committed: true, message: successMsg };
  } catch (pushErr: any) {
    console.warn(`⚠️ [${timestamp}] Push warning (commit saved locally): ${pushErr.message}`);
    return { committed: true, message: `Committed locally. Push notice: ${pushErr.message}` };
  }
}

// ----------------------------------------------------------------------------
// Execution CLI Mode
// ----------------------------------------------------------------------------
const isDaemon = process.argv.includes('--daemon');
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

if (isDaemon) {
  console.log(`===========================================================`);
  console.log(`⏳ Glamgo 24-Hour Git Auto-Sync Daemon Started`);
  console.log(`⏰ Timer interval: Every 24 hours (${TWENTY_FOUR_HOURS_MS} ms)`);
  console.log(`===========================================================\n`);

  // Perform initial check on launch
  try {
    performGitSync();
  } catch (err: any) {
    console.error(`❌ Initial sync error:`, err.message);
  }

  // Schedule every 24 hours
  setInterval(() => {
    try {
      performGitSync();
    } catch (err: any) {
      console.error(`❌ Auto-sync error:`, err.message);
    }
  }, TWENTY_FOUR_HOURS_MS);
} else {
  // Single execution mode
  try {
    performGitSync();
  } catch (err: any) {
    console.error(`❌ Error during git sync:`, err.message);
    process.exit(1);
  }
}
