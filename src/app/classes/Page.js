import each from "lodash/each";

import GSAP from "gsap";
import normalizeWheel from "normalize-wheel";
import Prefix from "prefix";

import Example from "animations/Example";

export default class Page {
  constructor({ element, elements, id }) {
    this.selector = element;
    this.selectorChildren = {
      animationsExample: '[data-animation="example"]',

      ...elements,
    };
    this.id = id;

    this.transformPrefix = Prefix("transform");
    this.onMouseEvent = this.onMouseWheel.bind(this);
  }

  create() {
    this.nav = document.querySelector(".nav");
    if (this.nav) {
      this.navItems = this.nav.querySelectorAll(".nav__list__item");
      if (this.id === "project") {
        this.navItems.forEach((item) => {
          item.style.visibility = "hidden";
        });
      } else {
        this.navItems.forEach((item) => {
          item.style.visibility = "visible";
        });
      }
    }

    this.currentContainerKey = 0;
    this.canScroll = false;

    this.lastTouch = 0;

    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      limit: 0,
      ease: 0.06,
    };

    this.timeline = new GSAP.timeline();

    this.element = this.selector;
    this.elements = {};

    each(this.selectorChildren, (entry, key) => {
      if (
        entry instanceof window.HTMLElement ||
        entry instanceof NodeList ||
        Array.isArray(entry)
      ) {
        this.elements[key] = entry;
      } else {
        this.elements[key] = document.querySelectorAll(entry);
        if (this.elements[key].lenght === 0) {
          this.elements[key] = null;
        } else if (this.elements[key].lenght === 1) {
          this.elements[key] = document.querySelector(entry);
        }
      }
    });

    this.addEventListeners();
    this.onResize();

    this.sections = this.elements.container;
    if (this.sections) {
      this.currentContainer = this.sections[0];
    }
  }

  scrollUpdate() {
    setTimeout((_) => {
      this.canScroll = true;
    }, 1000);
  }

  createAnimations() {
    this.animations = [];

    if (this.id === "home") {
      //Homepage anims
      this.animationsExample = [...this.elements.animationsExample].map(
        (element) => {
          return new HomeTitle({
            element,
          });
        }
      );
      this.animations.push(...this.animationsExample);
    }
  }

  animateAnimations() {
    this.animations.forEach((animation) => {
      animation.animate();
    });
  }

  performScroll(entry) {
    this.currentContainerKey += entry;
    this.canScroll = false;

    if (this.currentContainerKey > this.sections.length - 1) {
      this.currentContainerKey = this.sections.length - 1;
      this.canScroll = true;
      return;
    } else if (this.currentContainerKey < 0) {
      this.currentContainerKey = 0;
      this.canScroll = true;
      return;
    }
    this.currentContainer = this.sections[this.currentContainerKey];

    this.translate = this.currentContainerKey * -100;
    this.timeline.to(this.elements.contentWrapper, {
      y: `${this.translate}vh`,
      ease: "power4.out",
      duration: 0.1,
    });

    setTimeout((_) => {
      this.canScroll = true;
    }, 1500);
  }

  onMouseWheel(event) {
    let { pixelY } = normalizeWheel(event);

    this.scroll.target += pixelY;

    this.scrollDirection = pixelY > 1 ? 1 : -1;

    if (this.id === "home" && this.canScroll === true) {
      this.performScroll(this.scrollDirection);
    }
  }

  onTouchStart(event) {
    this.touchStart = event.touches[0].clientY;
  }

  onTouchDown(event) {
    this.isDown = true;

    this.scroll.position = this.scroll.current;
    this.start = event.touches ? event.touches[0].clientY : event.clientY;
  }

  onTouchUp(event) {
    this.isDown = false;
  }

  onTouchMove(event) {
    if (!this.isDown) return;

    const y = event.touches ? event.touches[0].clientY : event.clientY;
    const distance = (this.start - y) * 2;

    this.scroll.target = this.scroll.position + distance;
  }

  onResize() {
    if (this.elements.projectWrapper) {
      window.requestAnimationFrame((_) => {
        this.scroll.limit =
          this.elements.projectWrapper[0].clientHeight - window.innerHeight;
      });
    }
  }

  update() {
    this.scroll.target = GSAP.utils.clamp(
      0,
      this.scroll.limit,
      this.scroll.target
    );

    this.scroll.current = GSAP.utils.interpolate(
      this.scroll.current,
      this.scroll.target,
      this.scroll.ease
    );

    if (this.scroll.current < 0.01) {
      this.scroll.current = 0;
    }
    if (this.scroll.current > this.scroll.last) {
      this.scroll.direction = "down";
    } else if (this.scroll.current < this.scroll.last) {
      this.scroll.direction = "up";
    }
    if (this.page) {
      this.page.style.transform = `translate3d(0, -${this.scroll.current}px, 0)`;
    }

    this.scroll.last = this.scroll.current;
  }

  addEventListeners() {
    document.addEventListener("wheel", this.onMouseEvent);

    if (this.id === "home") {
      this.elements.buttons.forEach((element) => {
        element.addEventListener("click", (event) => {
          event.preventDefault();
          this.onClick(event.target);
        });
      });
    }
    document.addEventListener("touchstart", (event) => {
      this.onTouchStart(event);
    });
    document.addEventListener("touchmove", (event) => {
      this.onTouchMove(event);
    });
  }

  removeEventListeners() {
    document.removeEventListener("mousewheel", this.onMouseEvent);
    document.removeEventListener("touchstart", (event) => {
      this.onTouchStart(event);
    });
    document.removeEventListener("touchmove", (event) => {
      this.onTouchMove(event);
    });
  }

  destroy() {
    this.removeEventListeners();
  }
}
