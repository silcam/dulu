const fs = require("fs");
const child_process = require("child_process");

const testFiles = fs.readdirSync("./test/system");
const testsWithFailures = [];
for (let i = 0; i < testFiles.length; ++i) {
  const testName = testFiles[i];
  consoleLog(
    `\n==========================\nRUN: ${testName} (${i + 1}/${
      testFiles.length
    })...\n==========================\n`
  );
  try {
    runTest(testName);
  } catch (err) {
    try {
      // Give it a second try:
      runTest(testName);
    } catch (err2) {
      testsWithFailures.push(testFiles[i]);
    }
  }
}

consoleLog(
  `\n==============================\nCompleted running ${
    testFiles.length
  } tests. ${testsWithFailures.length} tests failed.`
);
if (testsWithFailures.length > 0) {
  consoleLog(`FAILED TESTS:\n${testsWithFailures.join("\n")}`);
}

function runTest(testName) {
  const testFilePath = `test/system/${testName}`;
  child_process.execSync(`rails test ${testFilePath}`, { stdio: "inherit" });
}

function consoleLog(message) {
  console.log(`\u001b[35m${message}\u001b[0m`);
}
