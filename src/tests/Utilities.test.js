import { defaultObjectValue } from '../Utilities';

test("defaultObjectValue: no modification to existing key", () => {
    let x = { myKey: "value" };
    defaultObjectValue(x, "myKey", "newValue");
    expect(x.myKey).toEqual("value");
});

test("defaultObjectValue: adds non-existant key with default value", () => {
    let x = { myKey: "value" };
    defaultObjectValue(x, "myName", "newValue");
    expect(x.myName).toEqual("newValue");
});

test("defaultObjectValue: adds non-existant key with array value", () => {
    let x = { myKey: "value" };
    defaultObjectValue(x, "myName", []);
    expect(x.myName).toEqual([]);
    expect(x.myName.length).toEqual(0);
});