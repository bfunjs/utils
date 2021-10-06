import 'regenerator-runtime/runtime';

const { FileSystem } = require('../../dist');
const { File, FileType } = FileSystem;

test('测试文件是否存在', () => {
    const file1 = new File(`${__dirname}/empty.js`);
    expect(file1.exists()).toBe(false);

    const file2 = new File(`${__dirname}/index.js`);
    expect(file2.exists()).toBe(true);
});

test('测试获取文件信息', () => {
    const file = new File(`${__dirname}/error.js`);
    expect(file.getStats()).toBe(undefined);
});

test('测试创建目录', async () => {
    const file = new File(`${__dirname}/mkdir/test`);
    const result = await file.createIfNotExists();
    expect(result).toBe(true);
});

test('测试获取目录列表', async () => {
    const file = new File(__dirname);

    const result1 = await file.list();
    expect(result1.length).toBe(2);

    const result2 = await file.list(FileType.DIR);
    expect(result2.length).toBe(1);
});

test('测试遍历目录列表', async () => {
    const file = new File(__dirname);

    file.each('*', (file) => {
        console.log(file.path);
    });
});

test('测试删除目录', async () => {
    const file = new File(`${__dirname}/mkdir`);
    const result = await file.delete();
    expect(file.exists()).toBe(false);
});
