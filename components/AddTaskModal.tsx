import pool from "@/lib/db";
import AddTaskModalClient from "./AddTaskModalClient";

export default async function AddTaskModal() {
  // Fetch projects on the server
  let projects = [];
  try {
    const res = await pool.query('SELECT id, name FROM log.projects ORDER BY name ASC');
    projects = res.rows;
  } catch (e) {
    console.error("Failed to fetch projects for modal:", e);
  }

  return <AddTaskModalClient projects={projects} />;
}