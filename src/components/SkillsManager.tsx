import { useState, useEffect } from 'react';
import { supabase, Skill } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Plus, CreditCard as Edit2, Trash2 } from 'lucide-react';

export function SkillsManager() {
  const { user } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Frontend',
    level: 'Intermediate',
  });

  const categories = ['Frontend', 'Backend', 'Database', 'DevOps', 'Tools', 'Design', 'Other'];
  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  useEffect(() => {
    loadSkills();
  }, [user]);

  const loadSkills = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('skills')
      .select('*')
      .eq('user_id', user.id)
      .order('category', { ascending: true })
      .order('order_index', { ascending: true });

    setSkills(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const skillData = {
      ...formData,
      user_id: user.id,
    };

    if (editing) {
      await supabase.from('skills').update(skillData).eq('id', editing);
    } else {
      await supabase.from('skills').insert(skillData);
    }

    resetForm();
    loadSkills();
  };

  const handleEdit = (skill: Skill) => {
    setEditing(skill.id);
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level,
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this skill?')) {
      await supabase.from('skills').delete().eq('id', id);
      loadSkills();
    }
  };

  const resetForm = () => {
    setEditing(null);
    setFormData({
      name: '',
      category: 'Frontend',
      level: 'Intermediate',
    });
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  if (loading) {
    return <div className="text-gray-600">Loading skills...</div>;
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {editing ? 'Edit Skill' : 'Add New Skill'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Skill Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="React"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
            <select
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            <Plus className="w-4 h-4" />
            <span>{editing ? 'Update Skill' : 'Add Skill'}</span>
          </button>
          {editing && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-6">
        {Object.keys(groupedSkills).length === 0 ? (
          <p className="text-gray-500 text-center py-8">No skills yet. Add your first one above!</p>
        ) : (
          Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category}>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">{category}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {categorySkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-semibold text-gray-900">{skill.name}</h5>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEdit(skill)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(skill.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      {skill.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
