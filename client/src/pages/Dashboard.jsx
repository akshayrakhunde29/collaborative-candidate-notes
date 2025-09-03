import React, { useState, useEffect } from "react";
import Header from "../components/common/Header";
import CandidateList from "../components/dashboard/CandidateList";
import NotificationsCard from "../components/dashboard/NotificationsCard";
import NotesModal from "../components/notes/NotesModal";
import { candidateService } from "../services/candidates";
import { notificationService } from "../services/notifications";
import { useSocket } from "../context/SocketContext";
import { useToast } from "../components/ui/use-toast";
import LoadingSpinner from "../components/common/LoadingSpinner";

const Dashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const { notifications, setNotifications, setUnreadCount } = useSocket();
  const { toast } = useToast();

  useEffect(() => {
    loadCandidates();
    loadNotifications();
  }, []);

  const loadCandidates = async () => {
    try {
      const response = await candidateService.getCandidates();
      setCandidates(response.candidates);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load candidates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadNotifications = async () => {
    try {
      const response = await notificationService.getNotifications();
      setNotifications(response.notifications);
      setUnreadCount(response.unreadCount);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
  };

  const handleCandidateCreated = (newCandidate) => {
    setCandidates((prev) => [newCandidate, ...prev]);
  };

  const handleCandidateClick = (candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleNotificationClick = async (notification) => {
    try {
      // Mark notification as read
      await notificationService.markAsRead(notification._id);

      // Find and open the candidate
      const candidate = candidates.find(
        (c) => c._id === notification.candidateId._id
      );
      if (candidate) {
        setSelectedCandidate(candidate);
        setShowNotifications(false);
      }

      // Update local notifications state
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notification._id ? { ...n, isRead: true } : n
        )
      );

      // Update unread count
      const response = await notificationService.getNotifications(1, 20, true);
      setUnreadCount(response.notifications.length);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open notification",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-100 bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <Header
        onNotificationsClick={() => setShowNotifications(!showNotifications)}
      />

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <CandidateList
              candidates={candidates}
              onCandidateCreated={handleCandidateCreated}
              onCandidateClick={handleCandidateClick}
            />
          </div>

          {/* Notifications sidebar */}
          <div className="lg:col-span-1">
            {showNotifications && (
              <NotificationsCard
                notifications={notifications}
                onNotificationClick={handleNotificationClick}
              />
            )}
          </div>
        </div>
      </main>

      {/* Notes Modal */}
      {selectedCandidate && (
        <NotesModal
          candidate={selectedCandidate}
          isOpen={!!selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
