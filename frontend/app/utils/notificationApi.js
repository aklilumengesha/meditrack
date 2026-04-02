import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

export const getNotifications = async () => {
  const res = await axios.get(`${BASE_URL}/notifications`, authHeaders());
  return res.data;
};

export const getUnreadCount = async () => {
  const res = await axios.get(`${BASE_URL}/notifications/unread-count`, authHeaders());
  return res.data;
};

export const markAllRead = async () => {
  const res = await axios.patch(`${BASE_URL}/notifications/read-all`, {}, authHeaders());
  return res.data;
};

export const markOneRead = async (id) => {
  const res = await axios.patch(`${BASE_URL}/notifications/${id}/read`, {}, authHeaders());
  return res.data;
};
