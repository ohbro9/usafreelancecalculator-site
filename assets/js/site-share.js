(function () {
  if (window.__ufcSiteShareInstalled) {
    return;
  }

  window.__ufcSiteShareInstalled = true;

  function canonicalUrl() {
    var canonical = document.querySelector('link[rel="canonical"]');
    if (canonical && canonical.href) {
      return canonical.href;
    }
    return window.location.href;
  }

  function pageTitle(section) {
    if (section.dataset.shareTitle) {
      return section.dataset.shareTitle;
    }
    return String(document.title || '')
      .split('|')[0]
      .trim() || 'USA Freelance Calculator Toolkit';
  }

  function shareText(section) {
    if (section.dataset.shareText) {
      return section.dataset.shareText;
    }
    return 'Try this premium freelancer calculator from USA Freelance Calculator Toolkit.';
  }

  function setStatus(section, message) {
    var status = section.querySelector('[data-tool-share-status]');
    if (!status) {
      return;
    }
    status.textContent = message;
  }

  function copyText(value) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      return navigator.clipboard.writeText(value);
    }

    return new Promise(function (resolve, reject) {
      try {
        var textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.setAttribute('readonly', 'readonly');
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        textarea.setSelectionRange(0, textarea.value.length);
        var ok = document.execCommand('copy');
        document.body.removeChild(textarea);
        if (ok) {
          resolve();
          return;
        }
      } catch (error) {
        reject(error);
        return;
      }
      reject(new Error('Copy unavailable'));
    });
  }

  function networkUrl(network, title, text, url) {
    var encodedUrl = encodeURIComponent(url);
    var encodedText = encodeURIComponent(text);
    var encodedCombo = encodeURIComponent(text + ' ' + url);
    if (network === 'whatsapp') {
      return 'https://wa.me/?text=' + encodedCombo;
    }
    if (network === 'x') {
      return 'https://twitter.com/intent/tweet?text=' + encodedText + '&url=' + encodedUrl;
    }
    if (network === 'facebook') {
      return 'https://www.facebook.com/sharer/sharer.php?u=' + encodedUrl;
    }
    if (network === 'linkedin') {
      return 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodedUrl;
    }
    return '';
  }

  function openNetwork(section, network) {
    var title = pageTitle(section);
    var text = shareText(section);
    var url = canonicalUrl();
    var target = networkUrl(network, title, text, url);
    if (!target) {
      return;
    }
    window.open(target, '_blank', 'noopener,noreferrer');
    setStatus(section, network.charAt(0).toUpperCase() + network.slice(1) + ' share opened in a new tab.');
  }

  function handleNativeShare(section) {
    var title = pageTitle(section);
    var text = shareText(section);
    var url = canonicalUrl();

    if (navigator.share) {
      navigator.share({
        title: title,
        text: text,
        url: url
      }).then(function () {
        setStatus(section, 'Share sheet opened.');
      }).catch(function () {
        setStatus(section, 'Share action dismissed. You can still copy the link or use a quick share option.');
      });
      return;
    }

    copyText(url).then(function () {
      setStatus(section, 'Link copied. Use a quick share option below if you want a direct social post.');
    }).catch(function () {
      setStatus(section, 'Copy was not available here. Try a quick share option below.');
    });
  }

  function initSection(section) {
    section.addEventListener('click', function (event) {
      var actionButton = event.target.closest('[data-tool-share-action]');
      if (actionButton) {
        var action = actionButton.getAttribute('data-tool-share-action');
        if (action === 'native') {
          handleNativeShare(section);
          return;
        }
        if (action === 'copy') {
          copyText(canonicalUrl()).then(function () {
            setStatus(section, 'Tool link copied to your clipboard.');
          }).catch(function () {
            setStatus(section, 'Automatic copy was unavailable on this browser.');
          });
        }
        return;
      }

      var networkButton = event.target.closest('[data-tool-share-network]');
      if (!networkButton) {
        return;
      }

      openNetwork(section, networkButton.getAttribute('data-tool-share-network'));
    });
  }

  function init() {
    var sections = document.querySelectorAll('.tool-share-section');
    if (!sections.length) {
      return;
    }
    sections.forEach(initSection);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
