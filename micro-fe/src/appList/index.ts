import { IAppInfo } from "src/types";

let appList: IAppInfo[] = [];

export const setAppList = (list: IAppInfo[]) => {
    appList = list;
  };
  
  export const getAppList = () => {
    return appList;
  };