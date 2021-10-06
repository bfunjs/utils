const { mapper } = require('../../dist');
const { string2Seconds } = mapper;

test('d7转换后的值应为604800000', () => {
    expect(
        string2Seconds('d7')
    ).toBe(604800000);
});
