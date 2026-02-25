import React, { useState } from 'react';

interface NewProposalFormProps {
  onClose: () => void;
  onSubmit: (proposal: { title: string; subject: string; budget: number }) => void;
}

const NewProposalForm: React.FC<NewProposalFormProps> = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [budget, setBudget] = useState<number | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && subject && budget !== '') {
      onSubmit({ title, subject, budget: Number(budget) });
      setTitle('');
      setSubject('');
      setBudget('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="glass neon-border p-8 rounded-2xl w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 gradient-text">Create New Proposal</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-white/70 text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              id="title"
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green-500 text-white"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="subject" className="block text-white/70 text-sm font-medium mb-2">Subject</label>
            <textarea
              id="subject"
              rows={4}
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green-500 text-white"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="budget" className="block text-white/70 text-sm font-medium mb-2">Budget (ETH)</label>
            <input
              type="number"
              id="budget"
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-green-500 text-white"
              value={budget}
              onChange={(e) => setBudget(e.target.value === '' ? '' : Number(e.target.value))}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
            >
              Submit Proposal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProposalForm;
