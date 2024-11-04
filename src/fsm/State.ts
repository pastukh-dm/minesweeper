export type StateCallbacks = {
  onEnter?: () => void;
  onExit?: () => void;
  onUpdate?: (delta: number) => void;
};

export class State {
  public name: string;
  private onEnterCallback?: () => void;
  private onExitCallback?: () => void;
  private onUpdateCallback?: (delta: number) => void;

  constructor(name: string, callbacks: StateCallbacks) {
    this.name = name;
    this.onEnterCallback = callbacks.onEnter;
    this.onExitCallback = callbacks.onExit;
    this.onUpdateCallback = callbacks.onUpdate;
  }

  onEnter() {
    console.log(`Entering state: ${this.name}`);
    this.onEnterCallback?.();
  }

  onExit() {
    console.log(`Exiting state: ${this.name}`);
    this.onExitCallback?.();
  }

  onUpdate(delta: number) {
    this.onUpdateCallback?.(delta);
  }
}
