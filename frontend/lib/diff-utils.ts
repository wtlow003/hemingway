import { diffLines } from 'diff';

export interface DiffLine {
  type: "unchanged" | "removed" | "added";
  original: string;
  optimized: string;
  originalLineNum: number | null;
  optimizedLineNum: number | null;
}

export const generateDiff = (original: string, optimized: string): DiffLine[] => {
  // 1) Normalize line endings so CRLF vs LF doesn't confuse us
  const a = original.replace(/\r\n/g, '\n');
  const b = optimized.replace(/\r\n/g, '\n');

  // 2) Compute a Myers diff at the line level
  const changes = diffLines(a, b, { newlineIsToken: true });
  const result: DiffLine[] = [];
  let origLine = 1;
  let optLine = 1;

  for (const change of changes) {
    // split out each physical line
    let lines = change.value.split('\n');
    // diffLines always leaves a trailing empty string if the text ends with \n
    if (lines[lines.length - 1] === '') lines.pop();

    for (const line of lines) {
      if (change.added) {
        result.push({
          type: "added",
          original: "",
          optimized: line,
          originalLineNum: null,
          optimizedLineNum: optLine++,
        });
      } else if (change.removed) {
        result.push({
          type: "removed",
          original: line,
          optimized: "",
          originalLineNum: origLine++,
          optimizedLineNum: null,
        });
      } else {
        result.push({
          type: "unchanged",
          original: line,
          optimized: line,
          originalLineNum: origLine++,
          optimizedLineNum: optLine++,
        });
      }
    }
  }

  return result;
};
