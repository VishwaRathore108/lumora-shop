import api from './apiClient';

export async function getProfile() {
  const res = await api.get('/user/profile');
  return res.data;
}

export async function updateProfile(payload) {
  const res = await api.put('/user/profile', payload);
  return res.data;
}

export async function getProfileCompletion() {
  const res = await api.get('/user/profile-completion');
  return res.data;
}

/**
 * Upload profile photo: uses common media API (folder=profile) then updates user profile.
 * Returns same shape as before: { success, user, profileCompletion }.
 */
export async function uploadProfilePhoto(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', 'profile');
  const uploadRes = await api.post('/uploads/media', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  const url = uploadRes.data?.url ?? uploadRes.data?.urls?.[0];
  if (!url) throw new Error('Upload did not return a URL.');
  const updateRes = await api.put('/user/profile', { profileImage: url });
  return updateRes.data;
}

/**
 * Common media upload for the whole project (images/videos, single or multiple).
 * @param {File|File[]} fileOrFiles - Single file or array of files
 * @param {string} folder - Cloudinary folder (e.g. 'profile', 'products', 'products/hydrating-serum', 'categories', 'banners', 'reviews', 'brands')
 * @returns {Promise<{ success: boolean, url?: string, urls: string[], results?: Array<{ url, publicId, resourceType }> }>}
 */
export async function uploadMedia(fileOrFiles, folder) {
  const formData = new FormData();
  formData.append('folder', folder);
  const files = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];
  if (files.length === 1) {
    formData.append('file', files[0]);
  } else {
    files.forEach((f) => formData.append('files', f));
  }
  const res = await api.post('/uploads/media', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

