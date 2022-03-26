const axios = require('axios');
const apiData = require('../data/api.json');

let API_URL = apiData.appScriptUrl;

const serialize = function (obj) {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
};

const createUrlWithParams = function (params) {
  const queryString = serialize({
    ...params,
    path: '/addrlist'
  });
  return `${API_URL}?${queryString}`;
};

export const setApiUrl = function (url) {
  API_URL = url;
};

export const getList = (offset = 0, limit = 25) => {
  return axios.get(createUrlWithParams({ offset, limit, method: "GET" }));
};

export const createItem = (item) => {
  return axios.get(createUrlWithParams({
    ...item,
    method: 'POST'
  }));
};

export const deleteItem = (itemId) => {
  return axios.get(createUrlWithParams({
    id: itemId,
    method: 'DELETE'
  }));
};

export const updateItem = (id, ...restProps) => {
  return axios.get(createUrlWithParams({
    id,
    ...restProps,
    method: 'PUT'
  }));
};
