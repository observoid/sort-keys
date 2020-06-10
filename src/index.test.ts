
import { TestHarness } from 'zora';
import { sortKeyCompare, SortKey } from '../lib/index';

export default (t: TestHarness) => {

  t.test('invalid keys', async t => {
    t.throws(() => sortKeyCompare(true as any, false as any), 'booleans are invalid');
    t.throws(() => sortKeyCompare({} as any, {} as any), 'plain objects are invalid');
  });

  t.test('type order', async t => {

    const date1 = new Date(1);
    const oneByte = new Uint8Array([1]);

    t.is(sortKeyCompare(1, date1), -1,       "number < date");
    t.is(sortKeyCompare(1, '1'), -1,         "number < string");
    t.is(sortKeyCompare(1, oneByte), -1,     "number < binary");
    t.is(sortKeyCompare(1, [1]), -1,         "number < array");

    t.is(sortKeyCompare(date1, 1), 1,        "date > number");
    t.is(sortKeyCompare(date1, '1'), -1,     "date < string");
    t.is(sortKeyCompare(date1, oneByte), -1, "date < binary");
    t.is(sortKeyCompare(date1, [1]), -1,     "date < array");

    t.is(sortKeyCompare('1', 1), 1,        "string > number");
    t.is(sortKeyCompare('1', date1), 1,    "string > date");
    t.is(sortKeyCompare('1', oneByte), -1, "string < binary");
    t.is(sortKeyCompare('1', [1]), -1,     "string < array");

    t.is(sortKeyCompare(oneByte, 1), 1,     "binary > number");
    t.is(sortKeyCompare(oneByte, date1), 1, "binary > date");
    t.is(sortKeyCompare(oneByte, '1'), 1,   "binary > string");
    t.is(sortKeyCompare(oneByte, [1]), -1,  "binary < array");

    t.is(sortKeyCompare([1], 1), 1,       "array > number");
    t.is(sortKeyCompare([1], date1), 1,   "array > date");
    t.is(sortKeyCompare([1], '1'), 1,     "array > string");
    t.is(sortKeyCompare([1], oneByte), 1, "array > array");

  });

  t.test('number order', t => {
    t.is(sortKeyCompare(10, 20), -1, "10 < 20");
    t.is(sortKeyCompare(10, 5),   1, "10 > 5");
    t.is(sortKeyCompare(10, 10),  0, "10 = 10");
  });

  t.test('date order', t => {
    t.is(sortKeyCompare(new Date('1996'), new Date('2003')), -1, "1996 < 2003");
    t.is(sortKeyCompare(new Date('1996'), new Date('1985')),  1, "1996 ? 1985");
    t.is(sortKeyCompare(new Date('1996'), new Date('1996')),  0, "1996 = 1996");
  });

  t.test('string order', t => {
    t.is(sortKeyCompare('P', 'Z'),  -1, "'P' < 'Z'");
    t.is(sortKeyCompare('P', 'A'),   1, "'P' > 'A'");
    t.is(sortKeyCompare('P', 'P'),   0, "'P' = 'P'");
    t.is(sortKeyCompare('P', 'PP'), -1, "'P' < 'PP'");
    t.is(sortKeyCompare('P', ''),    1, "'P' > ''");
  });

  t.test('binary order', t => {
    const b36 = new Uint8Array([36]);
    const b58 = new Uint8Array([58]);
    const b11 = new Uint8Array([11]);
    const b36_x2= new Uint8Array([36, 36]);
    const b_empty = new Uint8Array([]);

    t.is(sortKeyCompare(b36, b58), -1, 'b[36] < b[58]');
    t.is(sortKeyCompare(b36, b11),  1, 'b[36] > b[11]');
    t.is(sortKeyCompare(b36, b36_x2), -1, 'b[36] < b[36, 36]');
    t.is(sortKeyCompare(b36, b_empty), 1, 'b[36] > b[]');

    const ab36 = b36.buffer;
    const ab58 = b58.buffer;
    const ab11 = b11.buffer;
    const ab36_x2 = b36_x2.buffer;
    const ab_empty = b_empty.buffer;
    t.is(sortKeyCompare(ab36, ab58), -1, 'ab[36] < ab[58]');
    t.is(sortKeyCompare(ab36, ab11),  1, 'ab[36] > ab[11]');
    t.is(sortKeyCompare(ab36, ab36_x2), -1, 'ab[36] < ab[36, 36]');
    t.is(sortKeyCompare(ab36, ab_empty), 1, 'ab[36] > ab[]');

    const dv36 = new DataView(ab36);
    const dv58 = new DataView(ab58);
    const dv11 = new DataView(ab11);
    const dv36_x2 = new DataView(ab36_x2);
    const dv_empty = new DataView(ab_empty);
    t.is(sortKeyCompare(dv36, dv58), -1, 'dv[36] < dv[58]');
    t.is(sortKeyCompare(dv36, dv11),  1, 'dv[36] > dv[11]');
    t.is(sortKeyCompare(dv36, dv36_x2), -1, 'dv[36] < dv[36, 36]');
    t.is(sortKeyCompare(dv36, dv_empty), 1, 'dv[36] > dv[]');
  });

  t.test('array order', t => {
    const a36 = [36];
    const a58 = [58];
    const a11 = [11];
    const a36_x2= [36, 36];
    const a_empty = new Array<SortKey>();
    t.is(sortKeyCompare(a36, a58), -1, '[36] < [58]');
    t.is(sortKeyCompare(a36, a11),  1, '[36] > [11]');
    t.is(sortKeyCompare(a36, a36_x2), -1, '[36] < [36, 36]');
    t.is(sortKeyCompare(a36, a_empty), 1, '[36] > []');
  });

}
