import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import api from '../api/axios';

export interface Project {
  id: string;
  name: string;
  color: string;
}

export interface Column {
  id: string;
  title: string;
  tasks: string[];
}

export default function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [projRes, colRes] = await Promise.all([
          api.get('/projects'),
          api.get('/columns'),
        ]);
        setProjects(projRes.data);
        setColumns(colRes.data);
      } catch {
        setError('Erreur chargement');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const addProject = useCallback(async (name: string, color: string) => {
    setSaving(true);
    setError(null);
    try {
      const { data } = await api.post('/projects', { name, color });
      setProjects((prev) => [...prev, data]);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || `Erreur ${err.response?.status ?? ''}`);
      } else {
        setError('Erreur inconnue');
      }
    } finally {
      setSaving(false);
    }
  }, []);

  const renameProject = useCallback(async (project: Project) => {
    const newName = prompt('Nouveau nom :', project.name);
    if (!newName || newName.trim() === '' || newName.trim() === project.name) {
      return;
    }

    setError(null);
    try {
      const { data } = await api.put(`/projects/${project.id}`, {
        ...project,
        name: newName.trim(),
      });
      setProjects((prev) => prev.map((p) => (p.id === data.id ? data : p)));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || `Erreur ${err.response?.status ?? ''}`);
      } else {
        setError('Erreur lors du renommage du projet');
      }
    }
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    if (!confirm('Êtes-vous sûr ?')) {
      return;
    }

    setError(null);
    try {
      await api.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || `Erreur ${err.response?.status ?? ''}`);
      } else {
        setError('Erreur lors de la suppression du projet');
      }
    }
  }, []);

  return { projects, columns, loading, error, saving, addProject, renameProject, deleteProject };
}
