const { url } = require('../../dist');
const { toKvp, encodeUrl } = url;

test('测试 toKvp', () => {
    const params = { cat: 'miao', dog: 'wang' };
    const result = 'cat=miao&dog=wang';
    expect(toKvp(params)).toBe(result);
});

test('测试 encodeUrl', () => {
    const url = 'http://www.acg.fun/space';
    const params = { cat: 'miao', dog: 'wang' };
    const result = 'http://www.acg.fun/space?cat=miao&dog=wang';
    expect(encodeUrl(url, params)).toBe(result);
});
