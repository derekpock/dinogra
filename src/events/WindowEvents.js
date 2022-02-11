
export function registerWindowEvents() {
    window.addEventListener("resize", onResize);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("blur", onBlur);
    window.addEventListener("touchend", onTouchEnd, { passive: false });
    window.addEventListener("touchcancel", onTouchCancel, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("contextmenu", onContextMenu);
}

export function unregisterWindowEvents() {
    window.removeEventListener("resize", onResize);
    window.removeEventListener("mouseup", onMouseUp);
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("blur", onBlur);
    window.removeEventListener("touchend", onTouchEnd);
    window.removeEventListener("touchcancel", onTouchCancel);
    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("contextmenu", onContextMenu);
}

function onResize(e) {
    window.ceTriggerEvent(window.CEResize, e);
}

function onMouseUp(e) {
    window.ceTriggerEvent(window.CEMouseUp, e);
}

function onMouseMove(e) {
    window.ceTriggerEvent(window.CEMouseMove, e);
}

function onBlur(e) {
    window.ceTriggerEvent(window.CEBlur, e);
}

function onTouchEnd(e) {
    window.ceTriggerEvent(window.CETouchEnd, e);
}

function onTouchCancel(e) {
    window.ceTriggerEvent(window.CETouchCancel, e);
}

function onTouchMove(e) {
    window.ceTriggerEvent(window.CETouchMove, e);
}

function onContextMenu(e) {
    window.ceTriggerEvent(window.CEContextMenu, e);
}

