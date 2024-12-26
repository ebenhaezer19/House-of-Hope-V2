import api from '../api/axios';

export const residentService = {
  getAll: () => api.get('/api/residents'),
  getById: (id) => api.get(`/api/residents/${id}`),
  create: async (data) => {
    try {
      // Validasi data wajib
      if (!data.name || !data.nik || !data.birthPlace || !data.roomId) {
        throw new Error('Mohon lengkapi data wajib');
      }

      // Format data sesuai dengan yang diharapkan backend
      const formattedData = {
        name: String(data.name).trim(),
        nik: String(data.nik).trim(),
        birthPlace: String(data.birthPlace).trim(),
        birthDate: data.birthDate ? new Date(data.birthDate).toISOString().split('T')[0] : null,
        gender: data.gender || 'MALE',
        address: String(data.address || '').trim(),
        phone: data.phone ? String(data.phone).trim() : null,
        education: data.education || 'SMA',
        schoolName: String(data.schoolName || '').trim(),
        grade: data.grade ? String(data.grade).trim() : null,
        major: data.major ? String(data.major).trim() : null,
        assistance: data.assistance || 'YAYASAN',
        details: data.details ? String(data.details).trim() : null,
        roomId: Number(data.roomId),
        status: data.status || 'NEW',
        exitDate: null,
        alumniNotes: null
      };

      // Log data sebelum dikirim
      console.log('=== CREATE REQUEST DEBUG ===');
      console.log('Raw data:', data);
      console.log('Formatted data:', formattedData);

      // Kirim data dalam format yang diharapkan backend
      const formData = new FormData();
      formData.append('data', JSON.stringify(formattedData));

      // Kirim data menggunakan FormData
      const response = await api.post('/api/residents', formData);
      console.log('=== CREATE RESPONSE SUCCESS ===');
      console.log('Response:', response.data);
      return response;
    } catch (error) {
      console.error('=== CREATE ERROR DEBUG ===');
      console.error('Error:', error.message);
      console.error('Raw data:', data);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        console.error('Response headers:', error.response.headers);
      }
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      // Validasi data wajib
      if (!data.name || !data.nik || !data.birthPlace || !data.roomId) {
        throw new Error('Mohon lengkapi data wajib');
      }

      // Format data sesuai dengan yang diharapkan backend
      const formattedData = {
        name: String(data.name).trim(),
        nik: String(data.nik).trim(),
        birthPlace: String(data.birthPlace).trim(),
        birthDate: data.birthDate ? new Date(data.birthDate).toISOString().split('T')[0] : null,
        gender: data.gender || 'MALE',
        address: data.address ? String(data.address).trim() : '',
        phone: data.phone ? String(data.phone).trim() : '',
        education: data.education || 'SMA',
        schoolName: data.schoolName ? String(data.schoolName).trim() : '',
        grade: data.grade ? String(data.grade).trim() : '',
        major: data.major ? String(data.major).trim() : '',
        assistance: data.assistance || 'YAYASAN',
        details: data.details ? String(data.details).trim() : '',
        roomId: Number(data.roomId),
        status: data.status || 'NEW'
      };

      // Kirim data dalam format yang diharapkan backend
      const formData = new FormData();
      formData.append('data', JSON.stringify(formattedData));

      // Log data sebelum dikirim
      console.log('=== UPDATE REQUEST DEBUG ===');
      console.log('ID:', id);
      console.log('Formatted data:', formattedData);

      // Kirim data menggunakan FormData
      const response = await api.put(`/api/residents/${id}`, formData);
      return response;
    } catch (error) {
      console.error('=== UPDATE ERROR DEBUG ===');
      console.error('Error:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
      throw error;
    }
  },
  delete: async (id) => {
    try {
      console.log('=== DELETE REQUEST DEBUG ===');
      console.log('Deleting resident with ID:', id);
      
      const response = await api.delete(`/api/residents/${id}`);
      
      console.log('Delete response:', response.data);
      return response.data;
      
    } catch (error) {
      console.log('=== DELETE ERROR DEBUG ===');
      console.error(error);
      console.log('Response status:', error.response?.status);
      console.log('Response data:', error.response?.data);
      throw error;
    }
  },
  getRooms: () => api.get('/api/rooms'),
  uploadDocuments: async (id, formData, type) => {
    try {
      // Log data sebelum dikirim
      console.log('=== UPLOAD REQUEST DEBUG ===');
      console.log('FormData contents:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ':', pair[1]);
      }

      // Gunakan endpoint yang sesuai
      const endpoint = `/api/residents/${id}/${type}`;

      // Pastikan Content-Type adalah multipart/form-data
      const response = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('=== UPLOAD RESPONSE DEBUG ===');
      console.log('Response:', response.data);

      return response;
    } catch (error) {
      console.error('Upload documents error:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  }
}; 