var uid = 0;


function Dep() {
  this.id = uid++;
  // 存放watcher
  this.subs = [];
};

// 将watcher添加到subs中,更新视图使用
// 一个dep对应对个watcher
Dep.prototype.addSub = function addSub(sub) {
  this.subs.push(sub);
};


Dep.prototype.removeSub = function removeSub(sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend() {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify() {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  // if (!config.async) {
  //   // subs aren't sorted in scheduler if not running async
  //   // we need to sort them now to make sure they fire in correct
  //   // order
  //   subs.sort(function (a, b) { return a.id - b.id; });
  // }
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};


Dep.target = null;
var targetStack = [];

function pushTarget(target) {
  targetStack.push(target);
  Dep.target = target;
}

function popTarget() {
  targetStack.pop();
  Dep.target = targetStack[targetStack.length - 1];
}

export {
  Dep,
  pushTarget,
  popTarget
}