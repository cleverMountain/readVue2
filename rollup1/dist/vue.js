(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

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

  var originMethods = Array.prototype;
  var arrayMethods = Object.create(originMethods); // originMethods最为对象原型
  // console.log(arrayMethods)
  var rewriteMethods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice']; // 会改变原数组的方法

  rewriteMethods.forEach(function (mehtod) {
    arrayMethods[mehtod] = function () {
      var _originMethods$mehtod;
      // 如果当前被改变的数组是对象，则需要对对象进行劫持
      var insert;
      for (var _len = arguments.length, argues = new Array(_len), _key = 0; _key < _len; _key++) {
        argues[_key] = arguments[_key];
      }
      switch (mehtod) {
        case 'push':
        case 'unshift':
          insert = argues;
          break;
        case 'splice':
          insert = argues.slice(2);
          break;
      }
      if (insert) {
        this.__ob__.observeArray(insert);
      }

      // 调用以前的方法
      var result = (_originMethods$mehtod = originMethods[mehtod]).call.apply(_originMethods$mehtod, [this].concat(argues));
      return result;
    };
  });

  var id$1 = 0;
  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);
      this.id = id$1++;
      this.subs = [];
    }
    _createClass(Dep, [{
      key: "depend",
      value: function depend() {
        if (Dep.target) {
          Dep.target.addDep(this);
        }
      }
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
  Dep.target = null;

  var Observe = /*#__PURE__*/function () {
    function Observe(value) {
      _classCallCheck(this, Observe);
      // 设置监听属性判断是否已经被劫持
      Object.defineProperty(value, '__ob__', {
        enumerable: false,
        value: this
      });
      if (Array.isArray(value)) {
        // 重写数组方法
        value.__proto__ = arrayMethods;
        // arrayMethods.observeArray = this.observeArray
        // 数组
        this.observeArray(value);
      } else {
        // 对象
        this.walk(value);
      }
    }
    _createClass(Observe, [{
      key: "walk",
      value: function walk(value) {
        Object.keys(value).forEach(function (item) {
          return defineReactive(value, item, value[item]);
        });
      }
    }, {
      key: "observeArray",
      value: function observeArray(value) {
        // value.forEach(item => observe(item))
        for (var i = 0; i < value.length; i++) {
          observe(value[i]);
        }
      }
    }]);
    return Observe;
  }();
  function observe(value) {
    // 如果是原始值直接就返回值了
    if (_typeof(value) !== 'object' || value == null) {
      return;
    }
    if (value.__Ob__ instanceof Observe) {
      return value.__Ob__;
    }
    new Observe(value);
  }
  function defineReactive(data, key, value) {
    observe(value);
    var dep = new Dep();
    Object.defineProperty(data, key, {
      get: function get() {
        // 每个dep里有许多watcher，watcher里面有更新视图的功能函数
        dep.depend();
        return value;
      },
      set: function set(newValue) {
        // 当数据改变时，通知改变
        dep.notify();
        value = newValue;
      }
    });
  }

  function initState(vm) {
    // console.log(vm)
    // debugger
    var opts = vm.$options;
    if (opts.data) {
      initData(vm);
    }
  }
  function initData(vm) {
    var data = vm.$options.data;
    // data是函数或者对象
    data = typeof data === 'function' ? data.call(vm) : data || {};
    // 将data挂在到vm上
    vm._data = data;
    // 对_data进行代理 vm. = vm._data.
    proxy(vm, "_data");
    // 监听
    observe(data);
  }
  function proxy(vm, prop) {
    var data = vm._data;
    var _loop = function _loop(key) {
      Object.defineProperty(vm, key, {
        get: function get() {
          return vm[prop][key];
        },
        set: function set(newVal) {
          if (vm[prop][key] === newVal) return;
          vm[prop][key] = newVal;
        }
      });
    };
    for (var key in data) {
      _loop(key);
    }
  }

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
    return root;
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

    // // 将字符串变成render函数,模板引擎with + new Function() {}
    var render = new Function("with(this){return ".concat(code, "}"));
    // // console.log(render)

    return render;
  }

  // 创建标签
  function createElementVNode(tag, props) {
    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }
    return vnode(tag, props, props.key, children);
  }
  // 创建文本
  function createText(text) {
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

  function patch(root, vonde) {
    var tag = vonde.tag;
      vonde.el;
      var props = vonde.props,
      children = vonde.children,
      text = vonde.text,
      key = vonde.key;
    var newEle = createDom(tag, props, children, text, key);
    // console.log(root.nextSibling.nextSibling, '1')
    // console.log(root.previousSibling , '2')
    // 该节点的下一个节点
    document.body.insertBefore(newEle, root.nextSibling);
    document.body.removeChild(root);
    return newEle;
  }
  function createDom(tag, props, children, text, key) {
    var contain;
    if (tag) {
      contain = document.createElement(tag);
    } else {
      contain = document.createTextNode(text);
    }
    if (key) {
      contain.setAttribute('key', key);
    }
    if (props) {
      for (var k in props) {
        if (k !== 'style') {
          contain.setAttribute(k, props[k]);
        } else {
          for (var p in props['style']) {
            var pName = p.trim();
            contain['style'][pName] = props['style'][p];
          }
        }
      }
    }
    if (children && children.length > 0) {
      children.forEach(function (child) {
        var tag = child.tag;
          child.el;
          var props = child.props,
          children = child.children,
          text = child.text,
          key = child.key;
        var childDom = createDom(tag, props, children, text, key);
        contain.appendChild(childDom);
      });
    }
    return contain;
  }

  var id = 0;
  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, fn, _boolean) {
      _classCallCheck(this, Watcher);
      this.id = id++;
      this.getter = fn;
      this.deps = [];
      this.depIds = new Set();
      this.get();
    }
    _createClass(Watcher, [{
      key: "get",
      value: function get() {
        Dep.target = this;
        this.getter();
        Dep.target = null;
      }
    }, {
      key: "addDep",
      value: function addDep(dep) {
        var id = dep.id;
        if (!this.depIds.has(id)) {
          this.depIds.add(id);
          this.deps.push(dep);
          dep.addSub(this);
        }
      }
    }, {
      key: "update",
      value: function update() {
        // console.log('update')
        // this.getter()
        handleQueue(this);
      }
    }, {
      key: "run",
      value: function run() {
        console.log('update');
        this.getter();
      }
    }]);
    return Watcher;
  }();
  var queue = [];
  var pending = false;
  var has = {};
  function fluseQueue() {
    var nowQueue = queue.slice(0);
    queue = [];
    pending = false;
    nowQueue.forEach(function (watcher) {
      return watcher.run();
    });
  }
  function handleQueue(watcher) {
    var id = watcher.id;
    if (!has[id]) {
      queue.push(watcher);
      has[id] = true;
      if (!pending) {
        setTimeout(fluseQueue);
        pending = true;
      }
    }
  }

  function initlifeCycle(Vue) {
    Vue.prototype._update = function (vnode) {
      var vm = this;
      var el = vm.$el;
      vm.$el = patch(el, vnode);
    }, Vue.prototype._render = function () {
      var vm = this;
      var vnode = vm.$options.render.call(vm);
      return vnode;
    }, Vue.prototype._c = function () {
      // 创建标签
      return createElementVNode.apply(void 0, arguments);
    };
    Vue.prototype._s = function (value) {
      return value;
    };
    Vue.prototype._v = function () {
      return createText.apply(void 0, arguments);
    };
  }
  function mountComponent(vm, el) {
    vm.$el = el;

    // vm._render()，将render函数变成虚拟dom
    // // vm_update将虚拟dom变成真实dom
    var updateComponent = function updateComponent() {
      vm._update(vm._render());
    };
    new Watcher(vm, updateComponent, true);
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      // 指向Vue构造函数
      var vm = this;
      vm.$options = options;
      initState(vm);
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
        // 转化成render函数
        var render = compileToFunction(template);
        opts.render = render;
        // vm.render =  mountComponent.bind(vm, vm, vm.$el)
      }

      mountComponent(vm, el); // 组件挂载
    };
  }

  function Vue(options) {
    // 调用原型上的方法，但是this指向的是构造函数Vue
    this._init(options);
  }
  initMixin(Vue);
  initlifeCycle(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
