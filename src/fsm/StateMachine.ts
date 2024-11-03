import { StateCallbacks } from "./StateCallbacks";


export class StateMachine<T extends string> {
  private currentState: T;
  private states: Record<T, StateCallbacks>;

  constructor(initialState: T) {
    this.currentState = initialState;
    this.states = {} as Record<T, StateCallbacks>;
    console.log(`Initialized with state: ${this.currentState}`);
    
    // Call onEnter if the initial state has it
    this.states[this.currentState]?.onEnter?.();
    return this;
  }

  addState(name: T, callbacks: StateCallbacks): this {
    this.states[name] = callbacks;

    // If the added state is the current state, immediately call onEnter
    if (name === this.currentState && callbacks.onEnter) {
      callbacks.onEnter();
    }
    return this;
  }

  changeState(newState: T): void {
    if (this.currentState !== newState) {
      // Call onExit on the current state, if defined
      this.states[this.currentState]?.onExit?.();
      console.log(`Changing state from ${this.currentState} to ${newState}`);
      
      // Change to the new state
      this.currentState = newState;
      
      // Call onEnter on the new state, if defined
      this.states[this.currentState]?.onEnter?.();
    }
  }

  update(delta: number): void {
    // Call onUpdate on the current state, if defined
    this.states[this.currentState]?.onUpdate?.(delta);
  }
}
