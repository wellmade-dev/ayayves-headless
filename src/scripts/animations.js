import { gsap } from "gsap";

// Dim Link List Siblings on Hover
function animateLinkGroups(target, isHoveringIn, config) {
  if (!target) {
    return
  };

  const children = Array.from(target.parentNode.children);

  const siblings = children.filter(
    (sibling) => sibling !== target
  );

  const defaultConfig = {
    dim: false,
    dimOpacity: 0.5,
    dimDuration: 0.3,
    dimEase: "none",
    ticker: false,
    tickerDuration: false,
    addClass: false,
    className: null,
  };

  // Merge default config with passed-in config
  const {
    dim,
    dimOpacity,
    dimDuration,
    dimEase,
    ticker,
    tickerDuration,
  } = { ...defaultConfig, ...config };

  if (isHoveringIn) {
    if (dim) {
      gsap.to(target, { opacity: 1, duration: dimDuration, ease: dimEase, overwrite: true });
      siblings.forEach(sibling => {
        gsap.to(sibling, { opacity: dimOpacity, duration: dimDuration, ease: dimEase, overwrite: true });
      })
    }
    if (ticker) {
      tickerLinkHover(target, false, tickerDuration);
    }
  } else {
    children.forEach(child => {
      gsap.to(child, { opacity: 1, duration: dimDuration, ease: dimEase, overwrite: true }); // Reset Opacity
    });
  }
}

// Animate Ticker Label on Button
export function tickerLinkHover(input, newLabel, customDuration, manualLabelReset) {
  const labelText = input.querySelector(".label");
  const labelWrapper = labelText.parentNode;
  const animationDuration = customDuration || 0.25 ;
  const animationEase = "power1.out";

  function resetLinkLabel() {
    const duplicatedLabel = labelWrapper.querySelector(".duplicated-label");
    gsap.to(labelText, { y: 0, duration: animationDuration, ease: animationEase });
    gsap.to(duplicatedLabel, {
      y: "100%", duration: animationDuration, ease: animationEase,
      onComplete: () => {
        duplicatedLabel?.remove();
        if (!manualLabelReset) {
          input.removeEventListener('mouseout', resetLinkLabel);
        }
      }
    });
  }

  let duplicatedLabel = input.querySelector(".duplicated-label");
  if (duplicatedLabel) {
    resetLinkLabel(duplicatedLabel);
    return
  }

  // Logic for hover in
  duplicatedLabel = labelText.cloneNode(true);
  Object.assign(duplicatedLabel.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
  });
  duplicatedLabel.classList.add("duplicated-label");

  if (newLabel) {
    duplicatedLabel.textContent = newLabel;
  }

  labelWrapper.appendChild(duplicatedLabel);

  // Start animation for hover in
  gsap.to(labelText, { y: "-100%", duration: animationDuration, ease: animationEase });
  gsap.from(duplicatedLabel, { y: "100%", duration: animationDuration, ease: animationEase });

  // Attach the mouse-out event listener to handle automatic mouse-out animation
  if (!manualLabelReset) {
    input.addEventListener('mouseout', resetLinkLabel);
  }
}

export function initLinkGroups(parent, targetClass, config, outConfig) {
  parent.addEventListener('mouseover', function (event) {
    let targetElement = event.target.closest(targetClass);
    if (targetElement && this.contains(targetElement)) {
      animateLinkGroups(targetElement, true, config)
    }
  })

  parent.addEventListener('mouseout', function (event) {
    let targetElement = event.target.closest(targetClass);
    if (targetElement && this.contains(targetElement)) {
      animateLinkGroups(targetElement, false, outConfig || config)
    }
  })
}

export function initDisplayButtons() {
  if (!window.initDisplayButtons) {
    let buttonsGlass = document.querySelectorAll(
    ".button--display:not(.tertiary)"
    );

    const animateButton = (buttonGlass, moveStar, moveText, duration, ease) => {
      gsap.to(buttonGlass.querySelectorAll(".star-w"), {
        x: moveStar,
        duration: duration,
        ease: ease,
      });
      gsap.to(buttonGlass.querySelector(".label"), {
        x: moveText,
        duration: duration,
        ease: ease,
      });
    };

    buttonsGlass.forEach((buttonGlass) => {
      buttonGlass.addEventListener("mouseenter", (event) => {
        let starElement = buttonGlass.querySelector(".star-w");
        let starWidth = (starElement)?.offsetWidth;
        let borderWidth = parseInt(
          window.getComputedStyle(buttonGlass).outlineWidth,
          10
        );
        let paddingRight = parseInt(
          window.getComputedStyle(buttonGlass).paddingRight,
          10
        );

        let moveStar = starWidth + borderWidth + paddingRight;
        let moveText = starWidth - paddingRight * 2;

        animateButton(buttonGlass, moveStar, moveText, 0.3, "power4");
      });

      buttonGlass.addEventListener("mouseleave", () => {
        animateButton(buttonGlass, 0, 0, 0.4, "power2");
      });
    });

    window.initDisplayButtons = true;
  }
}