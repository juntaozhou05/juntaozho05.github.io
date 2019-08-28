class Queue {
  constructor() {
    this.items = [];
  }
  push(item) {
    return this.items.push(item);
  }
  shift() {
    return this.items.shift();
  }
  isEmpty() {
    return this.items.length === 0;
  }
  size() {
    return this.items.length;
  }
  clear() {
    this.items = [];
  }
}
// 最小优先队列
// 最小优先队列在生活中的例子: 比如普通用户上医院需要排队挂号, 但是具有 VIP 的用户能'插队'办理业务。用代码实现如下:
class PriorityQueue extends Queue {
  push(item, level) {
    if (this.isEmpty()) {
      this.items.push({ item, level });
    } else {
      let add = true;
      for (let i = 0; i < this.size(); i++) {
        if (level < this.items[i].level) {
          add = false;
          this.items.splice(i, 0, { item, level });
          return;
        }
      }
      add && this.items.push({ item, level });
    }
  }
  print() {
    for (let obj of this.items) {
      console.log(obj.item);
    }
  }
}

const queue = new PriorityQueue();
queue.push("张三", 2);
queue.push("李四", 1);
queue.push("王五", 1);
queue.print();

// 循环队列
// 循环队列以击鼓传花为例, 代码实现如下:

const drumGame = (names, number) => {
  const queue = new Queue();
  for (let i = 0; i < names.length; i++) {
    queue.push(names[i]);
  }

  while (queue.size() > 1) {
    for (let i = 0; i < number; i++) {
      queue.push(queue.shift()); // 这句是循环队列的核心
    }
    const loser = queue.shift();
    console.log(`${loser}出局`);
  }
  return queue.shift();
};

const names = ["John", "Jack", "Camila", "Ingrid", "Carl"];
const winner = drumGame(names, 7); // 假设每轮传花 7 次
console.log("胜利者是: " + winner);
