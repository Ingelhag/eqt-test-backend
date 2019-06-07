console.log(`🔵  Launching application with: 
    - NODE_ENV: "${process.env.NODE_ENV}"`);

console.log("🔵  Initiating Typescript...");

require("ts-node").register({
  fast: false,
  project: "./tsconfig.json",
  typeCheck: true
});

console.log("  ✅  Typescript initiated");
require("./src/server");
