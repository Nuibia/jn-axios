import DefaultTheme from 'vitepress/theme';
import DemoContainer from './components/DemoContainer.vue';
import BasicDemo from './components/demos/BasicDemo.vue';
import ErrorHandlingDemo from './components/demos/ErrorHandlingDemo.vue';
import './styles/vars.css';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('DemoContainer', DemoContainer);
    app.component('BasicDemo', BasicDemo);
    app.component('ErrorHandlingDemo', ErrorHandlingDemo);
  },
};
