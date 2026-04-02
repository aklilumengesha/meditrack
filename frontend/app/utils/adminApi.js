import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

export const getAdminStats = async () => {
  const res = await axios.get(`${BASE_URL}/admin/stats`, authHeaders());
  return res.data;
};

export const getAllUsers = async () => {
  const res = await axios.get(`${BASE_URL}/admin/users`, authHeaders());
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await axios.delete(`${BASE_URL}/admin/users/${id}`, authHeaders());
  return res.data;
};

export const getAdminDoctors = async () => {
  const res = await axios.get(`${BASE_URL}/admin/doctors`, authHeaders());
  return res.data;
};

export const getAdminPatients = async () => {
  const res = await axios.get(`${BASE_URL}/admin/patients`, authHeaders());
  return res.data;
};

export const getAdminAppointments = async () => {
  const res = await axios.get(`${BASE_URL}/admin/appointments`, authHeaders());
  return res.data;
};

export const deleteAdminAppointment = async (id) => {
  const res = await axios.delete(`${BASE_URL}/admin/appointments/${id}`, authHeaders());
  return res.data;
};
