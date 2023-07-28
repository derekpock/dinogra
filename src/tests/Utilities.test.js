import { defaultObjectValue, doesPointIntersectBox, doesLineIntersectBox } from '../Utilities';


describe("defaultObjectValue", () => {
    test("no modification to existing key", () => {
        let x = { myKey: "value" };
        defaultObjectValue(x, "myKey", "newValue");
        expect(x.myKey).toEqual("value");
    });

    test("adds non-existant key with default value", () => {
        let x = { myKey: "value" };
        defaultObjectValue(x, "myName", "newValue");
        expect(x.myName).toEqual("newValue");
    });

    test("adds non-existant key with array value", () => {
        let x = { myKey: "value" };
        defaultObjectValue(x, "myName", []);
        expect(x.myName).toEqual([]);
        expect(x.myName.length).toEqual(0);
    });
});

describe("doesPointIntersectBox", () => {
    test("point in box", () => {
        expect(doesPointIntersectBox({ x: 1, y: 1 }, { x1: 0, y1: 0, x2: 2, y2: 2 })).toEqual(true);
    });

    test.each([
        [1, -1],    // north
        [4, -1],    // north-east
        [4, 1],     // east
        [4, 4],     // south-east
        [1, 4],     // south
        [-1, 4],    // south-west
        [-1, 1],    // west
        [-1, -1]    // north-west
    ])("point (%d, %d) outside of box", (paramX, paramY) => {
        expect(doesPointIntersectBox({ x: paramX, y: paramY }, { x1: 0, y1: 0, x2: 2, y2: 2 })).toEqual(false);
    });
});

describe("doesLineIntersectBox", () => {
    test.each([
        [1, 1, 10, 10],     // n1 in box
        [10, 10, 1, 1],     // n2 in box
        [1, -10, 1, 10],    // n to s
        [10, -10, -10, 10], // ne to sw
        [10, 1, -10, 1],    // e to w
        [10, 10, -10, -10], // sw to ne
        [1, 10, 1, -10],    // s to n
        [-10, 10, 10, -10], // se to nw,
        [-10, 1, 10, 1],    // w to e
        [-10, -10, 10, 10]  // nw to se
    ])("line from (%d, %d) to (%d, %d) intersects box", (x1, y1, x2, y2) => {
        expect(doesLineIntersectBox({ x: x1, y: y1 }, { x: x2, y: y2 }, { x1: -2, y1: -2, x2: 2, y2: 2 })).toEqual(true);
    });
});