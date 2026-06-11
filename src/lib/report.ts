export type Severity = "ok" | "warn" | "error";

export interface Finding {
  severity: Severity;
  code: string;
  message: string;
}

export function printFindings(findings: Finding[]) {
  for (const finding of findings) {
    const marker = finding.severity === "ok" ? "OK" : finding.severity === "warn" ? "WARN" : "ERROR";
    console.log(`${marker} ${finding.code}: ${finding.message}`);
  }
}

export function exitCode(findings: Finding[]): number {
  return findings.some((finding) => finding.severity === "error") ? 1 : 0;
}

export function ok(code: string, message: string): Finding {
  return { severity: "ok", code, message };
}

export function warn(code: string, message: string): Finding {
  return { severity: "warn", code, message };
}

export function error(code: string, message: string): Finding {
  return { severity: "error", code, message };
}
