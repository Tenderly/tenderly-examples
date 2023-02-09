import { execSync } from "child_process";
import { writeFileSync } from "fs";

const executions: Record<string, any> = {};

const logExec = () =>
  writeFileSync("exec.json", JSON.stringify(executions, null, 2));

const execAndLog = (cmd: {
  command: string;
  script: string;
  emoji: string;
  example: string;
  mode: string;
  modeEmoji: string;
  type: string;
  typeEmoji: string;
}) => {
  try {
    const ret = execSync(cmd.command).toString().split("\n");

    executions[cmd.script] = {
      log: ret,
      setup: { mode: cmd.mode, type: cmd.type, example: cmd.example },
    };
    console.log(ret);
    logExec();
  } catch (e) {
    console.error("ERROR", cmd, e);
  }
  console.log("\n------------------------------------\n");
};

console.log("1/18 public 🔓 greeter ✋ automatic ⚙️");
execAndLog({
  emoji: "✋",
  command: "npm run public:greeter:automatic",
  script: "public:greeter:automatic",
  example: "greeter",
  mode: "public",
  modeEmoji: "🔓",
  type: "automatic",
  typeEmoji: "⚙️",
});

console.log("2/18 public 🔓 greeter ✋ manual-simple ✍️");
execAndLog({
  emoji: "✋",
  command: "npm run public:greeter:manual-simple",
  script: "public:greeter:manual-simple",
  example: "greeter",
  mode: "public",
  modeEmoji: "🔓",
  type: "manual-simple",
  typeEmoji: "✍️",
});

console.log("3/18 public 🔓 greeter ✋ manual-advanced ✍️🛠");
execAndLog({
  emoji: "✋",
  command: "npm run public:greeter:manual-advanced",
  script: "public:greeter:manual-advanced",
  example: "greeter",
  mode: "public",
  modeEmoji: "🔓",
  type: "manual-advanced",
  typeEmoji: "✍️🛠",
});

console.log("4/18 public 🔓 maths 🧮 automatic ⚙️");
execAndLog({
  emoji: "🧮",
  command: "npm run public:maths:automatic",
  script: "public:maths:automatic",
  example: "maths",
  mode: "public",
  modeEmoji: "🔓",
  type: "automatic",
  typeEmoji: "⚙️",
});

console.log("5/18 public 🔓 maths 🧮 manual-simple ✍️");
execAndLog({
  emoji: "🧮",
  command: "npm run public:maths:manual-simple",
  script: "public:maths:manual-simple",
  example: "maths",
  mode: "public",
  modeEmoji: "🔓",
  type: "manual-simple",
  typeEmoji: "✍️",
});

console.log("6/18 public 🔓 maths 🧮 manual-advanced ✍️🛠");
execAndLog({
  emoji: "🧮",
  command: "npm run public:maths:manual-advanced",
  script: "public:maths:manual-advanced",
  example: "maths",
  mode: "public",
  modeEmoji: "🔓",
  type: "manual-advanced",
  typeEmoji: "✍️🛠",
});

console.log("7/18 private 🔐 greeter ✋ automatic ⚙️");
execAndLog({
  emoji: "✋",
  command: "npm run private:greeter:automatic",
  script: "private:greeter:automatic",
  example: "greeter",
  mode: "private",
  modeEmoji: "🔐",
  type: "automatic",
  typeEmoji: "⚙️",
});

console.log("8/18 private 🔐 greeter ✋ manual-simple ✍️");
execAndLog({
  emoji: "✋",
  command: "npm run private:greeter:manual-simple",
  script: "private:greeter:manual-simple",
  example: "greeter",
  mode: "private",
  modeEmoji: "🔐",
  type: "manual-simple",
  typeEmoji: "✍️",
});

console.log("9/18 private 🔐 greeter ✋ manual-advanced ✍️🛠");
execAndLog({
  emoji: "✋",
  command: "npm run private:greeter:manual-advanced",
  script: "private:greeter:manual-advanced",
  example: "greeter",
  mode: "private",
  modeEmoji: "🔐",
  type: "manual-advanced",
  typeEmoji: "✍️🛠",
});

console.log("10/18 private 🔐 maths 🧮 automatic ⚙️");
execAndLog({
  emoji: "🧮",
  command: "npm run private:maths:automatic",
  script: "private:maths:automatic",
  example: "maths",
  mode: "private",
  modeEmoji: "🔐",
  type: "automatic",
  typeEmoji: "⚙️",
});

console.log("11/18 private 🔐 maths 🧮 manual-simple ✍️");
execAndLog({
  emoji: "🧮",
  command: "npm run private:maths:manual-simple",
  script: "private:maths:manual-simple",
  example: "maths",
  mode: "private",
  modeEmoji: "🔐",
  type: "manual-simple",
  typeEmoji: "✍️",
});

console.log("12/18 private 🔐 maths 🧮 manual-advanced ✍️🛠");
execAndLog({
  emoji: "🧮",
  command: "npm run private:maths:manual-advanced",
  script: "private:maths:manual-advanced",
  example: "maths",
  mode: "private",
  modeEmoji: "🔐",
  type: "manual-advanced",
  typeEmoji: "✍️🛠",
});

console.log("13/18 fork 🍴 greeter ✋ automatic ⚙️");
execAndLog({
  emoji: "✋",
  command: "npm run fork:greeter:automatic",
  script: "fork:greeter:automatic",
  example: "greeter",
  mode: "fork",
  modeEmoji: "🍴",
  type: "automatic",
  typeEmoji: "⚙️",
});

console.log("14/18 fork 🍴 greeter ✋ manual-simple ✍️");
execAndLog({
  emoji: "✋",
  command: "npm run fork:greeter:manual-simple",
  script: "fork:greeter:manual-simple",
  example: "greeter",
  mode: "fork",
  modeEmoji: "🍴",
  type: "manual-simple",
  typeEmoji: "✍️",
});

console.log("15/18 fork 🍴 greeter ✋ manual-advanced ✍️🛠");
execAndLog({
  emoji: "✋",
  command: "npm run fork:greeter:manual-advanced",
  script: "fork:greeter:manual-advanced",
  example: "greeter",
  mode: "fork",
  modeEmoji: "🍴",
  type: "manual-advanced",
  typeEmoji: "✍️🛠",
});

console.log("16/18 fork 🍴 maths 🧮 automatic ⚙️");
execAndLog({
  emoji: "🧮",
  command: "npm run fork:maths:automatic",
  script: "fork:maths:automatic",
  example: "maths",
  mode: "fork",
  modeEmoji: "🍴",
  type: "automatic",
  typeEmoji: "⚙️",
});

console.log("17/18 fork 🍴 maths 🧮 manual-simple ✍️");
execAndLog({
  emoji: "🧮",
  command: "npm run fork:maths:manual-simple",
  script: "fork:maths:manual-simple",
  example: "maths",
  mode: "fork",
  modeEmoji: "🍴",
  type: "manual-simple",
  typeEmoji: "✍️",
});

console.log("18/18 fork 🍴 maths 🧮 manual-advanced ✍️🛠");
execAndLog({
  emoji: "🧮",
  command: "npm run fork:maths:manual-advanced",
  script: "fork:maths:manual-advanced",
  example: "maths",
  mode: "fork",
  modeEmoji: "🍴",
  type: "manual-advanced",
  typeEmoji: "✍️🛠",
});
