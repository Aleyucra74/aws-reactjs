import axios from 'axios';

const api = axios.create({
	baseURL: "http://javahireit-env.eba-5a2pah6y.us-east-1.elasticbeanstalk.com/"
})

export default api;
