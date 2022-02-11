
export default class EventCoordinator {

    constructor() {
        this.registrations = {};
    }

    populateWindow(w) {
        w.ceTriggerEvent = this.triggerEvent.bind(this);
        w.ceRegisterEvent = this.registerEvent.bind(this);
        w.ceUnregisterEvent = this.unregisterEvent.bind(this);

        w.CEResize = "Resize";
        w.CEMouseUp = "MouseUp";
        w.CEMouseMove = "MouseMove";
        w.CEBlur = "Blur";
        w.CETouchEnd = "TouchEnd";
        w.CETouchCancel = "TouchCancel";
        w.CETouchMove = "TouchMove";
        w.CEContextMenu = "ContextMenu";
        w.CENodeMouseDown = "NodeMouseDown";
        w.CENodeMouseUp = "NodeMouseUp";

        w.CEBackgroundMouseDown = "BackgroundMouseDown";
        w.CEEdgeCreationStart = "EdgeCreationStart";
        w.CEEdgeCreationEnd = "EdgeCreationEnd";
    }

    triggerEvent(event, payload) {
        if (event == null) {
            console.error("Trying to trigger null event with payload", payload);
            return;
        }

        const eventRegistrations = this.registrations[event];
        if (eventRegistrations == null) {
            return;
        }

        eventRegistrations.forEach((callable) => { callable(payload); });
    }

    registerEvent(event, callable) {
        if (event == null) {
            console.error("Trying to register for null event with callback", callable);
            return;
        }

        let eventRegistrations = this.registrations[event];
        if (eventRegistrations == null) {
            this.registrations[event] = [];
            eventRegistrations = this.registrations[event];
        }

        if (eventRegistrations.includes(callable)) {
            console.warn("Tried to register for event", event, "with callback", callable, "but it is already registered.");
            return;
        }

        eventRegistrations.push(callable);
    }

    unregisterEvent(event, callable) {
        if (event == null) {
            console.error("Trying to unregister from null event with callback", callable);
            return;
        }

        const eventRegistrations = this.registrations[event];
        if (eventRegistrations == null) {
            console.warn("Tried to remove registration for event", event, "and callback", callable, "but this event has no registrations.");
            return false;
        }

        const idx = eventRegistrations.indexOf(callable);
        if (idx <= -1) {
            console.warn("Tried to remove registration for event", event, "and callback", callable, "but no matching registration could be found.");
            return false;
        }

        eventRegistrations.splice(idx, 1);
        return true;
    }
}