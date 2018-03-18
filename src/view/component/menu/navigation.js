import AbstractToolbar from "../toolbar/abstractToolbar.js";
import Dom from "../../../dom/dom.js";
import buildMenuItems from "../functions/buildMenuItems.js";

const buildMenu = (name, menuItems) => {
  return `<ul>${buildMenuItems(this.name, this.menuItems)}</ul>`;
};

/**
 * A Navigation Menu
 * @memberof Presentation.Component
 * @extends Presentation.AbstractToolbar
 */
class NavigationMenu extends AbstractToolbar {
  constructor(options) {
    if (!options) {
      options = {};
    }
    if (!options.tagName) {
      options.tagName = "nav";
    }
    if (!options.style) {
      options.style = "navigation";
    } else {
      options.style = `${option.style} navigation`;
    }

    super(options);
  };
  /**
   * Renders the Menu
   * @returns {object} Returns the view context ('this')
   */
  render() {
    if (!this.isInitalized) {
      return this;
    }
    this.template = null;//"notused";
    if (this.el) {
      const e = Dom.selector(this.el);
      if (e) {
        // the menu
        //Dom.addClass(e, "menu");
        e.setAttribute("data-" + this.name, "navigation-menu");
        e.innerHTML = buildMenu(this.name, this.menuItems);
      }
      this.delegateEvents();
      this.syncAllBoundElements();
    }
    return this;
  };
};

export default NavigationMenu;