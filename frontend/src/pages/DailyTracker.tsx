import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import apiClient from '../utils/api';

interface DailyEntry {
  id: number;
  entry_date: string;
  skill_points: number;
  career_points: number;
  project_points: number;
  total_score: number;
  notes: string;
}

interface Stats {
  totalEntries: number;
  totalScore: number;
  averageScore: number;
  currentStreak: number;
  longestStreak: number;
}

const skillItems = [
  'Learned new concept',
  'Practiced coding',
  'Read documentation',
  'Completed tutorial',
];

const careerItems = [
  'Updated portfolio',
  'Networked/connected',
  'Interview prep',
];

const projectItems = [
  'Worked on main project',
  'Fixed bugs',
  'Code review',
];

const aptitudeTopics = [
  '🔢 Quantitative Aptitude',
  '📖 Verbal Reasoning',
  '🧠 Logical Reasoning',
  '⏱️ Time Management',
];

const skillsByLevel = {
  basic: [
    'HTML/CSS',
    'JavaScript Basics',
    'Git/Version Control',
    'Command Line',
  ],
  intermediate: [
    'React/Frontend Frameworks',
    'REST APIs',
    'Database Design',
    'Python',
  ],
  advanced: [
    'System Design',
    'Cloud Architecture',
    'Microservices',
    'Performance Optimization',
  ],
};

type TabType = 'today' | 'development' | 'career' | 'history';

const DailyTracker: React.FC = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [todayEntry, setTodayEntry] = useState<DailyEntry | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('today');

  const [formData, setFormData] = useState({
    skillChecked: [false, false, false, false],
    careerChecked: [false, false, false],
    projectChecked: [false, false, false],
    aptitudeChecked: [false, false, false, false],
    skillsBasicChecked: [false, false, false, false],
    skillsIntermediateChecked: [false, false, false, false],
    skillsAdvancedChecked: [false, false, false, false],
    notes: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [entriesRes, todayRes, statsRes] = await Promise.all([
        apiClient.get('/daily/entries'),
        apiClient.get('/daily/today'),
        apiClient.get('/daily/stats'),
      ]);

      setEntries(entriesRes.data.entries || []);
      setTodayEntry(todayRes.data.entry);
      setStats(statsRes.data.stats);

      // Pre-fill form if entry exists
      if (todayRes.data.entry) {
        setFormData({
          skillChecked: Array(4).fill(false).map((_, i) => i < todayRes.data.entry.skill_points),
          careerChecked: Array(3).fill(false).map((_, i) => i < todayRes.data.entry.career_points),
          projectChecked: Array(3).fill(false).map((_, i) => i < todayRes.data.entry.project_points),
          aptitudeChecked: [false, false, false, false],
          skillsBasicChecked: [false, false, false, false],
          skillsIntermediateChecked: [false, false, false, false],
          skillsAdvancedChecked: [false, false, false, false],
          notes: todayRes.data.entry.notes,
        });
      }
    } catch (err: any) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckChange = (category: keyof typeof formData, index: number) => {
    setFormData((prev) => {
      const arr = prev[category] as boolean[];
      const newChecked = [...arr];
      newChecked[index] = !newChecked[index];
      return { ...prev, [category]: newChecked };
    });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, notes: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const skillPoints = formData.skillChecked.filter(Boolean).length;
      const careerPoints = formData.careerChecked.filter(Boolean).length;
      const projectPoints = formData.projectChecked.filter(Boolean).length;

      await apiClient.post('/daily/entries', {
        skillPoints,
        careerPoints,
        projectPoints,
        notes: formData.notes,
      });
      setActiveTab('history');
      await fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save entry');
    }
  };

  if (loading) {
    return <div className="container" style={{ padding: '50px', textAlign: 'center' }}>Loading...</div>;
  }

  const skillPoints = formData.skillChecked.filter(Boolean).length;
  const careerPoints = formData.careerChecked.filter(Boolean).length;
  const projectPoints = formData.projectChecked.filter(Boolean).length;
  const totalPoints = Math.min(skillPoints + careerPoints + projectPoints, 10);

  const tabStyle = (tab: TabType) => ({
    padding: '14px 20px',
    backgroundColor: activeTab === tab ? '#4c6ef5' : 'transparent',
    color: activeTab === tab ? 'white' : '#666',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: activeTab === tab ? '600' : 'normal',
    borderRadius: '8px 8px 0 0',
    marginRight: '8px',
    whiteSpace: 'nowrap',
  });

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#f5f5f5' }}>
      <div style={{ flex: 1, overflow: 'auto', padding: '40px 20px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ marginBottom: '30px' }}>
            <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>📊 Daily Performance Tracker</h1>
            <p style={{ color: '#666', fontSize: '14px' }}>Track your daily progress across skills, projects, and career goals</p>
          </div>

        {/* Stats Overview */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' }}>
            <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>📌 Current Streak</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ff6b6b' }}>{stats.currentStreak}</div>
              <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>days</div>
            </div>
            <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>🔥 Longest Streak</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#4c6ef5' }}>{stats.longestStreak}</div>
              <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>days</div>
            </div>
            <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>💯 Total Score</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#51cf66' }}>{stats.totalScore}</div>
              <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>points</div>
            </div>
            <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>📊 Average Score</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffa94d' }}>{(stats.averageScore).toFixed(1)}</div>
              <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>per day</div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '20px',
          borderBottom: '2px solid #e0e0e0',
          paddingBottom: '0',
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '0',
          overflow: 'auto',
        }}>
          <button onClick={() => setActiveTab('today')} style={tabStyle('today')}>
            📝 Today
          </button>
          <button onClick={() => setActiveTab('development')} style={tabStyle('development')}>
            🚀 Development
          </button>
          <button onClick={() => setActiveTab('career')} style={tabStyle('career')}>
            🎓 Career & Aptitude
          </button>
          <button onClick={() => setActiveTab('history')} style={tabStyle('history')}>
            📅 History
          </button>
        </div>

        {/* Tab Content */}
        <div style={{
          minHeight: '500px',
          backgroundColor: 'white',
          borderRadius: '0 0 8px 8px',
          padding: '30px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}>
          {/* Today Tab */}
          {activeTab === 'today' && (
            <div>
              <h2>Log Today's Performance</h2>
              <form onSubmit={handleSubmit}>
                {/* Skill Development */}
                <div style={{ marginBottom: '25px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
                  <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <span>📚 Skill Development</span>
                    <span style={{ fontSize: '14px', backgroundColor: '#e7f5ff', padding: '5px 12px', borderRadius: '20px', fontWeight: 'normal' }}>
                      {skillPoints}/4
                    </span>
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {skillItems.map((item, idx) => (
                      <label key={idx} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '12px' }}>
                        <input
                          type="checkbox"
                          checked={formData.skillChecked[idx]}
                          onChange={() => handleCheckChange('skillChecked', idx)}
                          style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                        />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Project Work */}
                <div style={{ marginBottom: '25px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
                  <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <span>💻 Project Work</span>
                    <span style={{ fontSize: '14px', backgroundColor: '#e7f5ff', padding: '5px 12px', borderRadius: '20px', fontWeight: 'normal' }}>
                      {projectPoints}/3
                    </span>
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {projectItems.map((item, idx) => (
                      <label key={idx} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '12px' }}>
                        <input
                          type="checkbox"
                          checked={formData.projectChecked[idx]}
                          onChange={() => handleCheckChange('projectChecked', idx)}
                          style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                        />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>📝 Notes (Optional)</label>
                  <textarea
                    value={formData.notes}
                    onChange={handleNotesChange}
                    placeholder="What did you work on today?"
                    style={{
                      width: '100%',
                      minHeight: '100px',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      fontFamily: 'inherit',
                      fontSize: '14px',
                    }}
                  />
                </div>

                {/* Total Score */}
                <div style={{ padding: '15px', backgroundColor: '#e7f5ff', borderRadius: '8px', marginBottom: '20px' }}>
                  <strong style={{ fontSize: '16px' }}>Daily Score: {totalPoints}/10</strong>
                </div>

                {error && <p style={{ color: '#ff6b6b', marginBottom: '15px' }}>{error}</p>}

                <button type="submit" style={{
                  padding: '12px 30px',
                  backgroundColor: '#51cf66',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                }}>
                  💾 Save Entry
                </button>
              </form>
            </div>
          )}

          {/* Development Tab */}
          {activeTab === 'development' && (
            <div>
              <h2>🚀 Development & Skills</h2>
              <form onSubmit={handleSubmit}>
                {/* Project Work */}
                <div style={{ marginBottom: '25px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
                  <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <span>💻 Project Work</span>
                    <span style={{ fontSize: '14px', backgroundColor: '#e7f5ff', padding: '5px 12px', borderRadius: '20px', fontWeight: 'normal' }}>
                      {projectPoints}/3
                    </span>
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {projectItems.map((item, idx) => (
                      <label key={idx} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '12px' }}>
                        <input
                          type="checkbox"
                          checked={formData.projectChecked[idx]}
                          onChange={() => handleCheckChange('projectChecked', idx)}
                          style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                        />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Technical Skills by Level */}
                <div style={{ marginBottom: '25px' }}>
                  <h3 style={{ marginBottom: '15px' }}>🎓 Technical Skills by Level</h3>
                  
                  {/* Basic */}
                  <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#2e7d32' }}>🟢 Basic Level</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      {skillsByLevel.basic.map((skill, idx) => (
                        <label key={idx} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '8px', fontSize: '13px' }}>
                          <input
                            type="checkbox"
                            checked={formData.skillsBasicChecked[idx]}
                            onChange={() => handleCheckChange('skillsBasicChecked', idx)}
                            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                          />
                          <span>{skill}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Intermediate */}
                  <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fff3e0', borderRadius: '8px' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#e65100' }}>🟠 Intermediate Level</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      {skillsByLevel.intermediate.map((skill, idx) => (
                        <label key={idx} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '8px', fontSize: '13px' }}>
                          <input
                            type="checkbox"
                            checked={formData.skillsIntermediateChecked[idx]}
                            onChange={() => handleCheckChange('skillsIntermediateChecked', idx)}
                            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                          />
                          <span>{skill}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Advanced */}
                  <div style={{ padding: '15px', backgroundColor: '#ffebee', borderRadius: '8px' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#c62828' }}>🔴 Advanced Level</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      {skillsByLevel.advanced.map((skill, idx) => (
                        <label key={idx} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '8px', fontSize: '13px' }}>
                          <input
                            type="checkbox"
                            checked={formData.skillsAdvancedChecked[idx]}
                            onChange={() => handleCheckChange('skillsAdvancedChecked', idx)}
                            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                          />
                          <span>{skill}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>📝 Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={handleNotesChange}
                    placeholder="Describe your development work..."
                    style={{
                      width: '100%',
                      minHeight: '80px',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}

                <button type="submit" style={{
                  padding: '12px 30px',
                  backgroundColor: '#51cf66',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                }}>
                  💾 Save Entry
                </button>
              </form>
            </div>
          )}

          {/* Career Tab */}
          {activeTab === 'career' && (
            <div>
              <h2>🎓 Career Preparation & Aptitude</h2>
              <form onSubmit={handleSubmit}>
                {/* Career */}
                <div style={{ marginBottom: '25px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
                  <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <span>🎯 Career Preparation</span>
                    <span style={{ fontSize: '14px', backgroundColor: '#e7f5ff', padding: '5px 12px', borderRadius: '20px', fontWeight: 'normal' }}>
                      {careerPoints}/3
                    </span>
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {careerItems.map((item, idx) => (
                      <label key={idx} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '12px' }}>
                        <input
                          type="checkbox"
                          checked={formData.careerChecked[idx]}
                          onChange={() => handleCheckChange('careerChecked', idx)}
                          style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                        />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Aptitude */}
                <div style={{ marginBottom: '25px', padding: '15px', backgroundColor: '#fff3e0', borderRadius: '8px' }}>
                  <h3 style={{ marginBottom: '15px', marginTop: 0 }}>📊 Aptitude Topics</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {aptitudeTopics.map((topic, idx) => (
                      <label key={idx} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '10px' }}>
                        <input
                          type="checkbox"
                          checked={formData.aptitudeChecked[idx]}
                          onChange={() => handleCheckChange('aptitudeChecked', idx)}
                          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '14px' }}>{topic}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>📝 Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={handleNotesChange}
                    placeholder="What did you prepare for today?"
                    style={{
                      width: '100%',
                      minHeight: '80px',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}

                <button type="submit" style={{
                  padding: '12px 30px',
                  backgroundColor: '#51cf66',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                }}>
                  💾 Save Entry
                </button>
              </form>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div>
              <h2>📅 Your Progress History</h2>
              {entries.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                  <p style={{ fontSize: '16px' }}>No entries yet. Start logging your progress!</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '15px' }}>
                  {entries.map((entry) => (
                    <div key={entry.id} style={{
                      padding: '20px',
                      border: '1px solid #ddd',
                      borderLeft: `4px solid ${entry.total_score >= 7 ? '#51cf66' : entry.total_score >= 4 ? '#ffa94d' : '#ff6b6b'}`,
                      borderRadius: '5px',
                      backgroundColor: '#fafafa',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                        <div>
                          <strong style={{ fontSize: '16px' }}>📅 {entry.entry_date}</strong>
                        </div>
                        <div style={{
                          fontSize: '28px',
                          fontWeight: 'bold',
                          color: entry.total_score >= 7 ? '#51cf66' : entry.total_score >= 4 ? '#ffa94d' : '#ff6b6b',
                        }}>
                          {entry.total_score}/10
                        </div>
                      </div>
                      <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px', lineHeight: '1.6' }}>
                        <div>📚 Skills: <strong>{entry.skill_points}</strong> | 💻 Project: <strong>{entry.project_points}</strong> | 🎯 Career: <strong>{entry.career_points}</strong></div>
                      </div>
                      {entry.notes && (
                        <div style={{ fontSize: '13px', marginTop: '8px', padding: '8px', backgroundColor: 'white', borderRadius: '4px', fontStyle: 'italic' }}>
                          💭 "{entry.notes}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default DailyTracker;
