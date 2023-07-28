import { checkIntersection } from 'line-intersect';

export function defaultObjectValue(obj, key, defaultValue) {
    if (!obj.hasOwnProperty(key)) {
        obj[key] = defaultValue;
        return true;
    }
    return false;
}

/**
 * @param {*} node Object with x, y
 * @param {*} box Object with x1, y1, x2, y2
 * @returns {boolean}
 */
export function doesPointIntersectBox(node, box) {
    return (node.x > box.x1 && node.x < box.x2 && node.y > box.y1 && node.y < box.y2);
}

/**
 * @param {*} node1 Object with x, y 
 * @param {*} node2 Object with x, y
 * @param {*} box Object with x1, y1, x2, y2
 * @returns {boolean}
 */
export function doesLineIntersectBox(node1, node2, box) {
    return doesPointIntersectBox(node1, box) ||
        doesPointIntersectBox(node2, box) ||
        checkIntersection(node1.x, node1.y, node2.x, node2.y, box.x1, box.y1, box.x2, box.y1).type === "intersecting" ||    // top
        checkIntersection(node1.x, node1.y, node2.x, node2.y, box.x2, box.y1, box.x2, box.y2).type === "intersecting" ||    // right
        checkIntersection(node1.x, node1.y, node2.x, node2.y, box.x2, box.y2, box.x1, box.y2).type === "intersecting" ||    // bottom
        checkIntersection(node1.x, node1.y, node2.x, node2.y, box.x1, box.y2, box.x1, box.y1).type === "intersecting";      // left
}