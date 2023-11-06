// emitter.ts
import mitt from 'mitt';

// 定义所有的事件类型和相应的数据类型
type Events = {
  'MAAConnectionManagmentToolbar-addConnection': { message: string };
};

// 创建并导出 emitter 实例
const emitter = mitt<Events>();

export default emitter;
