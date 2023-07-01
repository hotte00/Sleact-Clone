import axios, { AxiosResponse } from 'axios';

const fetcher = (url : string) => 
    axios
    .get(url, {withCredentials: true})
    .then((response: AxiosResponse<any>) => 
    response.data);

export default fetcher;