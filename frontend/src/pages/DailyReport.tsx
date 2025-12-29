import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import apiClient from '../utils/api';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

interface HeatmapDay {
  date: string;
  score: number;
  level: number;
}

interface Habit {
  date: string;
  habits: boolean[];
}

interface WeekStat {
  day: string;
  score: number;
}

const DailyReport: React.FC = () => {
  const { user } = useAuth();
  const [heatmapDays, setHeatmapDays] = useState<HeatmapDay[]>([]);
  const [habits, setHabits] = useState<string[]>([]);
  const [weekHabits, setWeekHabits] = useState<Habit[]>([]);
  const [weekStats, setWeekStats] = useState<WeekStat[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getWeekStart(new Date()));

  useEffect(() => {
    fetchData();
  }, [currentWeekStart]);

  const getWeekDates = (startDate: Date) => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };

  const handlePrevWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() - 7);
    setCurrentWeekStart(newStart);
  };

  const handleNextWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() + 7);
    setCurrentWeekStart(newStart);
  };

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [habitsRes, statsRes] = await Promise.all([
        apiClient.get('/heatmap/habits'),
        apiClient.get('/heatmap/stats'),
      ]);

      setHabits(habitsRes.data.habits);
      setWeekHabits(habitsRes.data.weekHabits);
      setWeekStats(statsRes.data.weekStats);
      setTrendData(statsRes.data.trendData);
      setTotalScore(statsRes.data.totalScore);
      setCompletionRate(statsRes.data.completionRate);
    } catch (err: any) {
      setError('Failed to load report data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateHabitTracking = async (date: string, habitIndex: number) => {
    try {
      const weekHabit = weekHabits.find((h) => h.date === date);
      if (!weekHabit) return;

      const updatedHabits = [...weekHabit.habits];
      updatedHabits[habitIndex] = !updatedHabits[habitIndex];

      await apiClient.post('/heatmap/habits', {
        date,
        habits: updatedHabits,
      });

      setWeekHabits((prev) =>
        prev.map((h) => (h.date === date ? { ...h, habits: updatedHabits } : h))
      );

      await fetchData();
    } catch (err) {
      console.error('Failed to update habit', err);
    }
  };

  const getHeatmapColor = (level: number) => {
    const colors = ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'];
    return colors[level] || '#ebedf0';
  };

  const weeks = Math.ceil(heatmapDays.length / 7);
  const COLORS = ['#4c6ef5', '#51cf66', '#ffa94d', '#ff6b6b'];

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#000', padding: '20px' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '8px', color: 'white' }}>📊 Daily Report</h1>
        <p style={{ color: '#999', marginBottom: '20px', fontSize: '14px' }}>Track your 2025 progress with contributions, habits, and analytics</p>

        {error && <p style={{ color: '#ff6b6b', marginBottom: '20px' }}>{error}</p>}

        {/* TOP SECTION: Score (Left) + Line Graph (Center/Right Spread) + Pie Chart (Right) */}
        <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 2.5fr 0.8fr', gap: '15px', marginBottom: '20px' }}>
          {/* Total Score Card - SMALLER */}
          <div style={{ padding: '20px', backgroundColor: '#00BFFF', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
            <div style={{ fontSize: '11px', color: '#333', marginBottom: '12px', fontWeight: 600 }}>SCORE</div>
            <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '8px' }}>{totalScore}</div>
            <div style={{ fontSize: '12px', color: '#333' }}>/ 2555</div>
            <div style={{ fontSize: '11px', color: '#555', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(0,0,0,0.2)' }}>
              {completionRate}%
            </div>
          </div>

          {/* Line Graph - WIDE SPREAD */}
          <div style={{ padding: '20px', backgroundColor: '#00BFFF', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
            <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 600, color: '#333' }}>📈 Last 30 Days</h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="date" stroke="#666" style={{ fontSize: '10px' }} />
                <YAxis stroke="#666" style={{ fontSize: '10px' }} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#1a1a1a" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart - SMALLER */}
          <div style={{ padding: '20px', backgroundColor: '#00BFFF', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
            <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 600, color: '#333' }}>🎯 Complete</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Done', value: completionRate },
                    { name: 'Left', value: 100 - completionRate },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  <Cell fill="#51cf66" />
                  <Cell fill="#999" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* MIDDLE SECTION: Weekly Habits Tracker - CENTERED & SCROLLABLE */}
        <div style={{ backgroundColor: '#00BFFF', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.3)', marginBottom: '20px', maxHeight: '320px', overflow: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', position: 'sticky', top: 0, backgroundColor: '#00BFFF', paddingBottom: '10px' }}>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#333' }}>✅ This Week's Habits</h2>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                onClick={handlePrevWeek}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#1a1a1a',
                  color: '#00BFFF',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '12px',
                }}
              >
                ← Prev
              </button>
              <span style={{ fontSize: '12px', color: '#333', minWidth: '160px', textAlign: 'center', fontWeight: 500 }}>
                {new Date(currentWeekStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(currentWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
              <button
                onClick={handleNextWeek}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#1a1a1a',
                  color: '#00BFFF',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '12px',
                }}
              >
                Next →
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #333' }}>
                  <th style={{ padding: '10px', textAlign: 'left', fontWeight: 600, fontSize: '13px', color: '#333', minWidth: '140px' }}>Habit</th>
                  {weekHabits.map((h) => (
                    <th key={h.date} style={{ padding: '10px', textAlign: 'center', fontSize: '11px', color: '#333', minWidth: '90px' }}>
                      {new Date(h.date).toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' })}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {habits.map((habit, habitIdx) => (
                  <tr key={habitIdx} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '10px', fontWeight: 500, fontSize: '13px', color: '#333' }}>{habit}</td>
                    {weekHabits.map((dayHabits) => (
                      <td key={dayHabits.date} style={{ padding: '10px', textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={dayHabits.habits[habitIdx] || false}
                          onChange={() => updateHabitTracking(dayHabits.date, habitIdx)}
                          style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* BOTTOM SECTION: Weekly Bar Chart */}
        <div style={{ backgroundColor: '#00BFFF', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
          <h2 style={{ marginBottom: '15px', fontSize: '16px', fontWeight: 600, color: '#333' }}>📊 This Week Performance</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={weekStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="day" stroke="#666" style={{ fontSize: '12px' }} />
              <YAxis stroke="#666" style={{ fontSize: '12px' }} />
              <Tooltip />
              <Bar dataKey="score" fill="#1a1a1a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DailyReport;
