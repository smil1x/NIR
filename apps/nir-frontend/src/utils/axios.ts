import axios from "axios";

const BASE_URL = 'http://localhost:5000/api'

export const requestHistoryRout = async (shipId: any) => {
  return axios.get(`${BASE_URL}/${shipId}/history`)
    .then((res:any) =>{
    return  res.data
  })
}

export const requestDeviationFromRoute = async (route: any,
                                                normalDeviation: any,
                                                history: any) => {
  return axios.post(`${BASE_URL}/deviation`,
    {route, normalDeviation, history})
    .then((res:any) =>{
      return  res.data
    })
}

export const test = async (id: any) => {
  return axios.get(`${BASE_URL}/${id}/test`)
    .then((res:any) =>{
      return  res.data
    })
}