var a1 = { name: "a1", render: () => [b1, b2, b3] };
var b1 = { name: "b1", render: () => [c1] };
var b2 = { name: "b2", render: () => [c2] };
var b3 = { name: "b3", render: () => [] };
var c1 = { name: "c1", render: () => [d1] };
var c2 = { name: "c2", render: () => [] };
var d1 = { name: "d1", render: () => [d2] };
var d2 = { name: "d2", render: () => [] };

walk(a1);

function walk(instance) {
  if (!instance) return;
  console.log(instance.name);
  instance.render.map(walk);
}
