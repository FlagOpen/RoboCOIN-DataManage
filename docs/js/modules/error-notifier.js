/**
 * @file Error Notifier Module
 * @description Centralized user-facing notification helpers.
 *
 * 当前实现仍然基于 window.alert，后续可以很方便地替换为自定义 Toast/UI 组件，
 * 只需要修改本模块而不影响业务代码。
 */

class ErrorNotifier {
    /**
     * Show an error message to the user.
     * @param {string} message
     * @param {Error} [error]
     */
    static error(message, error) {
        if (error) {
            // 统一在控制台打印完整错误信息
            // eslint-disable-next-line no-console
            console.error(message, error);
        } else {
            // eslint-disable-next-line no-console
            console.error(message);
        }
        // 用户可见提示（当前仍使用 alert，未来可替换）
        // eslint-disable-next-line no-alert
        alert(message);
    }

    /**
     * Show an informational / success message to the user.
     * @param {string} message
     */
    static info(message) {
        // 当前简单实现，后续可以改为非阻塞式通知
        // eslint-disable-next-line no-alert
        alert(message);
    }
}

export default ErrorNotifier;


