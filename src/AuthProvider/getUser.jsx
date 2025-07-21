import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchUser = async () => {
  const token = localStorage.getItem('token'); // অথবা আপনি context থেকেও নিতে পারেন
  if (!token) throw new Error('No token found');

  const res = await axios.get('https://servies-pro-server.onrender.com/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const useGetUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    retry: false, // optionally disable retry on failure
  });
};
