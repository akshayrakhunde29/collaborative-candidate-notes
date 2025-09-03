import React, { useState } from 'react';
import { Plus, User, Mail } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { candidateService } from '../../services/candidates';
import { useToast } from '../ui/use-toast';
import LoadingSpinner from '../common/LoadingSpinner';

const CandidateList = ({ candidates, onCandidateCreated, onCandidateClick }) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await candidateService.createCandidate(formData.name, formData.email);
      onCandidateCreated(response.candidate);
      setFormData({ name: '', email: '' });
      setShowCreateDialog(false);
      toast({
        title: 'Success',
        description: 'Candidate created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create candidate',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Candidates</CardTitle>
            <CardDescription>
              Manage and view candidate notes
            </CardDescription>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Candidate
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Candidate</DialogTitle>
                <DialogDescription>
                  Add a new candidate to start collecting notes and feedback.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter candidate's full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter candidate's email"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? <LoadingSpinner size="sm" /> : 'Create Candidate'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {candidates.length === 0 ? (
          <div className="text-center py-8">
            <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates yet</h3>
            <p className="text-gray-500 mb-4">
              Get started by adding your first candidate.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {candidates.map((candidate) => (
              <Card
                key={candidate._id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onCandidateClick(candidate)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {candidate.name}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="w-3 h-3 mr-1" />
                        {candidate.email}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(candidate.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CandidateList;