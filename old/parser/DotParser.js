// export function removeComments(line, inComment) {
//     let finalString = "";
//     while (true) {
//         if (!inComment) {
//             // Look for // or /*
//             const simpleCommentIdx = line.indexOf("//");
//             const complexCommentIdx = line.indexOf("/*");

//             if (simpleCommentIdx !== -1 &&
//                 (complexCommentIdx === -1 || simpleCommentIdx < complexCommentIdx)) {
//                 // Found simple comment which takes the rest of the line.
//                 finalString += line.substring(0, simpleCommentIdx);
//                 break;
//             } else if (complexCommentIdx !== -1) {
//                 // Found complex comment
//                 inComment = true;
//                 finalString += line.substring(0, complexCommentIdx);
//                 line = line.substring(complexCommentIdx + "/*".length);
//             } else {
//                 // No additional comments in this line.
//                 finalString += line;
//                 break;
//             }
//         }

//         const closingIdx = line.indexOf("*/");
//         if(closingIdx === -1) {
//             // Ignore the rest of the string since still in comment.
//             break;
//         }
//         line = line.substring(closingIdx + "*/".length);
//         inComment = false;
//     }

//     return { line: finalString, inComment: inComment };
// }

// function getNextWord(string) {
//     let word = "";
//     for(let i = 0; i < string.length; i++) {
//         RegExp(/[a-zA-Z\200-\377_0-9]/).test()
//     }

//     // Is numerical: /^[-]?((\d+(\.\d*)?)|(\.\d+))$/
// }

// function shiftString(string, comp) {
//     return string.substring(comp.length).trim();
// }

// export class Reader {

//     constructor(file) {
//         this.lines = file.replace(/\r\n/g, "\n").split("\n");

//         let inComment = false;
//         for (let i = 0; i < this.lines.length; i++) {
//             let line = this.lines[i];

//             // Remove comments from the line.
//             const res = removeComments(line, inComment);
//             line = res.line;
//             inComment = res.inComment;

//             // Trim the line if existing.
//             if (line != null) {
//                 line = line.trim();
//             }

//             if (line === null || line.length === 0) {
//                 // Remove the empty or null line.
//                 this.lines.splice(i, 1);
//                 i--;
//             } else {
//                 // Update line in array.
//                 this.lines[i] = line;
//             }
//         }

//         this.lineIdx = 0;
//     }

//     currentLine() {
//         if (this.lineIdx < this.lines.length) {
//             return this.lines[this.lineIdx]
//         }
//         return null;
//     }

//     nextLine() {
//         if (this.lineIdx < this.lines.length) {
//             this.lineIdx++;
//         }
//     }
// }

// export class DotParser {
//     static parse(dotData) {
//         const reader = new Reader(dotData);
//         let line = reader.currentLine();
//         while (line != null) {
//             console.log(line);
//             reader.nextLine();
//             line = reader.currentLine();
//         }
//     }
// }

// export class DotGraph {
//     constructor(name, strict) {
//         this.name = name;
//         this.strict = strict;
//     }

//     static decodeFromDot(reader) {
//         let name = undefined;
//         let strict = false;

//         let line = reader.currentLine();
//         while(line != null) {
//             while(line.length > 0) {
//                 if(line.startsWith("strict")) {
//                     strict = true;
//                     line = shiftString(line, "strict");
//                 } else if (line.startsWith("digraph")) {
//                     line = shiftString("digraph");

//                 }
//             }

//             reader.nextLine();
//             line = reader.currentLine();
//         }
//     }
// }