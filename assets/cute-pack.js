(function () {
  var path = window.location.pathname.replace(/\/+$/, '');
  var isEmergency = /\/emergency$/.test(path);

  if (isEmergency) {
    document.body.classList.add('cp-emergency');
  }

  if (!('IntersectionObserver' in window)) return;

  var selectors = ['.pl-btn', '.wifi-card', '.wifi', '.chat-box'];
  if (!isEmergency) {
    selectors = selectors.concat(['.info-card', '.notice-card', '.driver-card', '.app-card', '.rest-card', '.caption', '.step-caption', '[data-content] > *']);
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('cp-in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: .15 });

  document.querySelectorAll(selectors.join(',')).forEach(function (el) {
    el.classList.add('cp-reveal');
    io.observe(el);
  });
})();
