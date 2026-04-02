import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

export const getMyProfile = async () => {
  const res = await axios.get(`${BASE_URL}/doctors/me`, authHeaders());
  return res.data;
};

export const getMyStats = async () => {
  const res = await axios.get(`${BASE_URL}/doctors/me/stats`, authHeaders());
  return res.data;
};

export const getMyAppointments = async () => {
  const res = await axios.get(`${BASE_URL}/doctors/me/appointments`, authHeaders());
  return res.data;
};

export const getMyPatients = async () => {
  const res = await axios.get(`${BASE_URL}/doctors/me/patients`, authHeaders());
  return res.data;
};

export const updateMyProfile = async (data) => {
  const res = await axios.put(`${BASE_URL}/doctors/me`, data, authHeaders());
  return res.data;
};

export const getAllDoctors = async () => {
  const res = await axios.get(`${BASE_URL}/doctors`, authHeaders());
  return res.data;
};
