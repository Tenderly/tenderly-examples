const fs = require("fs");

const ignore = `.idea
artifacts
cache
_lib
node_modules
typechain-types
.env
ejected
`;

const dest = "../ejected";
if (fs.existsSync(dest)) {
  fs.rmSync(dest, { recursive: true });
}
fs.mkdirSync(dest);

const ROOT = "../";

const notIgnored = (file) => ignore.indexOf(file) == -1;

fs.readdirSync(ROOT)
  .filter(notIgnored)
  .forEach((file) => {
    fs.cpSync(`${ROOT}/${file}`, `${dest}/${file}`, { recursive: true });
  });
