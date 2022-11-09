import VueI18n from "vue-i18n";
import Vue from "vue";
import Cookie from "js-cookie";
import zhCN from "element-ui/lib/locale/lang/zh-CN";
import enUS from "element-ui/lib/locale/lang/en";
import customEN from "./en";
import customZH from "./zh";

Vue.use(VueI18n)

export default new VueI18n({
    locale: Cookie.get('language') || 'zh', // 读 cookie 取要显示的语言，没有默认为 zh 中文
    messages: {
        en: { ...enUS, ...customEN },
        zh: { ...zhCN, ...customZH}
    }
})