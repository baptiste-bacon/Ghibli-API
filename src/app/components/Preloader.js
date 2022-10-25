import GSAP from "gsap";
import Component from "classes/Component";

export default class Preloader extends Component {
  constructor() {
    super({
      element: ".preloader",
      elements: {
        div: ".preloader__div",
        text: ".preloader__text",
        title: ".preloader__title",
        number: ".preloader__number",
        images: document.querySelectorAll("img"),
      },
    });
    this.length = 0;

    this.timeline = new GSAP.timeline();
    this.timeline.set(this.elements.text, {
      scale: 0,
    });

    this.animateIn = new GSAP.timeline();
    this.animateOut = new GSAP.timeline();

    this.createLoader();
  }

  createLoader() {
    this.elements.images.forEach((element) => {
      element.onload = (_) => this.onAssetLoaded();
    });
  }

  onAssetLoaded() {
    return new Promise((resolve) => {
      this.length += 1;
      const percent = this.length / this.elements.images.length;
      this.elements.number[0].innerHTML = `${Math.round(percent * 100)}%`;

      if (percent === 1) {
        resolve;
      }
      this.timeline.to(this.elements.text, {
        scale: 1,
        duration: 3,
        ease: "expo4.out",
      });
    });
  }

  show() {
    return new Promise((resolve) => {
      this.animateIn.to(this.elements.div[0], {
        delay: 1,
        ease: "power3.out",
        duration: 1.5,
        yPercent: -100,
        onComplete: resolve,
      });
    });
  }

  hide() {
    return new Promise((resolve) => {
      this.animateOut.to(this.element, {
        ease: "power3.in",
        duration: 1,
        yPercent: -200,
        callbackScope: this,
        onComplete: resolve,
      });
    });
  }
}
