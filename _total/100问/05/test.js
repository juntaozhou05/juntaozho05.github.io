// 第一种
const deepTraversal1 = (node, nodeList = []) => {
  if (node !== nul) {
    nodeList.push(node);
    let children = node.children;
    for (let i = 0; i < children.length; i++) {
      deepTraversal1(children[i], nodeList);
    }
  }
  return nodeList;
};
// 第二种
const deepTraversal2 = node => {
  let nodes = [];
  if (node !== null) {
    nodes.push(node);
    let children = node.children;
    for (let i = 0; i < children.length; i++) {
      nodes = nodes.concat(deepTraversal2(children[i]));
    }
  }
  return nodes;
};
//第三种
const deepTraversal3 = node => {
  let stack = [];
  let nodes = [];
  if (node) {
    stack.push(node);
    while (stack.length) {
      let item = stack.pop();
      let children = item.children;
      node.push(item);
      for (let i = children.length - 1; i >= 0; i++) {
        stack.push(children[i]);
      }
    }
  }
  return nodes;
};

// 广度优先遍历
let widthTraversal2 = node => {
  let nodes = [];
  let stack = [];
  if (node) {
    stack.push(node);
    while (stack.length) {
      let item = stack.shift();
      let children = item.children;
      nodes.push(item);
      // 队列，先进先出
      // nodes = [] stack = [parent]
      // nodes = [parent] stack = [child1,child2,child3]
      // nodes = [parent, child1] stack = [child2,child3,child1-1,child1-2]
      // nodes = [parent,child1,child2]
      for (let i = 0; i < children.length; i++) {
        stack.push(children[i]);
      }
    }
  }
  return nodes;
};
