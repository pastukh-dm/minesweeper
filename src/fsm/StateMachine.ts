import { StateCallbacks } from "./State";


export class StateMachine<T extends string> {
  private currentState: T;
  private states: Record<T, StateCallbacks>;

  constructor(initialState: T) {
    this.currentState = initialState;
    this.states = {} as Record<T, StateCallbacks>;
    console.log(`Initialized with state: ${this.currentState}`);
    
    this.states[this.currentState]?.onEnter?.();
    return this;
  }

  addState(name: T, callbacks: StateCallbacks): this {
    this.states[name] = callbacks;

    if (name === this.currentState && callbacks.onEnter) {
      callbacks.onEnter();
    }
    return this;
  }

  changeState(newState: T): void {
    if (this.currentState !== newState) {
      this.states[this.currentState]?.onExit?.();
      console.log(`Changing state from ${this.currentState} to ${newState}`);
      
      this.currentState = newState;
      
      this.states[this.currentState]?.onEnter?.();
    }
  }

  update(delta: number): void {
    this.states[this.currentState]?.onUpdate?.(delta);
  }
}
