
  private shouldNotify(subscriber: Subscriber, event: EventData): boolean {
    if (!subscriber.filter) {
      return true;
    }
    return JSON.stringify(event.payload).includes(subscriber.filter);
  }
  getHistory(): EventData[] {
    return [...this.eventHistory];
  }
  getSubscriptions(): SubscriptionInfo[] {
    const result: SubscriptionInfo[] = [];
    for (const [eventType, subs] of this.subscribers) {
      for (const subscriber of subs) {
        result.push({
          subscriberId: subscriber.id,
          eventType,
          active: true,
        });
      }
    }
    return result;
  }
  clearHistory(): void {
    this.eventHistory = [];
  }
  clearSubscriptions(eventType?: string): void {
    if (eventType) {
      this.subscribers.delete(eventType);
    } else {
      this.subscribers.clear();
    }
  }
  getSubscriberCount(eventType: string): number {
    return this.subscribers.get(eventType)?.length || 0;
  }
  hasSubscribers(eventType: string): boolean {
    return this.getSubscriberCount(eventType) > 0;
  }
  setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
  }
  setMaxHistorySize(size: number): void {
    this.maxHistorySize = size;
    while (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }
  }
}
// Utility functions for event handling
function createEventData(type: string, payload: unknown): EventData {
  return {
    id: uuid(),
    type,
    payload,
    timestamp: new Date(),
  };
}
function isValidEventType(eventType: string): boolean {
  return eventType.length > 0 && eventType.length <= 100;
}
function formatEventData(event: EventData): string {
  return `[${event.timestamp.toISOString()}] ${event.type}: ${JSON.stringify(event.payload)}`;
}
// Type guards
function isEventData(obj: unknown): obj is EventData {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'type' in obj &&
    'payload' in obj &&
    'timestamp' in obj
  );
}
function isSubscriber(obj: unknown): obj is Subscriber {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'callback' in obj &&
    typeof (obj as Subscriber).callback === 'function'
  );
}
export {
  EventBus,
  EventData,
  Subscriber,
  EventHandler,
  UnsubscribeFn,
  SubscriptionInfo,
  createEventData,
  isValidEventType,
  formatEventData,
  isEventData,
  isSubscriber,
};
