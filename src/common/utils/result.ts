// 规范化响应格式

export const SUCCESS_CODE = 1;

/**
 * 响应结构
 * ok 成功 1
 * fail 失败 0
 */
export class ResultData {
    constructor(code = SUCCESS_CODE, msg?: string, data?: any) {
        this.code = code;
        this.msg = msg || '操作成功';
        this.data = data || null;
    }

    code: number;
    msg?: string;
    data?: any;

    static ok(data?: any, msg?: string): ResultData {
        return new ResultData(SUCCESS_CODE, msg, data);
    }

    static fail(code: number, msg?: string, data?: any): ResultData {
        return new ResultData(code || 0, msg || 'fail', data);
    }
}