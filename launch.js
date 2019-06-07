if (process.env.LOGLEVEL === undefined) {
  process.env.LOGLEVEL = "info";
}
console.log(`🔵  Launching application with: 
    - NODE_ENV: "${process.env.NODE_ENV}"
    - LOGLEVEL: "${process.env.LOGLEVEL}"`);

console.log("🔵  Initiating Typescript...");
require("ts-node").register({
  fast: process.env.NODE_ENV === "production",
  project: "./tsconfig.json",
  typeCheck: process.env.NODE_ENV !== "production"
});
console.log("  ✅  Typescript initiated");
require("./src/server");
