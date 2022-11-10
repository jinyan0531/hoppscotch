import axios, { AxiosRequestConfig } from "axios"
import { getCookie } from "~/helpers/curl/sub_helpers/cookies"
//import {AjaxResponse} from "rxjs/internal/ajax/AjaxResponse";
//import { settingsStore,getSettingSubject } from "~/newstore/settings"

//全局配置
axios.defaults.baseURL = ""
axios.defaults.timeout = 5000
axios.defaults.withCredentials = true

export function request(config: AxiosRequestConfig, isauth: boolean) {
  if (isauth) {
    config = buildConfig(config)
  }
  config.method = "GET"
  const instace = interceptor()
  return instace(config)
}

export function post(config: AxiosRequestConfig, isauth: boolean) {
  if (isauth) {
    config = buildConfig(config)
  }
  config.method = "POST"
  const instace = interceptor()
  return instace(config)
}

function buildConfig(config: AxiosRequestConfig) {
  const token = getCookie("jwt_sso_token")
  console.info(token)
  if (!config.headers) {
    config.headers = {}
  }
  config.headers["jwt_sso_token"] = token
  return config
}

function interceptor() {
  const instace = axios.create({})
  //请求拦截
  instace.interceptors.request.use(
    (config) => {
      //getSettingSubject(keyse)
      return config
    },
    (err) => {
      console.error(err)
    }
  )
  //响应拦截
  instace.interceptors.response.use(
    (res) => {
      return res.data
    },
    (err) => {
      console.error(err)
      //错误处理
    }
  )
  return instace
}
