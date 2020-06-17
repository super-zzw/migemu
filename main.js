import Vue from 'vue'
import App from './App'
import store from "./store"
import {http,upLoadImg} from './utils/request.js';
import DefaultPage from "components/defaultPage.vue";
Vue.config.productionTip = false

App.mpType = 'app'

Vue.prototype.$http = http;
Vue.prototype.$upLoadImg = upLoadImg;

Vue.prototype.$copy = function(str){
	uni.setClipboardData({
		data:str
	})
}
Vue.component('DefaultPage',DefaultPage);
const app = new Vue({
	store,
    ...App
})
app.$mount()
