import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";

const modes = ["public", "private", "fork"];
const methods = ["hardhat-plugin", "api"];
const types = ["automatic", "manual-simple", "manual-advanced"];
const examples = ["greeter", "maths"];

function npmRunCommand(mode: string, example: string, type: string) {
  return `${mode}:${example}:${type}`;
}

const runScripts = modes.flatMap((mode) => {
  return examples.flatMap((example) => {
    return types.map((type) => {
      if (mode == "fork") {
      }

      const PRIVATE_VERIF = `TENDERLY_PRIVATE_VERIFICATION=${
        mode == "private"
      }`;

      const AUTOVERIFICATION = `TENDERLY_AUTOMATIC_VERIFICATION=${
        type == "automatic"
      }`;

      const network = mode == "fork" ? "tenderly" : "ropsten";
      const scriptName = `${example}/${type}${
        mode == "fork" && type == "manual-advanced" ? "-fork" : ""
      }`;

      return [
        npmRunCommand(mode, example, type),
        `${PRIVATE_VERIF} ${AUTOVERIFICATION} hardhat run scripts/${scriptName}.ts --network ${network}`,
      ];
    });
  });
});

const runAll = modes.flatMap((mode) => {
  return examples.flatMap((example) => {
    return types.map((type) => {
      return {
        emoji: example === "maths" ? "🧮" : "✋",
        command: `npm run ${npmRunCommand(mode, example, type)}`,
        script: npmRunCommand(mode, example, type),
        example,
        mode,
        modeEmoji: mode == "private" ? "🔐" : mode === "public" ? "🔓" : "🍴",
        type,
        typeEmoji:
          type == "automatic" ? "⚙️" : type == "manual-simple" ? "✍️" : "✍️🛠",
      };
    });
  });
});

const runAllFile = `import { execSync } from "child_process";
import { writeFileSync } from "fs";

const executions: Record<string, any> = {}

const logExec = () => writeFileSync("exec.json", JSON.stringify(executions, null, 2));

const execAndLog = (cmd:{command: string, script: string, emoji: string, example: string, mode: string, modeEmoji: string, type: string, typeEmoji: string}) => {
  try{
  const ret = execSync(cmd.command)
    .toString()
    .split('\\n');

    executions[cmd.script] = {
      log: ret,
      setup: { mode: cmd.mode, type: cmd.type, example: cmd.example },
    };
    console.log(ret);
    logExec();
  }catch(e){
      console.error("ERROR", cmd, e)
  }
  console.log("\\n------------------------------------\\n");
}
${runAll
  .map(
    (cmd, idx) =>
      `
console.log('${idx + 1}/${runAll.length} ${cmd.mode} ${cmd.modeEmoji} ${
        cmd.example
      } ${cmd.emoji} ${cmd.type} ${cmd.typeEmoji}');
execAndLog(${JSON.stringify(cmd, null, 2)});
`
  )
  .join("\n")};
`;
writeFileSync("runall.ts", runAllFile);

const pack = JSON.parse(readFileSync("package.json").toString());
const scripts = runScripts.reduce(
  (acc, curr) => ({
    ...acc,
    [`${curr[0]}`]: curr[1],
  }),
  {}
);

pack.scripts = {
  ...scripts,
  "gen:scripts": "ts-node _lib/genRunScripts.ts",
  all: "ts-node _lib/runall.ts",
};

writeFileSync("package.json", JSON.stringify(pack, null, 2) + "\n");
