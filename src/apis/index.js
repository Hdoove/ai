import Taro from '@tarojs/taro'
import {
  HTTP_STATUS
} from './status'
import {
  logError
} from './logError';
const base = 'http://101.200.191.21:3000/admin/api'
export default {
  baseOptions(params, method = 'GET') {
    let {
      query,
      url
    } = params;
    const option = {
      url,
      data: query,
      method: method,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      body: {
        query,
      },
      success(res) {
        if (res.statusCode === HTTP_STATUS.NOT_FOUND) {
          return logError('api', '请求资源不存在')
        } else if (res.statusCode === HTTP_STATUS.BAD_GATEWAY) {
          return logError('api', '服务端出现了问题')
        } else if (res.statusCode === HTTP_STATUS.FORBIDDEN) {
          return logError('api', '没有权限访问')
        } else if (res.statusCode === HTTP_STATUS.GATEWAY_TIMEOUT) {
          return logError('api', '连接超时')
        } else if (res.statusCode === HTTP_STATUS.SERVER_ERROR) {
          return logError('api', '500')
        } else if (res.statusCode === HTTP_STATUS.SUCCESS) {
          const {
            data
          } = res.data;
          return {
            code: 200,
            data
          }
        }
      },
      error(e) {
        logError('api', '请求接口出现问题', e)
      }
    }
    return Taro.request(option)
  },
  graphqlOptions(params, method = 'POST') {
    let {
      query
    } = params;
    const option = {
      url: base,
      data: {
        "operationName": null,
        "variables": {},
        "query": query
      },
      method: method,
      header: {
        'content-type': 'application/json;charset=UTF-8'
      },
      body: {
        query,
      },
      success(res) {
        if (res.statusCode === HTTP_STATUS.NOT_FOUND) {
          return logError('api', '请求资源不存在')
        } else if (res.statusCode === HTTP_STATUS.BAD_GATEWAY) {
          return logError('api', '服务端出现了问题')
        } else if (res.statusCode === HTTP_STATUS.FORBIDDEN) {
          return logError('api', '没有权限访问')
        } else if (res.statusCode === HTTP_STATUS.GATEWAY_TIMEOUT) {
          return logError('api', '连接超时')
        } else if (res.statusCode === HTTP_STATUS.SERVER_ERROR) {
          return logError('api', '500')
        } else if (res.statusCode === HTTP_STATUS.SUCCESS) {
          const {
            data
          } = res.data;
          return {
            code: 200,
            data
          }
        }
      },
      error(e) {
        logError('api', '请求接口出现问题', e)
      }
    }
    return Taro.request(option)
  },
  get({
    url,
    query
  }) {
    let option = {
      url,
      query
    }
    return this.baseOptions(option)
  },
  post: function ({
    url,
    data
  }) {
    let params = {
      url,
      query: data
    }
    return this.baseOptions(params, 'POST')
  },
  graphql: function ({
    url,
    data
  }) {
    let params = {
      url,
      query: data
    }
    return this.graphqlOptions(params)
  }
}