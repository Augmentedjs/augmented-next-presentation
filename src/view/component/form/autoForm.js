import * as Augmented from "augmentedjs-next";
import DecoratorView from "../../decorator/decorator.js";
import formCompile from "../functions/buildForm.js";
import formatValidationMessages from "../functions/messages.js";
import Dom from "../../../dom/dom.js";
import Model from "../../../model/model.js";
/**
* A automatic form view created from a JSON Schema
* @class AutomaticForm
* @memberof Presentation.Component
* @extends Presentation.DecoratorView
*/
class AutomaticForm extends DecoratorView {
  constructor(options) {
    super(options);
    this.crossOrigin = false;
    this._fields = {};
    this.uri = null;
    this.isInitalized = false;
    this.title = null;
    this.description = "";
    this._required = [];
    this.display = null;

    if (this.model && options && options.clearForm) {
      this.model.clear();
    } else if (!this.model) {
      this.model = new Model();
    }
    if (options) {
      if (options.crossOrigin) {
        this.crossOrigin = options.crossOrigin;
      }
      if (options.schema) {
        // check if this is a schema vs a URI to get a schema
        if (Augmented.isObject(options.schema)) {
          this.schema = options.schema;
        } else {
          // is a URI?
          let parsedSchema = null;
          try {
            parsedSchema = JSON.parse(options.schema);
            if (parsedSchema && Augmented.isObject(parsedSchema)) {
              this.schema = parsedSchema;
            }
          } catch(e) {
            //_logger.warn("AUGMENTED: AutoForm parsing string schema failed.  URI perhaps?");
          }
          if (!this.schema) {
            this._retrieveSchema(options.schema);
            this.isInitalized = false;
          }
        }
      }

      if (options.el) {
        this.el = options.el;
      }

      if (options.uri) {
        this.uri = options.uri;
      }

      if (options.data && (Augmented.isObject(options.data))) {
        this.model.set(options.data);
      }
      if (options.title) {
        this.title = options.title;
      }
      if (options.description) {
        this.description = options.description;
      }
    }

    if (this.model && this.uri) {
      this.model.url = this.uri;
    }
    if (this.model) {
      this.model.crossOrigin = this.crossOrigin;
    }
    if (this.schema) {
      if ((!this.name || this.name === "") && this.schema.title) {
        this.name = this.schema.title;
      }
      if ((!this.description || this.description === "") && this.schema.description) {
        this.description = this.schema.description;
      }

      if (this.schema.required) {
        this._required = this.schema.required;
      } else {
        this._required = [];
      }

      if (!this.isInitalized) {
        this._fields = this.schema.properties;
        this.model.schema = this.schema;
        this.isInitalized = true;
      }
    } else {
      this.isInitalized = false;
    }
  };
  // standard functionality

  /**
  * The crossOrigin property - enables cross origin fetch
  * @property {boolean} crossOrigin The crossOrigin property
  * @memberof AutomaticForm
  */

  /**
  * The fields property
  * @property {object} fields The fields property
  * @private
  * @memberof AutomaticForm
  */

  /**
  * The URI property
  * @property {string} uri The URI property
  * @memberof AutomaticForm
  */

  /**
  * The model property
  * @property {Augmented.Model} model The model property
  * @memberof AutomaticForm
  */

  /**
  * The initialized property
  * @property {boolean} isInitalized The initialized property
  * @memberof AutomaticForm
  */

  /**
  * The title property
  * @property {string} title The title of the form
  * @memberof AutomaticForm
  */

  /**
  * The name property
  * @property {string} name The name of the form
  * @memberof AutomaticForm
  */

  /**
  * The description property
  * @property {string} description The description of the form
  * @memberof AutomaticForm
  */

  /**
  * The required fields property
  * @property {Array} _required The required fields
  * @memberof AutomaticForm
  * @private
  */


  /**
    * Fields to display - null will display all
    * @method display
    * @memberof AutomaticForm
    */

  _retrieveSchema(uri) {
    let that = this;
    let schema = null;
    Augmented.request({
      url: uri,
      contentType: "application/json",
      dataType: "json",
      success: (data, status) => {
        if (typeof data === "string") {
          schema = JSON.parse(data);
        } else {
          schema = data;
        }
        let options = { "schema": schema };
        that.initialize(options);
      },
      error: (data, status) => {
        //_logger.warn("AUGMENTED: AutoForm Failed to fetch schema!");
      }
    });
  };

  /**
  * Sets the URI
  * @method setURI
  * @memberof AutomaticForm
  * @param {string} uri The URI
  */
  setURI(uri) {
    this.uri = uri;
  };

  /**
  * Sets the schema
  * @method setSchema
  * @memberof AutomaticForm
  * @param {object} schema The JSON schema of the dataset
  */
  setSchema(schema) {
    this.schema = schema;
    this._fields = schema.properties;
    this.model.reset();
    this.model.schema = schema;

    if (this.uri) {
      model.url = this.uri;
    }
  };

  /**
  * Enable/Disable the progress bar
  * @method showProgressBar
  * @memberof AutomaticForm
  * @param {boolean} show Show or Hide the progress bar
  */
  showProgressBar(show) {
    if (this.el) {
      const e = Dom.selector(this.el);
      if (e) {
        const p = e.querySelector("progress");
        if (p) {
          p.style.display = (show) ? "block" : "none";
          p.style.visibility = (show) ? "visible" : "hidden";
        }
      }
    }
  };

  /**
  * Show a message related to the form
  * @method showMessage
  * @memberof AutomaticForm
  * @param {string} message Some message to display
  */
  showMessage(message) {
    if (this.el) {
      const e = Dom.selector(this.el);
      if (e) {
        const p = e.querySelector("p[class=message]");
        if (p) {
          p.innerHTML = message;
        }
      }
    }
  };

  /**
  * Validate the form
  * @method validate
  * @memberof AutomaticForm
  * @returns {boolean} Returns true on success of validation
  */
  validate() {
    let messages = (this.model) ? this.model.validate() : null;
    if (!this.model.isValid() && messages && messages.messages) {
      this.showMessage(formatValidationMessages(messages.messages));
    } else {
      this.showMessage("");
    }
    return messages;
  };

  /**
  * Is the form valid
  * @method isValid
  * @memberof AutomaticForm
  * @returns {boolean} Returns true if valid
  */
  isValid() {
    return (this.model) ? this.model.isValid() : true;
  };

  /**
  * Render the form
  * @method render Renders the form
  * @memberof AutomaticForm
  * @returns {object} Returns the view context ('this')
  */
  render() {
    if (!this.isInitalized) {
      //_logger.warn("AUGMENTED: AutomaticForm Can't render yet, not initialized!");
      return this;
    }

    this.template = null;//"notused";
    this.showProgressBar(true);

    if (this.el) {
      const e = Dom.selector(this.el);
      if (e) {
        if (this.theme) {
          Dom.addClass(e, this.theme);
        }
        // progress bar
        let n = document.createElement("progress"), t = document.createTextNode("Please wait.");
        n.appendChild(t);
        e.appendChild(n);

        // the form
        const form = formCompile(
          ((this.title) ? this.title : this.name),
          this.description,
          this._fields,
          this.model.toJSON(),
          this._required,
          this.name,
          this.display);
        e.appendChild(form);
        this._formEl = Dom.query("form", this.el);

        // message
        n = document.createElement("p");
        n.classList.add("message");
        e.appendChild(n);
      }
    } else {
      //_logger.warn("AUGMENTED: AutomaticForm no element anchor, not rendering.");
      this.showProgressBar(false);
      return this;
    }

    this.delegateEvents();

    this.syncAllBoundElements();

    this.showProgressBar(false);
    return this;
  };

  /**
  * Reset the form
  * @method reset
  * @memberof AutomaticForm
  * @returns {object} Returns the view context ('this')
  */
  reset() {
    if (this._formEl) {
      this._formEl.reset();
      this.model.reset();
    }
  };

  /**
  * Populate the form
  * @method populate
  * @param {object} data Data to fill in
  * @memberof AutomaticForm
  * @returns {object} Returns the view context ('this')
  */
  populate(data) {
    this.model.set(data);
  };

  /**
  * Remove the form and all binds
  * @method remove
  * @memberof AutomaticForm
  */
  remove() {
    /* off to unbind the events */
    this.undelegateEvents();
    this.off();
    this.stopListening();

    Dom.empty(this.el);

    return this;
  };
};

export default AutomaticForm;
