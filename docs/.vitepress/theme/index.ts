import DefaultTheme from 'vitepress/theme';
import DemoContainer from './components/DemoContainer.vue';
import BasicDemo from './components/demos/BasicDemo.vue';
import ErrorHandlingDemo from './components/demos/ErrorHandlingDemo.vue';
import GetDemo from './components/demos/GetDemo.vue';
import PostDemo from './components/demos/PostDemo.vue';
import './styles/vars.css';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('DemoContainer', DemoContainer);
    app.component('BasicDemo', BasicDemo);
    app.component('ErrorHandlingDemo', ErrorHandlingDemo);
    app.component('GetDemo', GetDemo);
    app.component('PostDemo', PostDemo);
  },
};
