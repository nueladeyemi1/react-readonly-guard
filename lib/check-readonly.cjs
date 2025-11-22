'use strict';
var fs = require('fs');
var child_process = require('child_process');
var stagedFiles = process.argv.slice(2);
var readonlyFiles = stagedFiles.filter(function (file) {
  var existedBefore = true;
  var oldContent = '';
  try {
    oldContent = child_process.execSync("git show HEAD:\"" + file + "\"").toString();
  } catch (e) {
    existedBefore = false;
  }
  if (!existedBefore) return false;
  var newContent = fs.readFileSync(file, 'utf8');
  var oldReadonly = oldContent.includes('@readonly');
  var newReadonly = newContent.includes('@readonly');
  var oldUnlock = oldContent.includes('@unlock');
  var newUnlock = newContent.includes('@unlock');
  if (!oldReadonly) return false;
  if (newUnlock) return false;
  if (oldUnlock && !newUnlock) return false;
  return true;
});
if (readonlyFiles.length) {
  console.error("❌ Cannot commit changes to readonly files (add @unlock to modify):\n" + readonlyFiles.join("\n"));
  process.exit(1);
}
process.exit(0);
