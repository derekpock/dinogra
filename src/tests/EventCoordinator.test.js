import EventCoordinator from "../events/EventCoordinator";

const CEDummyEvent = "CEDummyEvent";

test("EventCoordinator.populateWindow: events should be accessible", () => {
    const obj = {};
    obj.test = "test";

    const evcor = new EventCoordinator();
    evcor.populateWindow(obj);

    expect(obj).toHaveProperty("test", "test")
    expect(obj).toHaveProperty("CEMouseUp", "MouseUp");
});

test("EventCoordinator.registerEvent: first registration creates array", () => {
    const evcor = new EventCoordinator();
    const callable = (_) => { };
    evcor.registerEvent(CEDummyEvent, callable);

    expect(evcor.registrations).toHaveProperty(CEDummyEvent);
    expect(evcor.registrations[CEDummyEvent]).toContain(callable);
});

test("EventCoordinator.registerEvent: second registration maintains array", () => {
    const evcor = new EventCoordinator();
    const callable1 = (_) => { };
    const callable2 = (_) => { console.debug("TestCallableRan"); };
    evcor.registerEvent(CEDummyEvent, callable1);
    evcor.registerEvent(CEDummyEvent, callable2);

    expect(evcor.registrations).toHaveProperty(CEDummyEvent);
    expect(evcor.registrations[CEDummyEvent]).toContain(callable1);
    expect(evcor.registrations[CEDummyEvent]).toContain(callable2);
});

test("EventCoordinator.registerEvent: dupe registrations denied", () => {
    const evcor = new EventCoordinator();
    const callable = (_) => { };
    evcor.registerEvent(CEDummyEvent, callable);
    evcor.registerEvent(CEDummyEvent, callable);

    expect(evcor.registrations).toHaveProperty(CEDummyEvent);
    expect(evcor.registrations[CEDummyEvent]).toContain(callable);
    expect(evcor.registrations[CEDummyEvent]).toHaveLength(1);
});

test("EventCoordinator.unregisterEvent: no registrations for event", () => {
    const evcor = new EventCoordinator();
    const callable = (_) => { };

    const result = evcor.unregisterEvent(CEDummyEvent, callable);

    expect(result).toBe(false);
});

test("EventCoordinator.unregisterEvent: callable not found for event", () => {
    const evcor = new EventCoordinator();
    const callable1 = (_) => { };
    const callable2 = (_) => { };
    evcor.registerEvent(CEDummyEvent, callable1);
    const result = evcor.unregisterEvent(CEDummyEvent, callable2);

    expect(result).toBe(false);
    expect(evcor.registrations[CEDummyEvent]).toContain(callable1);
});

test("EventCoordinator.unregisterEvent: successful unregistration", () => {
    const evcor = new EventCoordinator();
    const callable = (_) => { };
    evcor.registerEvent(CEDummyEvent, callable);
    const result = evcor.unregisterEvent(CEDummyEvent, callable);

    expect(result).toBe(true);
    expect(evcor.registrations[CEDummyEvent]).toHaveLength(0);
});

test("EventCoordinator.triggerEvent: no registrations", () => {
    const evcor = new EventCoordinator();
    evcor.triggerEvent(CEDummyEvent, {});
});

test("EventCoordinator.triggerEvent: registrations receive payload", () => {
    let callable1Payload = null;
    let callable2Payload = null;
    const callable1 = (payload) => { callable1Payload = payload; };
    const callable2 = (payload) => { callable2Payload = payload; };

    const evcor = new EventCoordinator();
    evcor.registerEvent(CEDummyEvent, callable1);
    evcor.registerEvent(CEDummyEvent, callable2);

    evcor.triggerEvent(CEDummyEvent, { x: { y: 1 } });

    expect(callable1Payload).toEqual({ x: { y: 1 } });
    expect(callable2Payload).toEqual({ x: { y: 1 } });

    // Object is carried by reference, not value. All callbacks share same object.
    callable1Payload.x.y = 2;

    expect(callable1Payload).toEqual({ x: { y: 2 } });
    expect(callable2Payload).toEqual({ x: { y: 2 } });
});




