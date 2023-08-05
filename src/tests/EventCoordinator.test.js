import EventCoordinator from "../events/EventCoordinator";

const CEDummyEvent = "CEDummyEvent";

test("EventCoordinator.populateWindow: events should be accessible", () => {
    const obj = {};
    obj.test = "test";

    const evcor = new EventCoordinator();
    evcor.populateWindow(obj);

    expect(obj).toHaveProperty("test", "test");

    expect(obj).toHaveProperty("CEWindowResize", "Resize");
    expect(obj).toHaveProperty("CELaunch", "Launch");
    expect(obj).toHaveProperty("CEMouseMove", "Move");

    expect(obj).toHaveProperty("CENodeLand", "NodeLand");
    expect(obj).toHaveProperty("CENodeLaunch", "NodeLaunch");
    expect(obj).toHaveProperty("CENodeCreated", "NodeCreated");

    expect(obj).toHaveProperty("CEEdgeLand", "EdgeLand");
    expect(obj).toHaveProperty("CEEdgeLaunch", "EdgeLaunch");

    expect(obj).toHaveProperty("CEGraphMouseMove", "GraphMove");
    expect(obj).toHaveProperty("CEGraphDataModified", "GraphDataModified");
});

test("EventCoordinator.registerEvent: first registration creates array", () => {
    const evcor = new EventCoordinator();
    const w = {};
    evcor.populateWindow(w);

    const callable = (_) => { };
    w.ceRegisterEvent(CEDummyEvent, callable);

    expect(evcor.registrations).toHaveProperty(CEDummyEvent);
    expect(evcor.registrations[CEDummyEvent]).toContain(callable);
});

test("EventCoordinator.registerEvent: second registration maintains array", () => {
    const evcor = new EventCoordinator();
    const w = {};
    evcor.populateWindow(w);

    const callable1 = (_) => { };
    const callable2 = (_) => { console.debug("TestCallableRan"); };
    w.ceRegisterEvent(CEDummyEvent, callable1);
    w.ceRegisterEvent(CEDummyEvent, callable2);

    expect(evcor.registrations).toHaveProperty(CEDummyEvent);
    expect(evcor.registrations[CEDummyEvent]).toContain(callable1);
    expect(evcor.registrations[CEDummyEvent]).toContain(callable2);
});

test("EventCoordinator.registerEvent: dupe registrations denied", () => {
    const evcor = new EventCoordinator();
    const w = {};
    evcor.populateWindow(w);

    const callable = (_) => { };
    w.ceRegisterEvent(CEDummyEvent, callable);
    w.ceRegisterEvent(CEDummyEvent, callable);

    expect(evcor.registrations).toHaveProperty(CEDummyEvent);
    expect(evcor.registrations[CEDummyEvent]).toContain(callable);
    expect(evcor.registrations[CEDummyEvent]).toHaveLength(1);
});

test("EventCoordinator.unregisterEvent: no registrations for event", () => {
    const evcor = new EventCoordinator();
    const w = {};
    evcor.populateWindow(w);

    const callable = (_) => { };

    const result = w.ceUnregisterEvent(CEDummyEvent, callable);

    expect(result).toBe(false);
});

test("EventCoordinator.unregisterEvent: callable not found for event", () => {
    const evcor = new EventCoordinator();
    const w = {};
    evcor.populateWindow(w);

    const callable1 = (_) => { };
    const callable2 = (_) => { };
    w.ceRegisterEvent(CEDummyEvent, callable1);
    const result = w.ceUnregisterEvent(CEDummyEvent, callable2);

    expect(result).toBe(false);
    expect(evcor.registrations[CEDummyEvent]).toContain(callable1);
});

test("EventCoordinator.unregisterEvent: successful unregistration", () => {
    const evcor = new EventCoordinator();
    const w = {};
    evcor.populateWindow(w);

    const callable = (_) => { };
    w.ceRegisterEvent(CEDummyEvent, callable);
    const result = w.ceUnregisterEvent(CEDummyEvent, callable);

    expect(result).toBe(true);
    expect(evcor.registrations[CEDummyEvent]).toHaveLength(0);
});

test("EventCoordinator.triggerEvent: no registrations", () => {
    const evcor = new EventCoordinator();
    const w = {};
    evcor.populateWindow(w);

    w.ceTriggerEvent(CEDummyEvent, {});
});

test("EventCoordinator.triggerEvent: registrations receive payload", () => {
    let callable1Payload = null;
    let callable2Payload = null;
    const callable1 = (payload) => { callable1Payload = payload; };
    const callable2 = (payload) => { callable2Payload = payload; };

    const evcor = new EventCoordinator();
    const w = {};
    evcor.populateWindow(w);

    w.ceRegisterEvent(CEDummyEvent, callable1);
    w.ceRegisterEvent(CEDummyEvent, callable2);

    w.ceTriggerEvent(CEDummyEvent, { x: { y: 1 } });

    expect(callable1Payload).toEqual({ x: { y: 1 } });
    expect(callable2Payload).toEqual({ x: { y: 1 } });

    // Object is carried by reference, not value. All callbacks share same object.
    callable1Payload.x.y = 2;

    expect(callable1Payload).toEqual({ x: { y: 2 } });
    expect(callable2Payload).toEqual({ x: { y: 2 } });
});

test("EventCoordinator.triggerEvent: trigger causing register/unregister should delay calls until after full trigger", () => {
    let callable1TriggerCount = 0;
    let callable2TriggerCount = 0;
    let callable3TriggerCount = 0;

    const evcor = new EventCoordinator();
    const w = {};
    evcor.populateWindow(w);

    const callable1 = () => {
        callable1TriggerCount++;
        w.ceUnregisterEvent(CEDummyEvent, callable2);
        w.ceRegisterEvent(CEDummyEvent, callable3);

        // Precondition: make sure #2 has not yet been called on first event.
        expect(callable1TriggerCount !== 1 || callable2TriggerCount === 0).toBeTruthy();
    };
    const callable2 = () => { callable2TriggerCount++; };
    const callable3 = () => { callable3TriggerCount++; };

    w.ceRegisterEvent(CEDummyEvent, callable1);
    w.ceRegisterEvent(CEDummyEvent, callable2);

    w.ceTriggerEvent(CEDummyEvent, null);

    expect(callable1TriggerCount).toEqual(1);
    expect(callable2TriggerCount).toEqual(1);   // Called despite #1 unregistering it.
    expect(callable3TriggerCount).toEqual(0);   // Not called despite #1 registering it.

    w.ceTriggerEvent(CEDummyEvent, null);

    expect(callable1TriggerCount).toEqual(2);
    expect(callable2TriggerCount).toEqual(1);   // Not called (was unregistered after delay).
    expect(callable3TriggerCount).toEqual(1);   // Called (was registered after delay).
});




