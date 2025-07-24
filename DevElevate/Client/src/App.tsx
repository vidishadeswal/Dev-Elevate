

function App() {
  return (
    <AuthProvider>
      <GlobalProvider>
        <Router>

          {/* <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col"> */}
            <Routes>
              {/* Public Routes */}
              <Route
                path="/login"
                element={
                  <ProtectedRoute requireAuth={false}>
                    <LoginRegister />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <div className="flex-1 bg-white dark:bg-gray-900">

                      <main className="flex-1">
                        <Routes>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/learning" element={<LearningHub />} />
                          <Route path="/chatbot" element={<Chatbot />} />
                          <Route path="/news" element={<TechFeed />} />
                          <Route path="/resume" element={<ResumeBuilder />} />
                          <Route
                            path="/placement"
                            element={<PlacementPrep />}
                          />
                          <Route path="/profile" element={<UserProfile />} />
                          <Route path="/privacy" element={<PrivacyPolicy />} />
                          <Route path="/terms" element={<TermsOfService />} />
                          <Route path="/creator" element={<CreatorPage />} />
                          <Route path="/disclaimer" element={<Disclaimer />} />
                        </Routes>
                      </main>
                      <Footer />
                    </div>
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          {/* </div> */}

          <AppContent />

        </Router>
      </GlobalProvider>
    </AuthProvider>
  );
}

export default App;
