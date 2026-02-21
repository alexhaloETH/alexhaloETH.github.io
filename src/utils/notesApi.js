import { apiRequest, withErrorContext } from './apiClient';

export const getAllNotes = async () => withErrorContext('Error fetching notes', () => (
  apiRequest('/notes')
));

export const getNote = async (id) => withErrorContext(`Error fetching note ${id}`, () => (
  apiRequest(`/notes/${id}`)
));

export const createNote = async (note) => withErrorContext('Error creating note', () => (
  apiRequest('/notes', {
    method: 'POST',
    body: note,
  })
));

export const updateNote = async (id, updatedNote) => withErrorContext(
  `Error updating note ${id}`,
  () => apiRequest(`/notes/${id}`, {
    method: 'PUT',
    body: updatedNote,
  }),
);

export const deleteNote = async (id) => withErrorContext(`Error deleting note ${id}`, () => (
  apiRequest(`/notes/${id}`, {
    method: 'DELETE',
  })
));
