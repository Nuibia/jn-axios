import type {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import Axios from 'axios';
import { stringify } from 'qs';

/**
 * 接口返回数据格式
 */
export interface ResponseData<T = unknown> {
  /** 结果消息描述 */
  resultMsg?: string;
  /** 消息描述 */
  message?: string;
  /** 请求ID */
  requestId?: string;
  /** 状态码 */
  code: number;
  /** 响应数据 */
  data: T;
}

/**
 * 接口返回值
 */
export type ApiResponse<T = unknown> = AxiosResponse<ResponseData<T>> | false; 

/**
 * 异常情况的回调函数
 */
type ExceptionCallback = (msg: string, error: AxiosError | ApiResponse) => void;

export interface AxiosInitConfig {
  /**
   * 全局默认的请求头配置
   */
  headers?: Record<string, string>;

  /**
   * 接口请求成功业务正常返回的code
   * @default 200
   */
  successCode?: number | number[];

  /**
   * 接口异常的提示
   * @description axios详情拦截catch方法报错，请求报错，非业务报错的第一层捕获
   * @default '系统开小差了，请稍后重试'
   */
  exceptionMsg?: string;

  /**
   * 排除非200处理接口的异常code过滤处理
   * @description 处理返回非200的code的请求，不报错，接口仍能拿到接口请求信息（第二层捕获）
   */
  expectCodeList: number[];

  /**
   * 异常回调处理函数
   * @description 两次触发：
   * 1. axios的error事件
   * 2. axios的兜底-非successCode和expectCodeList的异常捕获，丢给业务代码做特殊action处理
   * 如401无权限，需要跳转到登录页面等
   */
  exceptionCallBack: ExceptionCallback;

  /**
   * 对请求头的额外限制
   */
  extraHeader?: Record<string, string>;
}

/**
 * 自定义Axios配置
 */
export type DiyAxiosConfig = AxiosRequestConfig;

/**
 * 业务异常响应
 */
export interface ExpectedResponse<T = unknown> {
  /** 期望的响应对象 */
  expectResponse?: ApiResponse<T>;
  /** 期望的axios状态码 */
  expectAxiosCode?: number;
  /** 期望的结果消息 */
  expectResultMsg?: string;
}

/** jnAxiosInit仅执行一次标志 */
let isInit = false;
/** 默认的successCode */
const DEFAULT_SUCCESS_CODE = 200;
/** 默认的异常提示 */
const DEFAULT_EXCEPTION_MSG = '系统开小差了，请稍后重试';
/** 请求配置对象 */
const DiyAxiosConfig = {} as Required<AxiosInitConfig>;

/**
 * 默认异常情况错误回调
 */
const DEFAULT_EXCEPTION_CALLBACK: ExceptionCallback = function (msg, error) {
  console.warn('jn-axios defaultExceptionCallBack', msg, error);
};

/**
 * 创建的axios实例
 */
export const axiosInstance = Axios.create();

/**
 * 初始化axios实例
 * @param config 初始化配置
 */
export function jnAxiosInit({
  headers = {},
  successCode = DEFAULT_SUCCESS_CODE,
  expectCodeList = [],
  exceptionCallBack = DEFAULT_EXCEPTION_CALLBACK,
  exceptionMsg = DEFAULT_EXCEPTION_MSG,
  extraHeader = {},
}: AxiosInitConfig) {
  DiyAxiosConfig.exceptionCallBack = exceptionCallBack;
  DiyAxiosConfig.expectCodeList = expectCodeList;
  DiyAxiosConfig.successCode = successCode;
  DiyAxiosConfig.headers = headers;
  DiyAxiosConfig.exceptionMsg = exceptionMsg;
  DiyAxiosConfig.extraHeader = extraHeader;

  if (isInit) {
    return;
  }

  // 请求拦截
  axiosInstance.interceptors.request.use(config => {
    return {
      ...config,
      headers: { ...config.headers, ...headers },
    } as InternalAxiosRequestConfig;
  });

  // 响应拦截
  axiosInstance.interceptors.response.use(
    res => {
      // 2xx范围内的状态码都会触发该函数
      return res;
    },
    error => {
      // 超出2xx范围的请求状态码都会触发该函数
      // 这里触发第三层捕获，如登录失效之类的，通过exceptionCallBack由使用方控制
      console.error('jn-axios requestError', error);
      DiyAxiosConfig.exceptionCallBack.bind(DiyAxiosConfig)(DiyAxiosConfig.exceptionMsg, error);
      return false;
    },
  );
  isInit = true;
}

/**
 * 统一处理、拼装返回值
 * @param res API响应结果
 * @returns 处理后的数据或false
 */
function handleDiyAxiosResult<T>(res: ApiResponse<T>): T | (T & ExpectedResponse<T>) | false {
  const successCode = DiyAxiosConfig.successCode;
  if (!res) {
    return false;
  }
  // 防止res.data为异常的情况
  if (!res.data) {
    return false;
  }
  const code = res.data.code;
  
  // 业务正常返回
  if (
    (typeof successCode === 'number' && successCode === code) ||
    (Array.isArray(successCode) && successCode.includes(res.data.code))
  ) {
    return res.data.data;
  }
  
  // 业务异常返回--一般是业务报错
  if (DiyAxiosConfig.expectCodeList.includes(res.data.code)) {
    return {
      ...res.data.data,
      expectResponse: res,
      expectResultMsg: res.data.resultMsg,
      expectAxiosCode: res.data.code,
    } as T & ExpectedResponse<T>;
  }
  
  // 第三层漏斗--异常情况回调，可通过init方法在业务代码自定义action
  DiyAxiosConfig.exceptionCallBack.bind(DiyAxiosConfig)(
    res.data.resultMsg ?? res.data.message ?? '',
    res,
  );
  return false;
}

/**
 * GET请求
 * @param url 请求地址
 * @param data 请求参数
 * @param config 请求配置
 * @returns 处理后的响应数据
 */
export async function jnAxiosGet<T, P = Record<string, unknown>>(url: string, data?: P, config?: DiyAxiosConfig) {
  const res = await axiosInstance.get(url, {
    params: data,
    ...config,
  });
  const outRes: T | (T & ExpectedResponse<T>) | false = handleDiyAxiosResult(res);
  return outRes;
}

/**
 * POST请求
 * @param url 请求地址
 * @param data 请求数据
 * @param config 请求配置
 * @returns 处理后的响应数据
 */
export async function jnAxiosPost<T, P = unknown>(url: string, data: P, config?: DiyAxiosConfig) {
  const res = await axiosInstance.post<ResponseData<T>>(url, data, config);
  const outRes: T | (T & ExpectedResponse<T>) | false = handleDiyAxiosResult(res);
  return outRes;
}

/**
 * DELETE请求
 * @param url 请求地址
 * @param data 请求参数
 * @param config 请求配置
 * @returns 处理后的响应数据
 */
export async function jnAxiosDelete<T, P = Record<string, unknown>>(url: string, data: P, config?: DiyAxiosConfig) {
  const res = await axiosInstance.delete<ResponseData<T>>(url, {
    params: data,
    ...config,
  });
  const outRes: T | (T & ExpectedResponse<T>) | false = handleDiyAxiosResult(res);
  return outRes;
}

/**
 * PUT请求
 * @param url 请求地址
 * @param data 请求数据
 * @param config 请求配置
 * @returns 处理后的响应数据
 */
export async function jnAxiosPut<T, P = unknown>(url: string, data: P, config?: DiyAxiosConfig) {
  const res = await axiosInstance.put<ResponseData<T>>(url, data, config);
  const outRes: T | (T & ExpectedResponse<T>) | false = handleDiyAxiosResult(res);
  return outRes;
}

/**
 * 表单提交请求（FormData格式）
 * @param url 请求地址
 * @param data 表单数据
 * @param config 请求配置
 * @returns 处理后的响应数据
 */
export async function jnAxiosForm<T, P extends Record<string, string | Blob>>(
  url: string,
  data: P,
  config?: DiyAxiosConfig,
) {
  const fd = new FormData();
  const keys = Object.keys(data);
  for (const key of keys) {
    fd.append(key, data[key]);
  }
  const res = await axiosInstance.post<ResponseData<T>>(url, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
    ...config,
  });
  const outRes: T | (T & ExpectedResponse<T>) | false = handleDiyAxiosResult(res);
  return outRes;
}

/**
 * 表单提交请求（URL编码格式）
 * @param url 请求地址
 * @param data 表单数据
 * @param config 请求配置
 * @returns 处理后的响应数据
 */
export async function jnAxiosFormUrlencoded<T, P = Record<string, unknown>>(
  url: string,
  data: P,
  config?: DiyAxiosConfig,
) {
  const options = {
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    ...config,
  };
  const res = await axiosInstance.post<ResponseData<T>>(url, stringify(data), options);
  const outRes: T | (T & ExpectedResponse<T>) | false = handleDiyAxiosResult(res);
  return outRes;
}
