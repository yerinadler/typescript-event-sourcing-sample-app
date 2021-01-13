import { EventEmitter } from 'events';

export const getEventBus = () => new EventEmitter();
