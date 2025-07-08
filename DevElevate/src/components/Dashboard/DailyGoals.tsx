import React, { useState } from 'react';
import { Plus, Check, X } from 'lucide-react';
import { useGlobalState } from '../../contexts/GlobalContext';

const DailyGoals: React.FC = () => {
  const { state, dispatch } = useGlobalState();
  const [newGoal, setNewGoal] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const addGoal = () => {
    if (newGoal.trim()) {
      dispatch({ type: 'ADD_DAILY_GOAL', payload: newGoal.trim() });
      setNewGoal('');
      setShowAddForm(false);
    }
  };

  const completeGoal = (goal: string) => {
    dispatch({ type: 'COMPLETE_DAILY_GOAL', payload: goal });
  };

  const removeGoal = (goal: string) => {
    dispatch({ type: 'REMOVE_GOAL', payload: goal });
  };

  return (
    <div className={`${state.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-xl font-semibold ${state.darkMode ? 'text-white' : 'text-gray-900'}`}>
          Daily Goals
        </h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {showAddForm && (
        <div className="mb-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="Enter your goal..."
              className={`flex-1 px-3 py-2 rounded-lg border ${
                state.darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              onKeyPress={(e) => e.key === 'Enter' && addGoal()}
            />
            <button
              onClick={addGoal}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {state.dailyGoals.length === 0 ? (
          <p className={`text-center py-8 ${state.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            No goals set for today. Add one to get started!
          </p>
        ) : (
          state.dailyGoals.map((goal, index) => (
            <div
              key={index}
              className={`flex items-center space-x-3 p-3 rounded-lg border ${
                state.darkMode ? 'border-gray-700' : 'border-gray-200'
              }`}
            >
              <button
                onClick={() => completeGoal(goal)}
                className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-green-500 flex items-center justify-center hover:bg-green-500 transition-colors group"
              >
                <Check className="w-3 h-3 text-transparent group-hover:text-white" />
              </button>
              <p className={`flex-1 ${state.darkMode ? 'text-white' : 'text-gray-900'}`}>
                {goal}
              </p>
            </div>
          ))
        )}
      </div>

      {state.completedGoals.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className={`text-sm font-medium mb-3 ${state.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Completed Today ({state.completedGoals.length})
          </h4>
          <div className="space-y-2">
            {state.completedGoals.map((goal, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 p-2 rounded-lg ${
                  state.darkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <p className={`flex-1 text-sm line-through ${state.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {goal}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyGoals;