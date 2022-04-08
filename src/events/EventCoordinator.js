
export default class EventCoordinator {

    constructor() {
        this.registrations = {};
        this.loggedEvents = {};
    }

    populateWindow(w) {
        w.ceTriggerEvent = this.triggerEvent.bind(this);
        w.ceRegisterEvent = this.registerEvent.bind(this);
        w.ceUnregisterEvent = this.unregisterEvent.bind(this);

        w.CEWindowResize = "Resize";
        w.CELaunch = "Launch";
        w.CEMouseMove = "Move";

        w.CENodeLand = "NodeLand";  // e.ceNode
        w.CENodeLaunch = "NodeLaunch";  // e.ceNode

        w.CEGraphMouseMove = "GraphMove"; // e.ceGraphMouse, e.ceGraphMouseLast

        w.CEGraphDataModified = "GraphDataModified";

        this.loggedEvents = [];
    }

    triggerEvent(event, payload) {
        if (event == null) {
            console.error("Trying to trigger null event with payload", payload);
            return;
        }

        const eventRegistrations = this.registrations[event];
        this._log_event(event, eventRegistrations);
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

    _log_event(event, registrations) {
        if (this.loggedEvents.includes(event)) {
            if (registrations == null) {
                console.debug("Triggering", event, "0 registrations");
            } else {
                console.debug("Triggering", event, registrations.length, "registrations");
            }
            // console.trace();
        }
    }
}