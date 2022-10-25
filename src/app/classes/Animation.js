import Component from "classes/Component";

export default class Animation extends Component {
  constructor({ element, elements }) {
    super({
      element,
      elements,
    });
  }
  setAnimation() {}

  createObserver(threshold) {
    if (!threshold) {
      threshold = 0;
    }
    this.observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateIn();
          } else if (this.animateOut) {
            this.animateOut();
          }
        });
      },
      {
         threshold: [threshold] }
    );
    this.observer.observe(this.element);
  }

  animateIn() {}

  onResize() {}
}
