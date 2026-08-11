import { spawn } from "child_process";

console.log("\x1b[36m%s\x1b[0m", "Starting 29s Formula Frontend and Backend...");

const frontend = spawn("npm", ["run", "dev"], { cwd: "frontend", shell: true, stdio: "inherit" });
const backend = spawn("npm", ["run", "dev"], { cwd: "backend", shell: true, stdio: "inherit" });

const exitHandler = () => {
  console.log("\x1b[33m%s\x1b[0m", "\nStopping frontend and backend servers...");
  frontend.kill("SIGINT");
  backend.kill("SIGINT");
  process.exit();
};

process.on("SIGINT", exitHandler);
process.on("SIGTERM", exitHandler);
process.on("exit", exitHandler);
