import Page from "classes/Page";

export default class Home extends Page {
  constructor() {
    super({
      id: "home",
      element: ".content",
      elements: {
        contentWrapper: ".content__wrapper",
        container: '[data-container="container"]',
        buttons: ".nav__list__item__button",

        animationsExample: '[data-animation="example"]',
      },
    });
  }

  create() {
    super.create();
  }
}
