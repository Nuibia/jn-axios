import type {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import Axios from 'axios';
import { stringify } from 'qs';

/** 接口返回数据格式 */
export interface IDiyAxiosResponseData<T = any> {
  // 当前想当然，需要按照实际接口返回，再做修改
  resultMsg?: string;
  message?: string;
  requestId?: string;
  code: number;
  data: T;
}

/** 接口返回值 */
export type typeDiyAxiosResponse<T = any> = AxiosResponse<IDiyAxiosResponseData<T>> | false; // TODO:T=any ？？

/** 异常情况的回调函数 */
type typeExceptionCallBack = (msg: string, error: AxiosError | typeDiyAxiosResponse) => void;

export interface IDiyAxiosInitConfigInterface {
  /* 全局默认的请求头配置 */
  headers?: Record<string, string>; // 没啥好说的

  /* 接口请求成功业务正常返回的 code, 默认 200 */
  successCode?: number | number[]; // 没啥好说的

  /** 接口异常的提示，默认「哎呀，服务出错啦，请联系我们」 */
  exceptionMsg?: string; // axios详情拦截catch方法报错，请求报错，非业务报错 第一层捕获-请求报错捕获

  /* 排除非 200 处理接口的异常 code 过滤处理 */
  expectCodeList: number[]; // 处理返回非200的code的请求，不报错，接口仍能拿到接口请求信息 第二层捕获-捕获非200的状态码

  /* 接口 40x, 50x, code 非 200 和不在 expectCodeList 列表的回调处理。比如处理退出逻辑，目前默认 400 是退出。 */
  exceptionCallBack: typeExceptionCallBack; // 处理异常操作，排除200和expectCodeList的异常捕获，以回调的形式，使用者自己管理，如401无权限，需要跳转到登录页面

  /** 添加一些对header的额外限制 */
  extraHeader?: any;
}

export type IDiyAxiosConfig = AxiosRequestConfig;

export interface ExpectDiyAxiosResponse<T = any> {
  response?: typeDiyAxiosResponse<T>;
  expectAxiosCode?: number;
  resultMsg?: string | null;
}

/** jnAxiosInit 仅执行一次 */
let isInit = false;
/** 默认的 successCode */
const DEFAULT_SUCCESS_CODE = 200;
/** 默认的异常提示 */
const DEFAULT_EXCEPTION_MSG = '系统开小差了，请稍后重试';
/** 请求的配置 */
const DiyAxiosConfig = {} as Required<IDiyAxiosInitConfigInterface>; // 请求的props-项目初始化时，传递

/** 默认异常情况错误回调 */
const DEFAULT_EXCEPTION_CALLBACK: typeExceptionCallBack = function (msg, error) {
  console.warn('jn-axios defaultExceptionCallBack', msg, error);
};

export const axiosInstance = Axios.create();

export function jnAxiosInit({
  headers = {},
  successCode = DEFAULT_SUCCESS_CODE,
  expectCodeList = [],
  exceptionCallBack = DEFAULT_EXCEPTION_CALLBACK,
  exceptionMsg = DEFAULT_EXCEPTION_MSG,
  extraHeader = {},
}: IDiyAxiosInitConfigInterface) {
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
    // TODO:特殊处理，具体看业务
    // const { csrfTokenVague = [], csrfToken } = extraHeader;
    // config.headers.common.xClientAjaxStartTime = Date.now();
    // const { url } = config;

    // csrfTokenVague.forEach((item: string) => {
    //   const index = item.indexOf('*');
    //   if (url) {
    //     const str = url.substr(0, index);
    //     if (!item.split('*').includes(str)) {
    //       config.headers.csrfToken = localStorage.getItem('csrfToken');
    //     }
    //   }
    // });

    // if (url && csrfToken) {
    //   if (!csrfToken.includes(url)) {
    //     config.headers.csrfToken = localStorage.getItem('csrfToken');
    //   }
    // }
    return {
      ...config,
      headers: { ...config.headers, ...headers },
    } as InternalAxiosRequestConfig<any>;
  });

  // 响应拦截
  axiosInstance.interceptors.response.use(
    res => {
      // 2xx 范围内的状态码都会触发该函数。
      // console.log('response success', res);
      return res;
    },
    // 请求报错，非业务报错
    error => {
      // 超出 2xx 范围的请求状态码都会触发该函数，这里触发第三层捕获，如登录失效之类的，通过exceptionCallBack，在初始化时，使用的项目自己控制
      console.error('jn-axios requestError', error);
      DiyAxiosConfig.exceptionCallBack.bind(DiyAxiosConfig)(DiyAxiosConfig.exceptionMsg, error);
      return false;
    },
  );
  isInit = true;
}

function handleDiyAxiosResult<T>(res: typeDiyAxiosResponse<T>) {
  const successCode = DiyAxiosConfig.successCode;
  if (!res) {
    return false;
  }
  // 防止 res.data 为 异常的情况
  if (!res.data) {
    return false;
  }
  const code = res.data.code;
  if (
    (typeof successCode === 'number' && successCode === code) ||
    (Array.isArray(successCode) && successCode.includes(res.data.code))
  ) {
    return res.data.data;
  }
  if (DiyAxiosConfig.expectCodeList.includes(res.data.code)) {
    return {
      // 看业务需要
      ...res.data.data,
      response: res,
      resultMsg: res.data.resultMsg,
      expectAxiosCode: res.data.code,
    };
  }
  DiyAxiosConfig.exceptionCallBack.bind(DiyAxiosConfig)(
    // TODO:参考业务
    res.data.resultMsg ?? res.data.message ?? '',
    res,
  );
  return false;
}

/**
 *
 * @param url 请求url
 * @param data 请求参数
 * @param config 请求config
 * @returns
 */
export async function jnAxiosGet<T, P = any>(url: string, data?: P, config?: IDiyAxiosConfig) {
  const res = await axiosInstance.get(url, {
    params: data,
    ...config,
  });
  const outRes: (T & ExpectDiyAxiosResponse) | false = handleDiyAxiosResult(res);
  return outRes;
}

export async function jnAxiosPost<T, P = any>(url: string, data: P, config?: IDiyAxiosConfig) {
  const res = await axiosInstance.post<IDiyAxiosResponseData<T>>(url, data, config);
  const outRes: T | (T & ExpectDiyAxiosResponse<T>) | false = handleDiyAxiosResult(res);
  return outRes;
}

export async function jnAxiosDelete<T>(url: string, data: any, config?: IDiyAxiosConfig) {
  const res = await axiosInstance.delete<IDiyAxiosResponseData<T>>(url, {
    params: data,
    ...config,
  });
  const outRes: T | (T & ExpectDiyAxiosResponse) | false = handleDiyAxiosResult(res);
  return outRes;
}

export async function jnAxiosPut<T, P = any>(url: string, data: P, config?: IDiyAxiosConfig) {
  const res = await axiosInstance.put<IDiyAxiosResponseData<T>>(url, data, config);
  const outRes: T | (T & ExpectDiyAxiosResponse) | false = handleDiyAxiosResult(res);
  return outRes;
}

export async function jnAxiosForm<T, P extends Record<string, any>>(
  url: string,
  data: P,
  config?: IDiyAxiosConfig,
) {
  const fd = new FormData();
  const keys = Object.keys(data);
  for (const key of keys) {
    fd.append(key, data[key]);
  }
  const res = await axiosInstance.post<IDiyAxiosResponseData<T>>(url, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
    ...config,
  });
  const outRes: T | (T & ExpectDiyAxiosResponse) | false = handleDiyAxiosResult(res);
  return outRes;
}

export async function jnAxiosFormUrlencoded<T, P = any>(
  url: string,
  data: P,
  config?: IDiyAxiosConfig,
) {
  const options = {
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    ...config,
  };
  const res = await axiosInstance.post<IDiyAxiosResponseData<T>>(url, stringify(data), options);
  const outRes: T | (T & ExpectDiyAxiosResponse) | false = handleDiyAxiosResult(res);
  return outRes;
}
