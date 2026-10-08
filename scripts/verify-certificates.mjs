import { verifyCertificates } from "../src/system/harness-certificates.mjs";

const errors = verifyCertificates();
if (errors.length) {
  console.error(`Certificate verification failed:\n${errors.join("\n")}`);
  process.exitCode = 1;
} else {
  console.log("Certificate verification passed.");
}
