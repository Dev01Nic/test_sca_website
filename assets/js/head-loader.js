const base = document.createElement('base');
base.href = window.location.hostname.includes('github.io') ? '/test_sca_website/' : '/ttt';
document.head.prepend(base);