import Vue from 'vue';
import App from './App.vue';

import ('./css/common.less');
import ('./css/manage.less');
import ('./css/home-page-layout.less');

import ('./components/functions/tools/websitePro/css/website-pro.less');
import ('./components/icons/console-icon/iconfont.css');

Vue.config.productionTip = false;

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/css/swiper.css';

Vue.use(VueAwesomeSwiper)

import VueClipboard from 'vue-clipboard2';
Vue.use(VueClipboard);

import VueCropper from 'vue-cropper'

Vue.use(VueCropper);

import vueScroll from 'vuescroll/dist/vuescroll-native';

Vue.use(vueScroll, {
    ops: {
        bar: {
            background: 'rgba(0,0,0,0.2)',
            onlyShowBarOnScroll: false
        },
        // rail: {
        //     keepShow: true
        // }
    }
});
import { Popup, Button, Dialog, Form, Field, Picker, Icon } from 'vant';
Vue.use(Popup);
Vue.use(Button);
Vue.use(Dialog);
Vue.use(Form);
Vue.use(Field);
Vue.use(Picker);
Vue.use(Icon);
import VueCodemirror from 'vue-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/css/css.js';
// theme css
import 'codemirror/theme/neo.css';

Vue.use(VueCodemirror);

import draggable from 'vuedraggable';

Vue.component('draggable', draggable);

import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer';
Vue.use(Viewer);

import httpRequest from './js/config/requestConfig';

Vue.prototype.$request = httpRequest;

import store from './js/store';
import Vuex from 'vuex';

Vue.use(Vuex);

import MetaInfo from 'vue-meta-info';

Vue.use(MetaInfo);

import Filter from './js/config/filterConfig';

Vue.use(Filter);

import Directives from './js/config/directiveConfig';
Vue.use(Directives);

import Video from 'video.js';
import 'video.js/dist/video-js.css';

Vue.prototype.$video = Video;

import router from './js/router';

import openLoading from './js/util/mask'
Vue.prototype.openLoading = openLoading


import { SET_AREALIST } from "@/js/store/mutation-types";

const IE11RouterFix = {
    methods: {
        hashChangeHandler: function() {
            this.$router.push(window.location.hash.substring(1, window.location.hash.length));
        },
        isIE11: function() {
            return !!window.MSInputMethodContext && !!document.documentMode;
        }
    },
    mounted: function() {
        if (this.isIE11()) {
            window.addEventListener('hashchange', this.hashChangeHandler);
        }
        this.$request.get("/api/common/anon/area").then(res => {
          this.$store.commit(SET_AREALIST, res.data);
        });
    },
    destroyed: function() {
        if (this.isIE11()) {
            window.removeEventListener('hashchange', this.hashChangeHandler);
        }
    }
};


window.vm = new Vue({
    render: h => h(App),
    store: new Vuex.Store(store),
    router,
    mixins: [IE11RouterFix]
}).$mount('#app');

document.body.ondrop = function(event) {
    event.preventDefault();
    event.stopPropagation();
};
