const {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  rmSync,
  readdirSync,
} = require("fs");

let PAGE_SEPARATOR = "________________\n";

/** @param {string} txt
 * @param {string }sep
 */
function processStuff(txt, sep = PAGE_SEPARATOR) {
  const pages = txt.split(PAGE_SEPARATOR);

  if (!existsSync("./pages")) {
    mkdirSync("./pages");
  } else {
    rmSync("./pages", { recursive: true });
    mkdirSync("./pages");
  }

  function toPageWithProcessedBody(page, idx) {
    return {
      title: page.title,
      body: processPage(page.body),
      id: idx,
    };
  }

  /**
   * @param {string} p
   */
  function toPage(p) {
    const page = p.trim().split("\n");
    return {
      title: page[0],
      body: page.slice(1).join("\n"),
    };
  }

  function storeMarkdownPage(pg) {
    const title = pg.title.trim().replace(/\ /g, "-");
    const dst = `./pages/${title}.markdown`;
    writeFileSync(dst, pg.body);
    return dst;
  }

  return pages.map(toPage).map(toPageWithProcessedBody).map(storeMarkdownPage);
}

/**
 * This function re-sources the MD code block (```format\ncodeAndStuff\n```)
 * by replacing `codeAndStuff` with the actual code.
 * If the format is `diff` or `bash` we skip it.
 * If the `codeAndStuff` contains `--snip--` we skip it.
 * @param {string} rs
 * */
const reSource = (rs) => {
  const unchanged = `
\`\`\`${rs.trim()}
\`\`\``;

  if (rs.includes("--snip--") || !rs.includes("// File:")) {
    return unchanged;
  }

  const lines = rs.split("\n");
  const format = lines[0];

  if (format.includes("diff") || format.includes("bash")) {
    return unchanged;
  }

  const filePath = lines[1].split(":")[1].trim();
  const fileContent = readFileSync("../../" + filePath).toString();
  return `
\`\`\`${format}
${fileContent.trim()}
\`\`\`
`;
};

/** @param {string} page */
function processPage(page) {
  const spacesAndShit = page
    .replace(/<aside>/g, "\n{%callout}")
    .replace(/<\/aside>/g, "{%/callout}\n")
    .replace(/(#.*?)\n/g, "\n$1\n\n")
    .replace(/\n{3,}/g, "\n\n");
  //   codeMasked.replace;

  const refSources = spacesAndShit.replace(
    /```(.*?)```/gs,
    (substr, replaceVal) => {
      return reSource(replaceVal);
    }
  );

  return (
    refSources
      .replace(/(```.*?```)/gs, (searchValue, replaceValue) => {
        // prefix every line with a @@t@@ in replaceValue
        return (
          "\n" +
          replaceValue
            .split("\n")
            .map((line) => {
              return `@@t@@${line}`;
            })
            .join("\n")
        );
      })
      .split("\n")
      .map((l) =>
        // skip code blocks and skip tables
        l.indexOf("@@t@@") == 0 || l.indexOf("|") == 0 ? l : `\n${l}\n`
      )
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
      .replace(/@@t@@/gs, "") + "\n"
  );
}

console.log(processStuff(readFileSync("./export.txt").toString()));
writeFileSync(
  "./pages/all.md",
  readdirSync("./pages")
    .map((file) => {
      return readFileSync("pages/" + file).toString();
    })
    .join("\n\n____________\n\n")
);
