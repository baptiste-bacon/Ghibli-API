import Animation from "classes/Animation";
import GSAP from "gsap";

export default class Example extends Animation {
  constructor({ element, elements }) {
    super({
      element,
      elements,
    });
    this.timeline = new GSAP.timeline();

    this.setAnimation();
  }

  setAnimation() {
    gsap.set(this.element, {
      autoAlpha: 0,
    });
  }

  animate() {
    super.createObserver();
  }

  animateIn() {
    this.timeline.to(this.element, {
      autoAlpha: 1,
      duration: 1,
      delay: 1.3,
    });
  }
}
