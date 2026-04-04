import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

export const getPatientDashboard = async () => {
  const res = await axios.get(`${BASE_URL}/patient-portal/dashboard`, authHeaders());
  return res.data;
};

export const getPatientProfile = async () => {
  const res = await axios.get(`${BASE_URL}/patient-portal/profile`, authHeaders());
  return res.data;
};

export const updatePatientProfile = async (data) => {
  const res = await axios.put(`${BASE_URL}/patient-portal/profile`, data, authHeaders());
  return res.data;
};

export const getPatientAppointments = async () => {
  const res = await axios.get(`${BASE_URL}/patient-portal/appointments`, authHeaders());
  return res.data;
};

export const bookAppointment = async (data) => {
  const res = await axios.post(`${BASE_URL}/patient-portal/appointments`, data, authHeaders());
  return res.data;
};

export const cancelAppointment = async (id) => {
  const res = await axios.delete(`${BASE_URL}/patient-portal/appointments/${id}`, authHeaders());
  return res.data;
};

export const getPatientMedicalRecords = async () => {
  const res = await axios.get(`${BASE_URL}/patient-portal/medical-records`, authHeaders());
  return res.data;
};

export const rateDoctor = async (appointmentId, rating, comment) => {
  const res = await axios.post(
    `${BASE_URL}/ratings/appointments/${appointmentId}`,
    { rating, comment },
    authHeaders()
  );
  return res.data;
};

export const updateAppointmentStatus = async (id, status) => {
  const res = await axios.put(
    `${BASE_URL}/appointments/${id}/status`,
    { status },
    authHeaders()
  );
  return res.data;
};
