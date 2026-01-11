import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../services/api";
import { useToast } from "../components/ToastContainer";
import "../scss/admin-panel.scss";
import logo from "../images/LOGO UPDATED (7).png";

interface Contestant {
  userId: string;
  fullName: string;
  email: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  roundStatus: string;
  video: {
    id: string;
    fileName: string;
    filePath: string;
    createdAt: string;
  };
}

const AdminPanel = () => {
  const [activeRound, setActiveRound] = useState<1 | 2 | 3>(1);
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewingVideo, setViewingVideo] = useState<{ url: string; fileName: string } | null>(null);
  const { showError, showSuccess } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }

    loadContestants();
  }, [activeRound, navigate]);

  const loadContestants = async () => {
    setIsLoading(true);
    try {
      const data = await adminAPI.getRound(activeRound);
      setContestants(data.contestants || []);
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data
              ?.error
          : undefined;
      showError(errorMessage || "Failed to load contestants");
      if ((err as any)?.response?.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
        navigate('/admin/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (userId: string) => {
    if (!confirm(`Are you sure you want to accept this contestant to Round ${activeRound + 1}?`)) {
      return;
    }

    try {
      await adminAPI.acceptContestant(activeRound, userId);
      showSuccess("Contestant accepted and moved to next round!");
      loadContestants();
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data
              ?.error
          : undefined;
      showError(errorMessage || "Failed to accept contestant");
    }
  };

  const handleViewVideo = async (videoId: string, fileName: string) => {
    try {
      setIsLoading(true);
      // Fetch video as blob with authentication
      const blob = await adminAPI.downloadVideo(videoId);
      const url = window.URL.createObjectURL(blob);
      
      // Set video URL for modal display
      setViewingVideo({ url, fileName });
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data
              ?.error
          : undefined;
      showError(errorMessage || "Failed to load video");
    } finally {
      setIsLoading(false);
    }
  };

  const closeVideoModal = () => {
    if (viewingVideo) {
      window.URL.revokeObjectURL(viewingVideo.url);
      setViewingVideo(null);
    }
  };

  const handleDownloadVideo = async (videoId: string, fileName: string) => {
    try {
      const blob = await adminAPI.downloadVideo(videoId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showSuccess("Video downloaded successfully");
    } catch (err) {
      showError("Failed to download video");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    navigate('/admin/login');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const adminData = JSON.parse(localStorage.getItem('admin') || '{}');

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <div className="admin-brand">
          <div className="admin-brand-top">
            <img src={logo} alt="GeniusWav Logo" className="admin-logo" />
            <span className="admin-title">GeniusWav Contest Portal</span>
          </div>
          <span className="admin-user-name">Admin: {adminData.username || 'Administrator'}</span>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-button ${activeRound === 1 ? 'active' : ''}`}
          onClick={() => setActiveRound(1)}
        >
          Round 1
          <span className="tab-count">
            ({activeRound === 1 ? contestants.length : '...'})
          </span>
        </button>
        <button
          className={`tab-button ${activeRound === 2 ? 'active' : ''}`}
          onClick={() => setActiveRound(2)}
        >
          Round 2
          <span className="tab-count">
            ({activeRound === 2 ? contestants.length : '...'})
          </span>
        </button>
        <button
          className={`tab-button ${activeRound === 3 ? 'active' : ''}`}
          onClick={() => setActiveRound(3)}
        >
          Round 3
          <span className="tab-count">
            ({activeRound === 3 ? contestants.length : '...'})
          </span>
        </button>
      </div>

      <div className="admin-content">
        {isLoading ? (
          <div className="loading">Loading contestants...</div>
        ) : contestants.length === 0 ? (
          <div className="empty-state">No contestants in this round</div>
        ) : (
          <div className="contestants-grid">
            {contestants.map((contestant) => (
              <div key={contestant.userId} className="contestant-card">
                <div className="card-header">
                  <h3>{contestant.fullName}</h3>
                  <span className="submission-date">
                    {formatDate(contestant.video.createdAt)}
                  </span>
                </div>

                <div className="card-body">
                  <div className="info-section">
                    <h4>Account Details</h4>
                    <div className="info-item">
                      <span className="label">Bank:</span>
                      <span className="value">{contestant.bankName || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Account Number:</span>
                      <span className="value">{contestant.accountNumber || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Account Name:</span>
                      <span className="value">{contestant.accountName || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="video-section">
                    <h4>Video</h4>
                    <div className="video-info">
                      <span>{contestant.video.fileName}</span>
                    </div>
                  </div>
                </div>

                <div className="card-actions">
                  <button
                    className="action-button view-button"
                    onClick={() => handleViewVideo(contestant.video.id, contestant.video.fileName)}
                  >
                    View Video
                  </button>
                  <button
                    className="action-button download-button"
                    onClick={() => handleDownloadVideo(contestant.video.id, contestant.video.fileName)}
                  >
                    Download
                  </button>
                  {activeRound < 3 && (
                    <button
                      className="action-button accept-button"
                      onClick={() => handleAccept(contestant.userId)}
                    >
                      Accept
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Modal */}
      {viewingVideo && (
        <div className="video-modal-overlay" onClick={closeVideoModal}>
          <div className="video-modal" onClick={(e) => e.stopPropagation()}>
            <div className="video-modal-header">
              <h3>{viewingVideo.fileName}</h3>
              <button className="video-modal-close" onClick={closeVideoModal}>
                ×
              </button>
            </div>
            <div className="video-modal-content">
              <video controls autoPlay src={viewingVideo.url} style={{ width: '100%', maxHeight: '80vh' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
