import axios from 'axios'

const baseURL = 'http://192.168.0.107:5001/'

// const baseURL = 'https://apiroutekkmart.invtechnologies.in/'
//
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})


export const partyWiseVotingCount = () =>
  api.get('/party-wise-voting-count').then((response) => response.data)

export const castVote = (data: any) =>
  api.post('/cast_vote', data).then((response) => response.data)


export const getAllParties = () =>
  api.get('/get_all_parties').then((response) => response.data)


export const loginVoter = (data: { aadhar: string; phone_no: string }) =>
  api.post('/login_voter', data).then((response) => response.data)


export const getAllStates = () =>
  api.get('/get_all_states').then((response) => response.data)

export const createPoll = (data: FormData) =>
  axios
    .post(`${baseURL}create_party`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => response.data)

export const addProduct = (data: any) => api.post('/add_products', data)

export const getProductByBarcode = (barcode: string) =>
  api
    .get(`/get_product_barcode_details/${barcode}`)
    .then((response) => response.data)

export const updateProduct = (barcode: string, data: any) =>
  api.put(`/update_product/${barcode}`, data).then((response) => response.data)

export const checkOut = (data: any) =>
  api.post('/checkout', data).then((response) => response.data)

export const getAllProducts = () =>
  api.get('/get_all_products').then((response) => response.data)

export const deleteProduct = (barcode: string) =>
  api.delete(`/delete_product/${barcode}`).then((response) => response.data)

export const bulkUploadProducts = (data: any) =>
  api.post('/bulk_upload_products', data).then((response) => response.data)

export interface LoginRequest {
  username: string
  password: string
}

export interface User {
  userId: number
  username: string
  email: string
  role: string
}

export interface LoginResponse {
  token: string
  user: User
}

export const userLogin = (data: LoginRequest): Promise<LoginResponse> =>
  api.post('/login', data).then((response) => response.data)

// category
export const createCategory = (data: any) =>
  api.post('/create_category', data).then((response) => response.data)

export const getAllCategories = () =>
  api.get('/get_all_categories').then((response) => response.data)

export const updateCategory = (id: any, data: any) =>
  api.put(`/update_category/${id}`, data).then((response) => response.data)

export const deleteCategory = (id: any) =>
  api.delete(`/delete_category/${id}`).then((response) => response.data)

// brand
export const createBrand = (data: FormData) =>
  axios.post(`${baseURL}create_brand`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

export const getAllBrands = () =>
  api.get('/get_all_brands').then((response) => response.data)

export const updateBrand = (id: any, data: FormData) =>
  axios.put(`${baseURL}update_brand/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

export const deleteBrand = (id: any) =>
  api.delete(`/delete_brand/${id}`).then((response) => response.data)

export const getAllBrandNames = () =>
  api.get('/brand_names').then((response) => response.data)

// units
export const createUnit = (data: any) =>
  api.post('/create_unit', data).then((response) => response.data)

export const getAllUnits = () =>
  api.get('/get_all_units').then((response) => response.data)

export const updateUnit = (id: any, data: any) =>
  api.put(`/update_unit/${id}`, data).then((response) => response.data)

export const deleteUnit = (id: any) =>
  api.delete(`/delete_unit/${id}`).then((response) => response.data)
