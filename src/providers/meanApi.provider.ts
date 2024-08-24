import axios, { AxiosInstance } from "axios";

export class MeanApiProvider {
  private readonly axios: AxiosInstance;
  constructor(baseURL = "https://api.balmy.xyz") {
    this.axios = axios.create({ baseURL });
  }
}
