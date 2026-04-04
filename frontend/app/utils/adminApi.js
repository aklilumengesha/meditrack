import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const authHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

// Stats
export const getAdminStats = async () => (await axios.get(`${BASE_URL}/admin/stats`, authHeaders())).data;
export const getMonthlyStats = async () => (await axios.get(`${BASE_URL}/admin/stats/monthly`, authHeaders())).data;

// Users
export const getAllUsers = async () => (await axios.get(`${BASE_URL}/admin/users`, authHeaders())).data;
export const deleteUser = async (id) => (await axios.delete(`${BASE_URL}/admin/users/${id}`, authHeaders())).data;
export const toggleUserActive = async (id) => (await axios.patch(`${BASE_URL}/admin/users/${id}/toggle-active`, {}, authHeaders())).data;
export const changeUserRole = async (id, role) => (await axios.patch(`${BASE_URL}/admin/users/${id}/role`, { role }, authHeaders())).data;
export const resetUserPassword = async (id) => (await axios.patch(`${BASE_URL}/admin/users/${id}/reset-password`, {}, authHeaders())).data;

// Doctors
export const getAdminDoctors = async () => (await axios.get(`${BASE_URL}/admin/doctors`, authHeaders())).data;
export const createAdminDoctor = async (data) => (await axios.post(`${BASE_URL}/admin/doctors`, data, authHeaders())).data;
export const updateAdminDoctor = async (id, data) => (await axios.put(`${BASE_URL}/admin/doctors/${id}`, data, authHeaders())).data;
export const getDoctorAppointmentsAdmin = async (id) => (await axios.get(`${BASE_URL}/admin/doctors/${id}/appointments`, authHeaders())).data;

// Patients
export const getAdminPatients = async () => (await axios.get(`${BASE_URL}/admin/patients`, authHeaders())).data;
export const updateAdminPatient = async (id, data) => (await axios.put(`${BASE_URL}/admin/patients/${id}`, data, authHeaders())).data;
export const getPatientRecordsAdmin = async (id) => (await axios.get(`${BASE_URL}/admin/patients/${id}/records`, authHeaders())).data;

// Appointments
export const getAdminAppointments = async () => (await axios.get(`${BASE_URL}/admin/appointments`, authHeaders())).data;
export const createAdminAppointment = async (data) => (await axios.post(`${BASE_URL}/admin/appointments`, data, authHeaders())).data;
export const updateAdminAppointment = async (id, data) => (await axios.put(`${BASE_URL}/admin/appointments/${id}`, data, authHeaders())).data;
export const deleteAdminAppointment = async (id) => (await axios.delete(`${BASE_URL}/admin/appointments/${id}`, authHeaders())).data;

// Medical Records
export const getAllMedicalRecords = async () => (await axios.get(`${BASE_URL}/admin/medical-records`, authHeaders())).data;
export const deleteAdminMedicalRecord = async (id) => (await axios.delete(`${BASE_URL}/admin/medical-records/${id}`, authHeaders())).data;

// Settings
export const getSpecialties = async () => (await axios.get(`${BASE_URL}/admin/specialties`, authHeaders())).data;

// CSV Export helpers
export const exportToCSV = (data, filename) => {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const rows = data.map((row) => headers.map((h) => `"${String(row[h] ?? "").replace(/"/g, '""')}"`).join(","));
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `${filename}.csv`; a.click();
  URL.revokeObjectURL(url);
};
