import GSAP from "gsap";
import Component from "classes/Component";

export default class Transition extends Component {
  constructor(id) {
    super({
      element: ".page",
      elements: {
        images: document.querySelectorAll("img"),
      },
    });
    this.id = id;
    this.timeline = GSAP.timeline();

    this.setAnimation();
  }

  setAnimation() {
    this.pageTransition = document.createElement("div");
    this.element.appendChild(this.pageTransition);
    this.pageTransition.classList.add("page__transition");
    if (this.id === "project") {
      this.backgroundColor = "white";
    } else {
      this.backgroundColor = "#242424";
    }
    this.pageTransition.style.backgroundColor = this.backgroundColor;
    this.timeline.set(this.pageTransition, {
      yPercent: 100,
    });
  }

  animateIn() {
    return new Promise((resolve) => {
      this.timeline.to(this.pageTransition, {
        ease: "power3.out",
        duration: 1,
        yPercent: 0,
        onComplete: resolve,
      });
    });
  }

  animateOut() {
    return new Promise((resolve) => {
      this.timeline.to(this.pageTransition, {
        autoAlpha: 0,
        callbackScope: this,
        onComplete: resolve,
      });
    }).then((_) => {
      this.destroyTransition();
    });
  }

  destroyTransition() {
    this.element.removeChild(this.pageTransition);
  }
}
