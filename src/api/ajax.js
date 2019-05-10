/**
 * ajax请求函数的封装
 * 返回一个Promise对象（response.data）
 */
/**
 * 默认是GET请求，参数是data
 */
import axios from 'axios'

export default function ajax(url, data={}, type='GET'){
    return new Promise(function(resolve, reject){
        let promise;
        // GET请求需要封装data
        if(type === 'GET'){
            let dataStr = '';
            Object.keys(data).forEach(key => {
                dataStr += key + '=' + data[key] + '&'
            });
            if(dataStr !== ''){
                dataStr = dataStr.substring(0,dataStr.lastIndexOf('&'));
                url = url + '?' + dataStr;
            }
            promise = axios.get(url, data)
        }else{
            promise = axios.post(url, data);
        }

        promise.then(function(response){
            resolve(response.data);
        })
        .catch(function(error){
            reject(error);
        })
        
    });
}