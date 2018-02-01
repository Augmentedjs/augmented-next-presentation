import DecoratorView from "../../decorator/decorator.js";

/**
 * A Header Component
 * @constructor Augmented.Presentation.Component.Header
 * @memberof Presentation.Component
 * @extends Presentation.View
 */
class Header extends DecoratorView {
  constructor(options) {
    super(options);
    if (options && options.title) {
      this._title = options.title;
    } else {
      this._title = "";
    }
    if (options && options.subTitle) {
      this._subTitle = options.subTitle;
    } else {
      this._subTitle = "";
    }
  };
  /**
   * A title property
   * @property title
   * @memberof Presentation.Component.Header
   */
   set title(title) {
     this._title = title;
   };

   get title() {
     return this._title;
   };
  /**
   * A subTitle property
   * @property subTitle
   * @memberof Presentation.Component.Header
   */
   set subTitle(subTitle) {
     this._subTitle = subTitle;
   };

   get subTitle() {
     return this._subTitle;
   };
};

export default Header;
