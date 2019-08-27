class Stack {
  constructor() {
    this.itmes = [];
  }
  push = item => this.itmes.push(item);
  pop = () => this.itmes.pop();
  size = () => this.itmes.length;
  isEmpty = () => this.itmes.length === 0;
  clear = () => (this.itmes = []);
}

let stack = new Stack();
stack.push(1);
console.log(stack.itmes);
console.log(stack.size());
