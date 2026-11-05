import assert from 'node:assert/strict';
import { mixEditorialCoverage, isBifrostCoverage } from '../src/lib/editorial-order.ts';
const entry = (id, group) => ({ id, data: { title: id, coverageGroup: group, pubDate: '2026-11-05' } });
const make = (general, bifrost) => [
  ...Array.from({ length: bifrost }, (_, i) => entry(`b${i}`, 'bifrost')),
  ...Array.from({ length: general }, (_, i) => entry(`g${i}`, 'general-ai')),
];
assert.deepEqual(mixEditorialCoverage([]), []);
assert.deepEqual(mixEditorialCoverage(make(6, 3)).map(x => x.id), ['g0', 'g1', 'b0', 'g2', 'g3', 'b1', 'g4', 'g5', 'b2']);
assert.deepEqual(mixEditorialCoverage(make(2, 6)).map(x => x.id), ['g0', 'b0', 'b1', 'b2', 'g1', 'b3', 'b4', 'b5']);
assert.equal(isBifrostCoverage({data: {title: 'Understanding Bifrost'}}), true);
assert.equal(isBifrostCoverage({data: {title: 'World models'}, body: 'A passing Bifrost reference.'}), false);
assert.equal(isBifrostCoverage({data: {title: 'World models', coverageGroup: 'general-ai'}, body: 'Bifrost '.repeat(9)}), false);
assert.equal(isBifrostCoverage({data: {title: 'Gateway architecture'}, body: 'Bifrost '.repeat(8)}), true);
for (let g = 0; g <= 25; g++) for (let b = 0; b <= 25; b++) {
  const input = make(g, b);
  const before = JSON.stringify(input);
  const output = mixEditorialCoverage(input);
  assert.equal(JSON.stringify(input), before, 'Ordering must not mutate dates or entries');
  assert.equal(output.length, input.length);
  assert.equal(new Set(output).size, input.length, 'Every entry occurs exactly once');
  for (const group of ['general-ai', 'bifrost']) assert.deepEqual(
    output.filter(x => x.data.coverageGroup === group), input.filter(x => x.data.coverageGroup === group),
    'Preserve recency inside each coverage group',
  );
  // Slicing after ordering must retain exactly one copy across page boundaries.
  const pages = [];
  for (let i = 0; i < output.length; i += 12) pages.push(output.slice(i, i + 12));
  assert.deepEqual(pages.flat(), output);
  let used = 0;
  output.forEach((item, i) => {
    if (item.data.coverageGroup === 'general-ai') used++;
    assert.ok(Math.abs(used - (i + 1) * g / output.length) < 1, 'Spread a scarce group throughout the index');
  });
}
console.log('Editorial ordering passed: 676 inventory mixes, stable pagination, dates and entry preservation.');
