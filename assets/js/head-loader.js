const base = document.createElement('base');
base.href = window.location.hostname.includes('github.io') ? '/test_sca_website/' : '/';
document.head.prepend(base);