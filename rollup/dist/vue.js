(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

    var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // 小a-z 大A到Z 标签名称： div  span a-aa
    //?: 匹配不捕获
    var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // 捕获这种 <my:xx> </my:xx>
    var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则 捕获的内容是标签名
    var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配标签结尾的 </div>
    var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
    //属性匹配   <div id="atts"></div>  // aa = "aa" | aa = 'aa'
    var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的  <div></div>  <br/>
    //vue3 一摸一样的
    function createASTELement(tagName, attrs) {
      return {
        tag: tagName,
        //标签名称
        type: 1,
        //元素类型
        children: [],
        // 孩子列表
        attrs: attrs,
        //属性集合
        parent: null // 父元素
      };
    }

    var root,
      currentParent,
      stack = [];
    function start(tagName, attrs) {
      var element = createASTELement(tagName, attrs);
      if (!root) {
        root = element;
      }
      currentParent = element;
      stack.push(element);
    }
    function end() {
      // 从栈中取出一个
      var element = stack.pop();
      currentParent = stack[stack.length - 1];
      if (currentParent) {
        element.parent = currentParent;
        currentParent.children.push(element);
      }
    }
    function chars(text) {
      // console.log(text)
      text = text.replace(/\s/g, '');
      if (text) {
        currentParent.children.push({
          type: 3,
          //元素类型
          text: text // 孩子列表
        });
      }
    }

    function parseHTML(html) {
      //1解析标签  <div id="my">hello {{name}} <span>world</span></div>
      while (html) {
        // 只要html 不为空字符串就一直执行下去
        var textEnd = html.indexOf('<');
        if (textEnd === 0) {
          var startTagMatch = parseStartTag(); //开始标签匹配结果
          if (startTagMatch) {
            start(startTagMatch.tagName, startTagMatch.attrs);
            continue; //中断（循环中）的一个迭代，如果发生指定的条件。然后继续循环中的下一个迭代。
          }

          var endTagMatch = html.match(endTag);
          if (endTagMatch) {
            end();
            advance(endTagMatch[0].length);
            continue;
          }
          // console.log(html)
        }
        //文本 
        var text = void 0;
        if (textEnd > 0) {
          // console.log(textEnd)
          text = html.substring(0, textEnd);
          if (text) {
            //处理文本
            chars(text);
            advance(text.length);
          }
        }
      }
      //删除标签
      function advance(n) {
        //将字符串进行截取操作，再跟新到html
        html = html.substring(n);
      }
      function parseStartTag() {
        var start = html.match(startTagOpen);
        if (start) {
          var match = {
            tagName: start[1],
            attrs: []
          };
          advance(start[0].length);
          /**
           *  复杂写法
           *  let end = html.match(startTagClose),
           *  attr = attr = html.match(attribute)
           *  // 匹配到attr但是没有匹配到闭合标签,循环匹配attr并将其push进attrs
           *  while(!end && attr) {
           *     console.log(attr)
           *     match.attrs.push({name: attr[1], value: attr[3] || attr[4] || attr[5] })
           *     advance(attr[0].length)
           *     end = html.match(startTagClose)
           *     attr = attr = html.match(attribute)
           *  }
           */
          var _end, attr;
          // 匹配到attr但是没有匹配到闭合标签,循环匹配attr并将其push进attrs
          while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
            match.attrs.push({
              name: attr[1],
              value: attr[3] || attr[4] || attr[5]
            });
            advance(attr[0].length);
          }
          // 匹配到闭合标签结束处理
          if (_end) {
            advance(_end[0].length);
            return match;
          }
        }
      }
      console.log(root);
      return root;
    }

    function _iterableToArrayLimit(arr, i) {
      var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
      if (null != _i) {
        var _s,
          _e,
          _x,
          _r,
          _arr = [],
          _n = !0,
          _d = !1;
        try {
          if (_x = (_i = _i.call(arr)).next, 0 === i) {
            if (Object(_i) !== _i) return;
            _n = !1;
          } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
        } catch (err) {
          _d = !0, _e = err;
        } finally {
          try {
            if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return;
          } finally {
            if (_d) throw _e;
          }
        }
        return _arr;
      }
    }
    function _typeof(obj) {
      "@babel/helpers - typeof";

      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
        return typeof obj;
      } : function (obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      }, _typeof(obj);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", {
        writable: false
      });
      return Constructor;
    }
    function _slicedToArray(arr, i) {
      return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
    }
    function _arrayWithHoles(arr) {
      if (Array.isArray(arr)) return arr;
    }
    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }
    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length) len = arr.length;
      for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
      return arr2;
    }
    function _nonIterableRest() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    function _toPrimitive(input, hint) {
      if (typeof input !== "object" || input === null) return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== undefined) {
        var res = prim.call(input, hint || "default");
        if (typeof res !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return typeof key === "symbol" ? key : String(key);
    }

    //思路
    //  <div id="app" style="color:red"> hello {{name}}<p>hello1</P> </div>
    //变成 render()
    // render(){
    //      return _c("div",{id:"app",style:{color:"res"}},_v('hello'+_s(name)),_c('p'，null,_v('hello1)))
    //    }
    var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; //注意正则匹配 lastIndex

    // attrs
    function genProps(attrs) {
      //处理属性
      var str = '';
      var _loop = function _loop() {
        var attr = attrs[i];
        //注意;   style："color:red;font-size: 20px
        if (attr.name === 'style') {
          var obj = {}; //对样式进行特殊处理
          attr.value.split(';').forEach(function (item) {
            var _item$split = item.split(':'),
              _item$split2 = _slicedToArray(_item$split, 2),
              key = _item$split2[0],
              value = _item$split2[1];
            obj[key] = value;
          });
          attr.value = obj; //
        }
        //其他  'id:app',注意最后会多个属性化 逗号
        str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
      };
      for (var i = 0; i < attrs.length; i++) {
        _loop();
      }
      return "{".concat(str.slice(0, -1), "}"); // -1为最后一个字符串的位置  演示一下 
      // let reg =/a/g    reg.test('ad') false  
    }

    function genChildren(children) {
      if (children) {
        var res = children.map(function (child) {
          return gen(child);
        });
        return res.join(',');
      }
    }
    function gen(node) {
      //获取到的元素
      //注意 是什么类型  文本   div
      if (node.type === 1) {
        return generate(node); //生成元素节点的字符串
      } else {
        var text = node.text; // 获取文本  注意  普通的文本  hello{{name}}?{{num}}
        if (!defaultTagRE.test(text)) {
          return "_v(".concat(JSON.stringify(text), ")"); // _v(html)  _v('hello'+_s(name))
        }

        var tokens = []; //存放每一段的代码
        var lastIndex = defaultTagRE.lastIndex = 0; //如果正则是全局模式 需要每次使用前变为0
        var match; // 每次匹配到的结果  exec 获取 {{name}}
        while (match = defaultTagRE.exec(text)) {
          // console.log(match) 获取到 又{{}}  元素
          //  console.log(match)
          var index = match.index; // 保存匹配到的索引
          // hello{{name}} ? {{num}}
          if (index > lastIndex) {
            tokens.push(JSON.stringify(text.slice(lastIndex, index))); //添加的是文本
            //    console.log(tokens)
          }
          //{{name}} 添加{{}} aa
          tokens.push("_s(".concat(match[1].trim(), ")"));
          lastIndex = index + match[0].length; //最后 {{}} 索引位置
        }

        if (lastIndex < text.length) {
          tokens.push(JSON.stringify(text.slice(lastIndex)));
        }
        //最终返回出去

        return "_v(".concat(tokens.join("+"), ")");
      }
    }
    //语法层面的转移
    function generate(el) {
      //方法 拼接字符串  源码也是这样操作 [{}]    ${el.attrs.length?`{style:{color:red}}`:'undefined'}
      var code = "_c('".concat(el.tag, "', ").concat(el.attrs ? genProps(el.attrs) : null, ", ").concat(el.children ? genChildren(el.children) : null, ")");
      /**
       *   root         prop         child                                        child          
       * _c('div', {id: 'app'},_c('div', null, _v(_s(name)+ "jello" + _s(age)), _c('div'))
       * 
       */
      return code;
    }

    /**
     * 过程：
     * 1.把真实dom变成ast语法树(vnode)
     * 2.把vNode编程render函数
     * 3.再执行render函数变成真实dom
     */
    function compileToFunction(template) {
      // console.log(template)
      // 创建ast语法树
      var ast = parseHTML(template);

      // 把语法树变成字符串
      var code = generate(ast);
      // console.log(code)

      // // 将字符串变成render函数,模板引擎with + new Function() {}
      var render = new Function("with(this){return ".concat(code, "}"));
      // console.log(render)

      return render;
    }

    var starts = {};
    var LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed'];
    LIFECYCLE_HOOKS.forEach(function (hook) {
      starts[hook] = function (p, c) {
        if (c) {
          if (p) {
            // 儿子有父亲有
            return p.concat(c);
          } else {
            // 儿子有父亲没有
            return [c];
          }
        } else {
          // 儿子没有，父亲有

          return p;
        }
      };
    });
    function mergeOptions() {
      var parent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var child = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = {};
      function mergeField(key) {
        if (starts[key]) {
          // 策略模式中有
          /**
           * {
           *  created: [], 进行再处理
           *  a: 1 
           * }
           */
          options[key] = starts[key](parent[key], child[key]);
        } else {
          // 没有直接赋值
          options[key] = child[key] || parent[key];
        }
      }

      // 先合并父亲再合并儿子
      for (var key in parent) {
        mergeField(key);
      }
      for (var _key in child) {
        if (!parent.hasOwnProperty(_key)) {
          mergeField(_key);
        }
      }
      // console.log(options)
      return options;
    }

    function initGlobalAPI(Vue) {
      Vue.options = {};
      Vue.mixin = function (mixin) {
        this.options = mergeOptions(this.options, mixin);
        return this.options;
      };
      Vue.extend = function (options) {
        console.log(options);
        function Sub() {
          var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
          this._init(options);
        }
        Sub.options = options;
        Sub.prototype = Vue.prototype;
        Sub.prototype.constructor = Sub;
        return Sub;
      };
      Vue.options.components = {};
      Vue.component = function (idName, definetion) {
        definetion = typeof definetion === 'function' ? definetion : Vue.extend(definetion);
        Vue.options.components[idName] = definetion;
        console.log(Vue.options.components);
      };
    }

    // 创建标签
    function createElementVNode(tag, props) {
      for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        children[_key - 2] = arguments[_key];
      }
      return vnode(tag, props, props.key, children);
    }
    // 创建文本
    function createTextVNode(text) {
      return vnode(undefined, undefined, undefined, undefined, text);
    }
    function vnode(tag, props, key, children, text) {
      return {
        tag: tag,
        props: props,
        key: key,
        children: children,
        text: text
      };
    }

    function patch(oldNode, newNode) {
      // 首次加载root是真实dom存在nodeType
      oldNode.nodeType;

      // if (isRealElement) {

      //   let newEle = createEle(newNode)
      //   // console.log(root.nextSibling.nextSibling, '1')
      //   // console.log(root.previousSibling , '2')
      //   // 该节点的下一个节点
      //   document.body.insertBefore(newEle, oldNode.nextSibling)
      //   document.body.removeChild(oldNode)

      //   return newNode
      // } else {

      //   return patchVnode(oldNode, newNode)
      // }
      var newEle = createEle(newNode);
      // console.log(root.nextSibling.nextSibling, '1')
      // console.log(root.previousSibling , '2')
      // 该节点的下一个节点
      oldNode.parentNode.insertBefore(newEle, oldNode.nextSibling);
      oldNode.parentNode.removeChild(oldNode);
      return newEle;
    }
    function createEle(vonde) {
      var tag = vonde.tag;
        vonde.el;
        var props = vonde.props,
        children = vonde.children,
        text = vonde.text,
        key = vonde.key;
      if (tag) {
        vonde.el = document.createElement(tag); // 将真实dom挂到虚拟dom上
      } else {
        vonde.el = document.createTextNode(text);
      }
      if (key) {
        vonde.el.setAttribute('key', key);
      }
      patchProps(vonde.el, {}, props);
      if (children && children.length > 0) {
        children.forEach(function (child) {
          var childDom = createEle(child);
          vonde.el.appendChild(childDom);
        });
      }
      return vonde.el;
    }
    function patchProps(el, oldProps, newProps) {
      // 1.老的有 新的没有 则删除属性
      var oldStyle = oldProps === null || oldProps === void 0 ? void 0 : oldProps.style;
      var newStyle = newProps === null || newProps === void 0 ? void 0 : newProps.style;
      for (var key in oldStyle) {
        if (!newStyle[key]) {
          el.style[key] = '';
        }
      }
      for (var _key in oldProps) {
        if (newProps[_key]) {
          el.removeAttribute(_key);
        }
      }
      if (newProps) {
        for (var k in newProps) {
          if (k !== 'style') {
            el.setAttribute(k, newProps[k]);
          } else {
            for (var p in newProps['style']) {
              var pName = p.trim();
              el['style'][pName] = newProps['style'][p];
            }
          }
        }
      }
    }

    var queue = []; // watcher队列
    var has = {}; // watcher的id集合
    var pending = false; // 是否继续处理queue

    function fluseQueue() {
      var nowQueue = queue.slice(0);
      queue = [];
      has = {};
      pending = false;
      nowQueue.forEach(function (watcher) {
        return watcher.run();
      });
    }
    // 异步更新的机制：同步添加watcher到队列中，异步遍历队列进行刷新
    // 事件环：同步任务与异步任务进入主线程，主线程遇到同步任务则执行，遇到异步
    // 任务则放进任务队列中，当同步任务执行完毕，任务队列会将异步任务推进主线程
    // 再执行异步任务

    /**
     * 多次执行变成一次执行,pending状态，数组队列
     */
    function queueWatcher(watcher) {
      var id = watcher.id;
      if (!has[id]) {
        queue.push(watcher);
        has[id] = true;
        if (!pending) {
          nextTick(fluseQueue);
          pending = true;
        }
      }
    }
    var cbs = [];
    var waiting = false;
    // 异步事件的兼容写法
    function timerFunc(cb) {
      if (window.Promise) {
        Promise.resolve().then(function () {
          return cb();
        });
      } else if (window.MutationObserver) {
        new MutationObserver(cb());
      } else if (window.setImmediate) {
        setImmediate(cb());
      } else {
        setTimeout(cb());
      }
    }
    function flushCallbacks() {
      var callbacks = cbs.slice(0);
      cbs = [];
      waiting = false;
      callbacks.forEach(function (cb) {
        return cb();
      });
    }
    function nextTick(cb) {
      // 收集回调函数
      cbs.push(cb);
      if (!waiting) {
        // 一次更新
        timerFunc(flushCallbacks);
        waiting = true;
      }
    }

    /**
     * 每一个属性都对应一个dep，每一个dep都是被观察者，watcher是观察者，
     * 当dep发生改变时，watcher回去通知依赖更改
     */
    var id$1 = 0;
    var Dep = /*#__PURE__*/function () {
      function Dep() {
        _classCallCheck(this, Dep);
        this.id = id$1++, this.subs = []; // watcher的集合
      }
      /**
       * 1.通过dep的depend给watcher添加dep
       */
      _createClass(Dep, [{
        key: "depend",
        value: function depend() {
          if (Dep.target) {
            Dep.target.addDep(this);
          }
        }
        // 多对多
      }, {
        key: "addSub",
        value: function addSub(watcher) {
          this.subs.push(watcher);
        }
      }, {
        key: "notify",
        value: function notify() {
          this.subs.forEach(function (watcher) {
            return watcher.update();
          });
        }
      }]);
      return Dep;
    }();
    Dep.target = null; // 构造函数上的静态属性，有且只有一份

    var targetStack = [];
    function pushTarget(target) {
      targetStack.push(target);
      Dep.target = target;
    }
    function popTarget() {
      targetStack.pop();
      Dep.target = targetStack[targetStack.length - 1];
    }
    var id = 0;
    var Watcher = /*#__PURE__*/function () {
      function Watcher(vm, expOrFn, options, cb) {
        _classCallCheck(this, Watcher);
        this.id = id++;
        if (typeof expOrFn === 'string') {
          this.getter = function () {
            return vm[expOrFn];
          };
        } else {
          this.getter = expOrFn;
        }
        this.vm = vm;
        this.deps = []; // 依赖
        this.depIds = new Set();
        this.lazy = options.lazy; // computed懒属性
        this.dirty = this.lazy; // 脏值检测
        this.user = options.user;
        this.cb = cb;
        this.value = this.lazy ? undefined : this.get();
      }
      _createClass(Watcher, [{
        key: "get",
        value: function get() {
          pushTarget(this);
          var value = this.getter.call(this.vm); // 调用getter将this指向绑定为vm，否则this指向watcher
          popTarget();
          return value;
        }
        /**
         * 一个数据对应一个依赖
         * new Watcher时一个视图对应了一个watcher,但是一个视图可以有多个数据，所以一个watcher对应对个dep
         * 由于一个数据可能同事被几个视图引用所以对应多个watcher
         * 最终watcher与dep是多对多的关系
         */
      }, {
        key: "addDep",
        value: function addDep(dep) {
          var id = dep.id;
          // 对dep进行去重
          if (!this.depIds.has(id)) {
            this.deps.push(dep);
            this.depIds.add(id);
            dep.addSub(this); // 给dep添加watcher
          }
          // console.log(this.depIds, this.deps)
        }
      }, {
        key: "update",
        value: function update() {
          if (this.lazy) {
            this.dirty = true;
          } else {
            queueWatcher(this);
          }

          // this.get()
        }
      }, {
        key: "run",
        value: function run() {
          console.log(this);
          if (this.user) {
            this.cb(321);
          } else {
            this.get();
          }
        }
      }, {
        key: "evaluate",
        value: function evaluate() {
          // 会保留当前的计算属性值
          this.value = this.get();
          // dirty设为false，当连续调用computed时就无法触发evaluate方法
          this.dirty = false;
        }
      }, {
        key: "depend",
        value: function depend() {
          var i = this.deps.length;
          while (i--) {
            this.deps[i].depend();
          }
        }
      }]);
      return Watcher;
    }();

    function initlifeCycle(Vue) {
      Vue.prototype._update = function (vnode) {
        var vm = this;
        var el = vm.$el;
        vm.$el = patch(el, vnode);
        callHook(vm, 'mounted');
      }, Vue.prototype._render = function () {
        var vm = this;
        var vnode = vm.$options.render.call(vm);
        return vnode;
      }, Vue.prototype._c = function () {
        // 创建标签y
        return createElementVNode.apply(void 0, arguments);
      };
      Vue.prototype._s = function (value) {
        return value;
      };
      Vue.prototype._v = function () {
        return createTextVNode.apply(void 0, arguments);
      };
    }
    function mountComponent(vm, el) {
      callHook(vm, 'beforeMount');
      vm.$el = el;

      // vm._render()，将render函数变成虚拟dom
      // // vm_update将虚拟dom变成真实dom
      var undateComponent = function undateComponent() {
        vm._update(vm._render());
      };
      new Watcher(vm, function () {
        undateComponent();
      }, true);
    }
    function callHook(vm, hook) {
      var handlers = vm.$options[hook];
      if (handlers) {
        handlers.forEach(function (handler) {
          handler.call(vm);
        });
      }
    }

    // 重写数组中的部分方法
    var oldArrayProto = Array.prototype;
    var newArrayProto = Object.create(oldArrayProto);

    // 所有的编译方法，修改原数组组
    var methods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
    methods.forEach(function (method) {
      // 重写数组方法
      newArrayProto[method] = function () {
        var _oldArrayProto$method;
        var ob = this.__ob__;
        // 用于劫持数组增加的对象参数
        var insert;
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        switch (method) {
          case 'push':
          case 'unshift':
            insert = args;
            break;
          case 'splice':
            // arr.splice(1, 1, {a, 1}, {b: 2})
            insert = args.slice(2);
            break;
        }
        if (insert) {
          ob.observeArray(insert);
        }
        // 内部调用原来方法
        var result = (_oldArrayProto$method = oldArrayProto[method]).call.apply(_oldArrayProto$method, [this].concat(args));
        console.log(ob);
        ob.dep.notify();
        return result;
      };
    });

    var Observe = /*#__PURE__*/function () {
      function Observe(data) {
        _classCallCheck(this, Observe);
        this.dep = new Dep(); // 对整个对象和数组添加dep
        // _ob__不可枚举
        Object.defineProperty(data, '__ob__', {
          enumerable: false,
          value: this
        });
        // Object.defineProperty()只能劫持已经存在的数据
        if (Array.isArray(data)) {
          // 重写数组方法,这样有问题，保留数组方法重写某一些方法
          // data.__proto__ = {
          //   push () {
          //     debugger
          //   },
          // }
          // // 把类的方法添加到数组上observeArray
          // data.__ob__ = this
          // 重写数组
          data.__proto__ = newArrayProto;
          // 数组
          this.observeArray(data);
        } else {
          // 对象
          this.walk(data);
        }
      }
      _createClass(Observe, [{
        key: "walk",
        value: function walk(data) {
          // var keys = Object.keys(data);
          // for (var i = 0; i < keys.length; i++) {
          //   defineReactive(obj, keys[i], obj[keys[i]]);
          // }
          // console.log(this)
          Object.keys(data).forEach(function (key) {
            return defineReactive(data, key, data[key]);
          });
        }
      }, {
        key: "observeArray",
        value: function observeArray(data) {
          // [1, 2, {a: 1}]对数组中对象进行劫持
          data.forEach(function (item) {
            return observe(item);
          });
        }
      }]);
      return Observe;
    }();
    function observe(data) {
      // console.log(data)
      // 如果是原始值直接就返回值了
      if (_typeof(data) !== 'object' || data == null) {
        return;
      }
      // //判断用户是否已经观测
      if (data.__ob__ instanceof Observe) {
        return data.__ob__;
      }
      // console.log(this)
      return new Observe(data);
    }
    function defineReactive(data, key, value) {
      // console.log(value)
      var childOb = observe(value); //  
      var dep = new Dep();
      Object.defineProperty(data, key, {
        get: function get() {
          if (Dep.target) {
            dep.depend(); // 收集依赖属性
            if (childOb) {
              childOb.dep.depend(); // 数组和对象本身也实现依赖收集
            }
          }

          return value;
        },
        set: function set(newValue) {
          if (newValue === value) return;
          value = newValue;
          dep.notify(); // 更新视图
        }
      });
    }

    function noop() {}
    function initComputed(vm, computed) {
      var watchers = vm._computedWatchers = Object.create(null);
      for (var key in computed) {
        computed[key].set || noop;
        var getter = computed[key].get || noop;
        watchers[key] = new Watcher(vm, getter, {
          lazy: true
        });
        defineComputed(vm, key, getter);
      }
    }
    function defineComputed(vm, key, getter) {
      getter = createComputedGetter(key);
      Object.defineProperty(vm, key, {
        get: getter
      });
    }
    function createComputedGetter(key) {
      return function computedGetter() {
        var watcher = this._computedWatchers && this._computedWatchers[key];
        // 最开始dirty为true
        if (watcher) {
          // 执行evaluate，调用this.get刷新页面
          if (watcher.dirty) {
            watcher.evaluate();
          }
          if (Dep.target) {
            watcher.depend();
          }
          return watcher.value;
        }
      };
    }

    function initWatch(vm, watch) {
      for (var key in watch) {
        var handler = watch[key];
        createWatcher(vm, key, handler);
      }
    }
    function createWatcher(vm, expOrFn, handler, options) {
      if (Object.prototype.toString.call(handler) === '[object Object]') {
        options = handler;
        handler = handler.handler;
      }
      // if (typeof handler === 'string') {
      //   handler = vm[handler];
      // }
      return vm.$watch(expOrFn, handler, options);
    }
    function watch(expOrFn, cb, options) {
      var vm = this;
      options = options || {};
      options.user = true;
      var watcher = new Watcher(vm, expOrFn, options, cb);
      return function () {
        watcher.teardown();
      };
    }

    function initState(vm) {
      var opts = vm.$options;
      if (opts.data) {
        initData(vm);
      }
      if (opts.computed) {
        initComputed(vm, opts.computed);
      }
      if (opts.watch) {
        initWatch(vm, opts.watch);
      }
    }
    // 数据代理
    function proxy(vm, key, data) {
      Object.defineProperty(vm, key, {
        get: function get() {
          return vm[data][key];
        },
        set: function set(newValue) {
          if (newValue === vm[data][key]) return;
          vm[data][key] = newValue;
        }
      });
    }
    function initData(vm) {
      var data = vm.$options.data;
      data = typeof data === 'function' ? data.call(this) : data;
      // 将data放在_data上
      vm._data = data;
      // 数据劫持
      observe(data);
      // 数据代理，将_data代理vm上
      for (var key in data) {
        proxy(vm, key, '_data');
      }
    }

    function initMixin(Vue) {
      Vue.prototype._init = function (options) {
        var vm = this;
        // 合并参数
        vm.$options = mergeOptions(this.constructor.options, options);
        // 状态初始化之前钩子
        callHook(vm, 'beforeCreated');
        initState(vm);
        // 已经初始化状态了
        callHook(vm, 'created');
        if (options.el) {
          vm.$mount(options.el);
        }
      };
      Vue.prototype.$mount = function (el) {
        var vm = this,
          opts = vm.$options,
          template;
        el = document.querySelector(el);
        if (!opts.render) {
          if (!opts.template && el) {
            template = el.outerHTML;
          } else {
            template = opts.template;
          }
        } else {
          template = opts.render;
        }
        if (template) {
          var render = compileToFunction(template);
          opts.render = render;
        }
        mountComponent(vm, el); // 组件挂载
      };
    }

    function initUtils(Vue) {
      Vue.prototype.$nextTick = nextTick;
      Vue.prototype.$watch = watch;
    }

    function Vue(options) {
      // 2.初始化选项，执行_init函数
      this._init(options);
    }
    initMixin(Vue);
    initlifeCycle(Vue);
    initUtils(Vue);
    initGlobalAPI(Vue);

    return Vue;

}));
//# sourceMappingURL=vue.js.map
