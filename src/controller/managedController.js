import ViewController from "./viewController.js";

const renderPromise = (controller, clazz) => {
  return new Promise( (resolve, reject) => {
    const t = clazz.render();
    if (t) {
      resolve(controller);
    } else {
      reject(new Error("Error rendering!"));
    }
  });
};

const removePromise = (controller, clazz) => {
  return new Promise( (resolve, reject) => {
    const t = clazz.remove();
    if (t) {
      resolve(controller);
    } else {
      reject(new Error("Error removing!"));
    }
  });
};

/**
 * A managed controller that automatically sets up the components
 * @extends ViewController
 */
class ManagedController extends ViewController {
  constructor(options) {
    super(options);
    this._instances = [];
    this._renderChain = [];
    this._removeChain = [];
  };

  initialize() {
    if (this._views && this._views.length > 0) {
      const l = this._views.length;
      let i = 0;
      for (i = 0; i < l; i++) {
        const clazz = this._views[i];
        this._instances.push(new clazz());
        this._renderChain.push(renderPromise(this, clazz));
        this._removeChain.push(removePromise(this, clazz));
      }
    }
    return this;
  };

  render() {
    Promise.all(this._renderChain);
    return this;
  };

  remove() {
    Promise.all(this._removeChain);
    return this;
  };

};

export default ManagedController;
