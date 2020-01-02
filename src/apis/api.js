import api from "./index";

const get_data = (data) =>
  api.post({
    data: data
  }).then(res => res);

export default get_data;
