'use server'

import pool from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createProject(formData: FormData) {
  const name = formData.get('name') as string;
  if (!name || name.trim() === "") return;
  try {
    await pool.query('INSERT INTO log.projects (name, color) VALUES ($1, $2)', [name.trim(), '#3b82f6']);
    revalidatePath('/');
  } catch (e) { console.error(e); }
}

export async function deleteProject(id: number) {
  try {
    await pool.query('DELETE FROM log.projects WHERE id = $1', [id]);
    revalidatePath('/');
  } catch (e) { console.error(e); }
}

export async function addTask(formData: FormData) {
  const title = formData.get('title') as string;
  const projectId = formData.get('project_id');
  if (!title) return;
  try {
    await pool.query('INSERT INTO log.tasks (user_id, title, project_id) VALUES ($1, $2, $3)', ['thulani_dev', title, projectId || null]);
    revalidatePath('/');
  } catch (e) { console.error(e); }
}

export async function toggleTaskStatus(id: number, currentStatus: boolean) {
  try {
    await pool.query('UPDATE log.tasks SET is_completed = $1 WHERE id = $2', [!currentStatus, id]);
    revalidatePath('/');
  } catch (e) { console.error(e); }
}

export async function deleteTask(id: number) {
  try {
    await pool.query('DELETE FROM log.tasks WHERE id = $1', [id]);
    revalidatePath('/');
  } catch (e) { console.error(e); }
}