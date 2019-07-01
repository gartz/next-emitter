import EventEmitter from './EventEmitter';
import PrototypeEventEmitter from './PrototypeEventEmitter';
import CopyEventEmitter from './CopyEventEmitter';
import WeakEventEmitter from './WeakEventEmitter';

export const EE = EventEmitter;
export const PEE = PrototypeEventEmitter;
export const CEE = CopyEventEmitter;
export const WEE = WeakEventEmitter;

export default EE;
