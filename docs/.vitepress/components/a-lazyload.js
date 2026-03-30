import { htmlMinify, debounce } from './util';

const template = htmlMinify(`
<span ref="lazy">
  <slot name="default"></slot>
</span>
`);

export default {
  template,
  data() {
    return {
      loaded: false,
      handler: null,
    };
  },
  mounted() {
    setTimeout(() => {
      this.shouldLoad(() => {
        this.listen();
      });
    }, 100);
  },
  beforeUnmount() {
    this.dismiss();
  },
  methods: {
    listen() {
      this.handler = debounce(this.onscroll, 100);
      document.addEventListener('scroll', this.handler);
    },
    dismiss() {
      document.removeEventListener('scroll', this.handler);
      this.handler = null;
    },
    onscroll() {
      this.shouldLoad();
    },
    shouldLoad(next) {
      const clientHeight = document.documentElement.clientHeight;
      const preload = 0.5 * clientHeight;
      const { bottom, top } = this.$refs.lazy.getBoundingClientRect();
      if (!this.loaded && bottom - clientHeight < preload && top > 0 - preload) {
        this.loaded = true;
        this.$emit('load');
        this.dismiss();
        return;
      } else if (typeof next === 'function') {
        next();
      }
    },
  },
};
