// import { removeComments, Reader, DotParser } from './DotParser.js'

test("tests run", () => {
    expect(true).toEqual(true);
});
// //
// // removeComments
// //

// test("removeComments: no comments and not inComment", () => {
//     const line = "test string";
//     const inComment = false;

//     const expectedResult = {line: line, inComment: false};

//     const actualResult = removeComments(line, inComment);

//     expect(actualResult).toEqual(expectedResult);
// });

// test("removeComments: no comment and inComment", () => {
//     const line = "test string";
//     const inComment = true;

//     const expectedResult = {line: "", inComment: true};

//     const actualResult = removeComments(line, inComment);

//     expect(actualResult).toEqual(expectedResult);
// });

// test("removeComments: early comment and not incomment", () => {
//     const line = "/* asdf */test string";
//     const inComment = false;

//     const expectedResult = {line: "test string", inComment: false};

//     const actualResult = removeComments(line, inComment);

//     expect(actualResult).toEqual(expectedResult);
// });

// test("removeComments: late comment and not incomment", () => {
//     const line = "test string/* asdf */";
//     const inComment = false;

//     const expectedResult = {line: "test string", inComment: false};

//     const actualResult = removeComments(line, inComment);

//     expect(actualResult).toEqual(expectedResult);
// });

// test("removeComments: middle comment and not incomment", () => {
//     const line = "test /* asdf */string";
//     const inComment = false;

//     const expectedResult = {line: "test string", inComment: false};

//     const actualResult = removeComments(line, inComment);

//     expect(actualResult).toEqual(expectedResult);
// });

// test("removeComments: double comment and not incomment", () => {
//     const line = "test /* asdf */str/* asdf */ing";
//     const inComment = false;

//     const expectedResult = {line: "test string", inComment: false};

//     const actualResult = removeComments(line, inComment);

//     expect(actualResult).toEqual(expectedResult);
// });

// test("removeComments: ending comment and incomment", () => {
//     const line = "asdf */test string";
//     const inComment = true;

//     const expectedResult = {line: "test string", inComment: false};

//     const actualResult = removeComments(line, inComment);

//     expect(actualResult).toEqual(expectedResult);
// });

// test("removeComments: starting comment and not incomment", () => {
//     const line = "test string/* asdf";
//     const inComment = false;

//     const expectedResult = {line: "test string", inComment: true};

//     const actualResult = removeComments(line, inComment);

//     expect(actualResult).toEqual(expectedResult);
// });

// test("removeComments: starting and ending comment and incomment", () => {
//     const line = "asdf */test string/* asdf";
//     const inComment = true;

//     const expectedResult = {line: "test string", inComment: true};

//     const actualResult = removeComments(line, inComment);

//     expect(actualResult).toEqual(expectedResult);
// });

// test("removeComments: starting comment and incomment", () => {
//     const line = "test string/* asdf";
//     const inComment = true;

//     const expectedResult = {line: "", inComment: true};

//     const actualResult = removeComments(line, inComment);

//     expect(actualResult).toEqual(expectedResult);
// });

// test("removeComments: ending comment and not incomment", () => {
//     const line = "asdf */test comment";
//     const inComment = false;

//     const expectedResult = {line: line, inComment: false};

//     const actualResult = removeComments(line, inComment);

//     expect(actualResult).toEqual(expectedResult);
// });

// test("removeComments: simple comment", () => {
//     const line = "asdf//test comment */ /* */ /*";
//     const inComment = false;

//     const expectedResult = {line: "asdf", inComment: false};

//     const actualResult = removeComments(line, inComment);

//     expect(actualResult).toEqual(expectedResult);
// });

// //
// // Reader
// // 

// test("Reader.constructor: replace all carriage returns", () => {
//     const file = "a\r\nb\r\nc\nd";

//     const expectedResult = ["a", "b", "c", "d"];

//     const reader = new Reader(file);
//     const actualResult = reader.lines;

//     expect(actualResult).toEqual(expectedResult);
// });

// test("Reader.constructor: split all new lines", () => {
//     const file = "a\nb\nc"

//     const expectedResult = ["a", "b", "c"];

//     const reader = new Reader(file);
//     const actualResult = reader.lines;

//     expect(actualResult).toEqual(expectedResult);
// });

// test("Reader.constructor: remove all comments and empty lines", () => {
//     const file = "// test\n    /*asdf*/first // post\nsecond/*asdf*/\n/*\nasdf\n*/third/*asdf*/    "

//     const expectedResult = ["first", "second", "third"];

//     const reader = new Reader(file);
//     const actualResult = reader.lines;

//     expect(actualResult).toEqual(expectedResult);
// });

// test("Reader.currentLine: read first line multiple times", () => {
//     const file = "asdf";
//     const reader = new Reader(file);

//     const expectedResult = "asdf";

//     const actualResult1 = reader.currentLine();
//     const actualResult2 = reader.currentLine();

//     expect(actualResult1).toEqual(expectedResult);
//     expect(actualResult2).toEqual(expectedResult);
// });

// test("Reader.currentLine: no more lines", () => {
//     const file = "asdf";
//     const reader = new Reader(file);
//     reader.lineIdx = 1;

//     const expectedResult = null;

//     const actualResult = reader.currentLine();

//     expect(actualResult).toEqual(expectedResult);
// });

// test("Reader.nextLine: moves lines until at end", () => {
//     const file = "1\n2\n3";
//     const reader = new Reader(file);

//     const expectedIdxs = [0, 1, 2, 3, 3];
//     const expectedStrings = ["1", "2", "3", null, null];

//     for(let i = 0; i < 5; i++) {
//         expect(reader.lineIdx).toEqual(expectedIdxs[i]);
//         expect(reader.currentLine()).toEqual(expectedStrings[i]);
//         reader.nextLine();
//     }
// });


// // DotParser
// //

// // test("DotParser.parse")