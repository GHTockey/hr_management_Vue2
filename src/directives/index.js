export const settleImgError = {
    inserted(dom, options) {
        dom.onerror = function () {
            dom.src = options.value;
        }
    }
}