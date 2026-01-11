import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { videoAPI, paymentAPI } from "../services/api";
import PaymentForm from "../components/PaymentForm";
import { useToast } from "../components/ToastContainer";
import "../scss/dashboard.scss";
import logo from "../images/LOGO UPDATED (7).png";


const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [hasPayment, setHasPayment] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { showError, showSuccess } = useToast();

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const [paymentStatus, videoStatus] = await Promise.all([
        paymentAPI.getStatus(),
        videoAPI.getStatus(),
      ]);
      setHasPayment(
        paymentStatus.hasPayment &&
          paymentStatus.payment?.payment_status === "completed"
      );
      setHasVideo(videoStatus.hasVideo);
    } catch (error) {
      console.error("Error checking status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 500 * 1024 * 1024) {
        showError("File size must be less than 500MB");
        e.target.value = "";
        return;
      }
      setSelectedFile(file);
      setUploadStatus("");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showError("Please select a video file");
      return;
    }

    if (!hasPayment) {
      setShowPaymentForm(true);
      return;
    }

    setIsUploading(true);
    setUploadStatus("");

    try {
      await videoAPI.upload(selectedFile);
      showSuccess("Video uploaded successfully!");
      setUploadStatus("Video uploaded successfully!");
      setSelectedFile(null);
      await checkStatus();
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { error?: string } } }).response
              ?.data?.error
          : undefined;
      const message =
        errorMessage || "Failed to upload video. Please try again.";
      showError(message);
      setUploadStatus(message);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setHasPayment(true);
    setShowPaymentForm(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <nav className="dashboard-nav">
        <div className="nav-content">
          <div className="nav-inner">
            <div className="nav-brand">
              <div className="nav-brand-top">
                <img src={logo} alt="GeniusWav Logo" className="nav-logo" />
                <span className="nav-title">GeniusWav Contest Portal</span>
              </div>
              <span className="nav-user-name">Welcome, {user?.full_name}</span>
            </div>
            <div className="user-info">
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="dashboard-main">
        <div className="dashboard-card">
          <h2 className="card-title">Dashboard</h2>

          {/* Contest Description Section */}
          <div className="contest-hero">
            <div className="contest-header">
              <h1 className="contest-title">
                🎤 GENIUS WAV EMERGING ARTIST PERFORMANCE CONTEST 2026
              </h1>
              <p className="contest-tagline">
                Discovering. Promoting. Launching the Next Wave of African Music.
              </p>
            </div>

            <div className="contest-content">
              <div className="contest-section">
                <h3 className="section-title">About the Contest</h3>
                <p className="section-text">
                  A multi-phase music talent competition designed to discover, promote, and elevate independent artists through performance, audience engagement, and live talent evaluation. This contest blends social media virality, fan-driven promotion, and professional judging to give talented artists real exposure, real fans, and real opportunities.
                </p>
              </div>

              <div className="contest-section">
                <h3 className="section-title">How It Works</h3>
                <div className="phases-grid">
                  <div className="phase-card">
                    <div className="phase-number">1</div>
                    <h4 className="phase-title">Phase 1: Submission & Engagement</h4>
                    <p className="phase-description">
                      Submit your performance video and promote it on social media. Top-engaging artists advance to Phase 2.
                    </p>
                  </div>
                  <div className="phase-card">
                    <div className="phase-number">2</div>
                    <h4 className="phase-title">Phase 2: Advancement Round</h4>
                    <p className="phase-description">
                      Continue promoting your performance. Top-performing artists advance to the live finale.
                    </p>
                  </div>
                  <div className="phase-card">
                    <div className="phase-number">3</div>
                    <h4 className="phase-title">Phase 3: Live Performance</h4>
                    <p className="phase-description">
                      Perform live at Genius WAV Studio Headquarters in front of judges and audience. Winners selected by judges and audience engagement.
                    </p>
                  </div>
                </div>
              </div>

              <div className="contest-section">
                <h3 className="section-title">Prizes & Rewards</h3>
                <div className="rewards-list">
                  <div className="reward-item">
                    <span className="reward-icon">✅</span>
                    <div className="reward-content">
                      <strong>All Participants:</strong> Free Studio Production Session + Professional Photo Shoot
                    </div>
                  </div>
                  <div className="reward-item">
                    <span className="reward-icon">🚀</span>
                    <div className="reward-content">
                      <strong>Phase 2 Qualifiers:</strong> Digital Distribution + 90% Royalty Ownership + Additional Promotion
                    </div>
                  </div>
                  <div className="reward-item">
                    <span className="reward-icon">🎬</span>
                    <div className="reward-content">
                      <strong>Finalists:</strong> Free Music Video Shoot + Major Feature Collaboration + Professional Promotion
                    </div>
                  </div>
                  <div className="reward-item">
                    <span className="reward-icon">👑</span>
                    <div className="reward-content">
                      <strong>Grand Winner:</strong> ₦1,000,000 Cash Prize + Premium Record Deal + Long-term Career Support
                    </div>
                  </div>
                </div>
              </div>

              <div className="contest-section highlight-section">
                <div className="entry-fee-box">
                  <h3 className="entry-fee-title">Entry Fee</h3>
                  <p className="entry-fee-amount">₦10,000</p>
                  <p className="entry-fee-note">
                    One-time participation fee to confirm entry and prevent spam applications
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-section">
            {/* Payment Status */}
            <div className="status-card">
              <h3 className="status-title">
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Payment Status
              </h3>
              {hasPayment ? (
                <div className="success-message">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Payment completed successfully
                </div>
              ) : (
                <div>
                  <p className="status-text">
                    Complete your payment of <strong>₦10,000</strong> to upload
                    your contest video.
                  </p>
                  <button
                    onClick={() => setShowPaymentForm(true)}
                    className="pay-button"
                  >
                    Pay ₦10,000
                  </button>
                </div>
              )}
            </div>

            {/* Video Upload */}
            <div className="status-card">
              <h3 className="status-title">
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Video Upload
              </h3>
              {hasVideo ? (
                <div className="success-message file-info">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Video uploaded successfully
                </div>
              ) : (
                <div className="upload-section">
                  <div className="file-input-wrapper">
                    <label htmlFor="video-upload" className="file-label">
                      Select Video File
                      <span className="helper-text">
                        {" "}
                        (Maximum file size: 500MB)
                      </span>
                    </label>
                    <input
                      id="video-upload"
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                      className="file-input"
                      aria-describedby="video-upload-help"
                    />
                    <span id="video-upload-help" className="helper-text">
                      Accepted formats: MP4, AVI, MOV, WMV, FLV, WebM, MKV
                    </span>
                  </div>
                  {selectedFile && (
                    <div className="file-info">
                      Selected: {selectedFile.name} (
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                  )}
                  {uploadStatus && (
                    <div
                      className={`upload-status ${
                        uploadStatus.includes("successfully")
                          ? "upload-status-success"
                          : "upload-status-error"
                      }`}
                    >
                      {uploadStatus}
                    </div>
                  )}
                  <button
                    onClick={handleUpload}
                    disabled={!selectedFile || isUploading || !hasPayment}
                    className="upload-button"
                  >
                    {isUploading ? "Uploading..." : "Upload Video"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {showPaymentForm && (
        <PaymentForm
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPaymentForm(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
