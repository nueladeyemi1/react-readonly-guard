
import fs from "fs";
import { execSync } from "child_process";

export function checkReadonly(stagedFiles: string[]) {
  const readonlyFiles = stagedFiles.filter((file) => {
    let existedBefore = true;
    let oldContent = "";
    try {
      oldContent = execSync(`git show HEAD:"${file}"`).toString();
    } catch {
      existedBefore = false;
    }

    if (!existedBefore) return false;

    const newContent = fs.readFileSync(file, "utf8");

    const oldReadonly = oldContent.includes("@readonly");
    const newUnlock = newContent.includes("@unlock");

    if (!oldReadonly) return false;
    if (newUnlock) return false;

    return true;
  });

  if (readonlyFiles.length) {
    console.error("❌ Cannot commit changes to readonly files:");
    console.error(readonlyFiles.join("\n"));
    process.exit(1);
  }
}
