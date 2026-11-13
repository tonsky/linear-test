
  private shouldBroadcast(listener: Listener, message: Message): boolean {
    if (!listener.filter) {
      return true;
    }
    return JSON.stringify(message.payload).includes(listener.filter);
  }
  getLog(): Message[] {
    return [...this.messageLog];
  }
  getListenerInfo(): ListenerInfo[] {
    const result: ListenerInfo[] = [];
    for (const [messageType, registeredListeners] of this.listeners) {
      for (const listener of registeredListeners) {
        result.push({
          listenerId: listener.id,
          messageType,
          active: true,
        });
      }
    }
    return result;
  }
  clearLog(): void {
    this.messageLog = [];
  }
  clearListeners(messageType?: string): void {
    if (messageType) {
      this.listeners.delete(messageType);
    } else {
      this.listeners.clear();
    }
  }
  getListenerCount(messageType: string): number {
    return this.listeners.get(messageType)?.length || 0;
  }
  hasListeners(messageType: string): boolean {
    return this.getListenerCount(messageType) > 0;
  }
  setVerboseMode(enabled: boolean): void {
    this.verboseMode = enabled;
  }
  setMaxLogSize(size: number): void {
    this.maxLogSize = size;
    while (this.messageLog.length > this.maxLogSize) {
      this.messageLog.shift();
    }
  }
}
// Utility functions for message handling
function createMessage(type: string, payload: unknown): Message {
  return {
    id: generateId(),
    type,
    payload,
    timestamp: new Date(),
  };
}
function isValidMessageType(messageType: string): boolean {
  return messageType.length > 0 && messageType.length <= 100;
}
function formatMessage(message: Message): string {
  return `[${message.timestamp.toISOString()}] ${message.type}: ${JSON.stringify(message.payload)}`;
}
// Type guards
function isMessage(obj: unknown): obj is Message {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'type' in obj &&
    'payload' in obj &&
    'timestamp' in obj
  );
}
function isListener(obj: unknown): obj is Listener {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'callback' in obj &&
    typeof (obj as Listener).callback === 'function'
  );
}
export {
  MessageBroker,
  Message,
  Listener,
  MessageHandler,
  CleanupFn,
  ListenerInfo,
  createMessage,
  isValidMessageType,
  formatMessage,
  isMessage,
  isListener,
};
