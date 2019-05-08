'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 表单验证
 * 
 * @param {Object} rules 验证字段的规则
 * @param {Object} messages 验证字段的提示信息
 * 
 */
var wxValidate = function () {
    function wxValidate() {
        var rules = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var messages = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, wxValidate);

        Object.assign(this, {
            rules: rules,
            messages: messages
        });
        this.__init();
    }

    /**
     * __init
     */


    _createClass(wxValidate, [{
        key: '__init',
        value: function __init() {
            this.__initMethods();
            this.__initDefaults();
            this.__initData();
        }

        /**
         * 初始化数据
         */

    }, {
        key: '__initData',
        value: function __initData() {
            this.form = {};
            this.errorList = [];
        }

        /**
         * 初始化默认提示信息
         */

    }, {
        key: '__initDefaults',
        value: function __initDefaults() {
            this.defaults = {
                messages: {
                    required: '这是必填字段。',
                    email: '请输入有效的电子邮件地址。',
                    tel: '请输入11位的手机号码。',
                    url: '请输入有效的网址。',
                    date: '请输入有效的日期。',
                    dateISO: '请输入有效的日期（ISO），例如：2009-06-23，1998/01/22。',
                    number: '请输入有效的数字。',
                    digits: '只能输入数字。',
                    idcard: '请输入18位的有效身份证。',
                    equalTo: this.formatTpl('输入值必须和 {0} 相同。'),
                    contains: this.formatTpl('输入值必须包含 {0}。'),
                    minlength: this.formatTpl('最少要输入 {0} 个字符。'),
                    maxlength: this.formatTpl('最多可以输入 {0} 个字符。'),
                    rangelength: this.formatTpl('请输入长度在 {0} 到 {1} 之间的字符。'),
                    min: this.formatTpl('请输入不小于 {0} 的数值。'),
                    max: this.formatTpl('请输入不大于 {0} 的数值。'),
                    range: this.formatTpl('请输入范围在 {0} 到 {1} 之间的数值。')
                }
            };
        }

        /**
         * 初始化默认验证方法
         */

    }, {
        key: '__initMethods',
        value: function __initMethods() {
            var that = this;
            that.methods = {
                /**
                 * 验证必填元素
                 */
                required: function required(value, param) {
                    if (!that.depend(param)) {
                        return 'dependency-mismatch';
                    } else if (typeof value === 'number') {
                        value = value.toString();
                    } else if (typeof value === 'boolean') {
                        return !0;
                    }

                    return value.length > 0;
                },

                /**
                 * 验证电子邮箱格式
                 */
                email: function email(value) {
                    return that.optional(value) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value);
                },

                /**
                 * 验证手机格式
                 */
                tel: function tel(value) {
                    return that.optional(value) || /^1[34578]\d{9}$/.test(value);
                },

                /**
                 * 验证URL格式
                 */
                url: function url(value) {
                    return that.optional(value) || /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
                },

                /**
                 * 验证日期格式
                 */
                date: function date(value) {
                    return that.optional(value) || !/Invalid|NaN/.test(new Date(value).toString());
                },

                /**
                 * 验证ISO类型的日期格式
                 */
                dateISO: function dateISO(value) {
                    return that.optional(value) || /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(value);
                },

                /**
                 * 验证十进制数字
                 */
                number: function number(value) {
                    return that.optional(value) || /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
                },

                /**
                 * 验证整数
                 */
                digits: function digits(value) {
                    return that.optional(value) || /^\d+$/.test(value);
                },

                /**
                 * 验证身份证号码
                 */
                idcard: function idcard(value) {
                    return that.optional(value) || /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(value);
                },

                /**
                 * 验证两个输入框的内容是否相同
                 */
                equalTo: function equalTo(value, param) {
                    return that.optional(value) || value === that.scope.detail.value[param];
                },

                /**
                 * 验证是否包含某个值
                 */
                contains: function contains(value, param) {
                    return that.optional(value) || value.indexOf(param) >= 0;
                },

                /**
                 * 验证最小长度
                 */
                minlength: function minlength(value, param) {
                    return that.optional(value) || value.length >= param;
                },

                /**
                 * 验证最大长度
                 */
                maxlength: function maxlength(value, param) {
                    return that.optional(value) || value.length <= param;
                },

                /**
                 * 验证一个长度范围[min, max]
                 */
                rangelength: function rangelength(value, param) {
                    return that.optional(value) || value.length >= param[0] && value.length <= param[1];
                },

                /**
                 * 验证最小值
                 */
                min: function min(value, param) {
                    return that.optional(value) || value >= param;
                },

                /**
                 * 验证最大值
                 */
                max: function max(value, param) {
                    return that.optional(value) || value <= param;
                },

                /**
                 * 验证一个值范围[min, max]
                 */
                range: function range(value, param) {
                    return that.optional(value) || value >= param[0] && value <= param[1];
                }
            };
        }

        /**
         * 添加自定义验证方法
         * @param {String} name 方法名
         * @param {Function} method 函数体，接收两个参数(value, param)，value表示元素的值，param表示参数
         * @param {String} message 提示信息
         */

    }, {
        key: 'addMethod',
        value: function addMethod(name, method, message) {
            this.methods[name] = method;
            this.defaults.messages[name] = message !== undefined ? message : this.defaults.messages[name];
        }

        /**
         * 判断验证方法是否存在
         */

    }, {
        key: 'isValidMethod',
        value: function isValidMethod(value) {
            var methods = [];
            for (var method in this.methods) {
                if (method && typeof this.methods[method] === 'function') {
                    methods.push(method);
                }
            }
            return methods.indexOf(value) !== -1;
        }

        /**
         * 格式化提示信息模板
         */

    }, {
        key: 'formatTpl',
        value: function formatTpl(source, params) {
            var that = this;
            if (arguments.length === 1) {
                return function () {
                    var args = Array.from(arguments);
                    args.unshift(source);
                    return that.formatTpl.apply(this, args);
                };
            }
            if (params === undefined) {
                return source;
            }
            if (arguments.length > 2 && params.constructor !== Array) {
                params = Array.from(arguments).slice(1);
            }
            if (params.constructor !== Array) {
                params = [params];
            }
            params.forEach(function (n, i) {
                source = source.replace(new RegExp("\\{" + i + "\\}", "g"), function () {
                    return n;
                });
            });
            return source;
        }

        /**
         * 判断规则依赖是否存在
         */

    }, {
        key: 'depend',
        value: function depend(param) {
            switch (typeof param === 'undefined' ? 'undefined' : _typeof(param)) {
                case 'boolean':
                    param = param;
                    break;
                case 'string':
                    param = !!param.length;
                    break;
                case 'function':
                    param = param();
                default:
                    param = !0;
            }
            return param;
        }

        /**
         * 判断输入值是否为空
         */

    }, {
        key: 'optional',
        value: function optional(value) {
            return !this.methods.required(value) && 'dependency-mismatch';
        }

        /**
         * 获取自定义字段的提示信息
         * @param {String} param 字段名
         * @param {Object} rule 规则
         */

    }, {
        key: 'customMessage',
        value: function customMessage(param, rule) {
            var params = this.messages[param];
            var isObject = (typeof params === 'undefined' ? 'undefined' : _typeof(params)) === 'object';
            if (params && isObject) return params[rule.method];
        }

        /**
         * 获取某个指定字段的提示信息
         * @param {String} param 字段名
         * @param {Object} rule 规则
         */

    }, {
        key: 'defaultMessage',
        value: function defaultMessage(param, rule) {
            var message = this.customMessage(param, rule) || this.defaults.messages[rule.method];
            var type = typeof message === 'undefined' ? 'undefined' : _typeof(message);

            if (type === 'undefined') {
                message = 'Warning: No message defined for ' + rule.method + '.';
            } else if (type === 'function') {
                message = message.call(this, rule.parameters);
            }

            return message;
        }

        /**
         * 缓存错误信息
         * @param {String} param 字段名
         * @param {Object} rule 规则
         * @param {String} value 元素的值
         */

    }, {
        key: 'formatTplAndAdd',
        value: function formatTplAndAdd(param, rule, value) {
            var msg = this.defaultMessage(param, rule);

            this.errorList.push({
                param: param,
                msg: msg,
                value: value
            });
        }

        /**
         * 验证某个指定字段的规则
         * @param {String} param 字段名
         * @param {Object} rules 规则
         * @param {Object} event 表单数据对象
         */

    }, {
        key: 'checkParam',
        value: function checkParam(param, rules, event) {

            // 缓存表单数据对象
            this.scope = event;

            // 缓存字段对应的值
            var data = event.detail.value;
            var value = data[param] || '';

            // 遍历某个指定字段的所有规则，依次验证规则，否则缓存错误信息
            for (var method in rules) {

                // 判断验证方法是否存在
                if (this.isValidMethod(method)) {

                    // 缓存规则的属性及值
                    var rule = {
                        method: method,
                        parameters: rules[method]
                    };

                    // 调用验证方法
                    var result = this.methods[method](value, rule.parameters);

                    // 若result返回值为dependency-mismatch，则说明该字段的值为空或非必填字段
                    if (result === 'dependency-mismatch') {
                        continue;
                    }

                    this.setValue(param, method, result, value);

                    // 判断是否通过验证，否则缓存错误信息，跳出循环
                    if (!result) {
                        this.formatTplAndAdd(param, rule, value);
                        break;
                    }
                }
            }
        }

        /**
         * 设置字段的默认验证值
         * @param {String} param 字段名
         */

    }, {
        key: 'setView',
        value: function setView(param) {
            this.form[param] = {
                $name: param,
                $valid: true,
                $invalid: false,
                $error: {},
                $success: {},
                $viewValue: ''
            };
        }

        /**
         * 设置字段的验证值
         * @param {String} param 字段名
         * @param {String} method 字段的方法
         * @param {Boolean} result 是否通过验证
         * @param {String} value 字段的值
         */

    }, {
        key: 'setValue',
        value: function setValue(param, method, result, value) {
            var params = this.form[param];
            params.$valid = result;
            params.$invalid = !result;
            params.$error[method] = !result;
            params.$success[method] = result;
            params.$viewValue = value;
        }

        /**
         * 验证所有字段的规则，返回验证是否通过
         * @param {Object} event 表单数据对象
         */

    }, {
        key: 'checkForm',
        value: function checkForm(event) {
            this.__initData();

            for (var param in this.rules) {
                this.setView(param);
                this.checkParam(param, this.rules[param], event);
            }

            return this.valid();
        }

        /**
         * 返回验证是否通过
         */

    }, {
        key: 'valid',
        value: function valid() {
            return this.size() === 0;
        }

        /**
         * 返回错误信息的个数
         */

    }, {
        key: 'size',
        value: function size() {
            return this.errorList.length;
        }

        /**
         * 返回所有错误信息
         */

    }, {
        key: 'validationErrors',
        value: function validationErrors() {
            return this.errorList;
        }
    }]);

    return wxValidate;
}();

exports.default = wxValidate;