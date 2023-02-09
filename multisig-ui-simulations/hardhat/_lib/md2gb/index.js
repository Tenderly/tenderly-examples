const { execSync } = require("child_process");
const {
  readFileSync,
  writeFileSync,
  mkdir,
  existsSync,
  rmSync,
  mkdirSync,
} = require("fs");

/** @param {string} src */
function toRtf(src) {
  // double up on what's missing
  src = src
    .replace(/```((?!\n)+)/g, "```\n\\`\\`\\`$1")
    .replace(/(```\n)/g, "\\`\\`\\`\n```");
  writeFileSync("doubled.md", src);
  console.log(src);
  execSync("pandoc -s doubled.md -o man.rtf");
  execSync("pandoc -s man.rtf -o sigled.md");
  const singled = readFileSync("sigled.md")
    .toString()
    .replace(/\`\`\`((?!\n).*?)/, "```$1");
  writeFileSync("sigled.md", singled);
}
if (existsSync("rtf")) {
  rmSync("rtf", { recursive: true });
}
mkdirSync("rtf");

toRtf(readFileSync("pages/Manual-Contract-Verification.markdown").toString());
