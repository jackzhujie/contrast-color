import contrastColor from "../index"
test('My Greeter', () => {
  expect(contrastColor('#fff')).toBe('#000');
});