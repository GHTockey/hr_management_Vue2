import PageTools from "./PageTools";
import TagsView from "./TagsView";
export default {
    install(Vue) {
        Vue.component('PageTools', PageTools),
        Vue.component('TagsView', TagsView)
    }
}