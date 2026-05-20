import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  InputBase,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  TextField,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Search,
  UnfoldMore,
  UnfoldLess,
  ArrowUpward,
  ExpandMore,
  ExpandLess,
  CheckCircle,
  Help,
  Mail
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

import { mockReleases as initialReleases } from '../mockData';

export default function ReleaseNotes() {
  const navigate = useNavigate();
  const latestReleaseRef = useRef<HTMLDivElement>(null);

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(3); // Start with top 3 releases visible (May 15, 14, 13)
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({
    '1': true, // The latest release (id='1') is expanded by default as in the screenshot
  });

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'info'>('success');

  // Load more releases handler
  const handleLoadOlder = () => {
    if (visibleCount >= initialReleases.length) {
      setSnackbarMessage('All archived release notes have been loaded.');
      setSnackbarSeverity('info');
      setSnackbarOpen(true);
    } else {
      setVisibleCount((prev) => prev + 2);
      setSnackbarMessage('Loaded older archived release notes.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }
  };

  // Expand or Collapse single release
  const toggleExpanded = (id: string) => {
    setExpandedMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Expand all active visible releases
  const handleExpandAll = () => {
    const nextMap: Record<string, boolean> = {};
    initialReleases.slice(0, visibleCount).forEach((rel) => {
      nextMap[rel.id] = true;
    });
    setExpandedMap(nextMap);
    setSnackbarMessage('Expanded all visible release notes');
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
  };

  // Collapse all active visible releases
  const handleCollapseAll = () => {
    setExpandedMap({});
    setSnackbarMessage('Collapsed all visible release notes');
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
  };

  // Jump to latest (Scroll target)
  const handleJumpToLatest = () => {
    latestReleaseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setSnackbarMessage('Scrolling to latest deployment note');
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
    // Make sure latest is expanded
    setExpandedMap((prev) => ({ ...prev, '1': true }));
  };

  // Newsletter submission simulator
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) {
      setSnackbarMessage('Please enter a valid company email address.');
      setSnackbarSeverity('info');
      setSnackbarOpen(true);
      return;
    }
    setSnackbarMessage(`Subscription successful! Weekly digests will be sent to ${newsletterEmail}`);
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
    setNewsletterEmail('');
  };

  // Dynamic search calculation
  const filteredReleases = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      return initialReleases.slice(0, visibleCount);
    }
    return initialReleases.filter((rel) => {
      const matchTitle = rel.title.toLowerCase().includes(query);
      const matchVersion = rel.version.toLowerCase().includes(query);
      const matchSummary = rel.summary.toLowerCase().includes(query);
      const matchNotes = rel.detailedNotes.some((note) => note.toLowerCase().includes(query));
      const matchFeature = rel.features.some((feat) => feat.name.toLowerCase().includes(query));
      return matchTitle || matchVersion || matchSummary || matchNotes || matchFeature;
    });
  }, [searchQuery, visibleCount]);

  return (
    <Box sx={{ py: 1 }}>
      {/* Header Container */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: '#0b1c30',
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: '2rem',
            mb: 1
          }}
        >
          Release Notes
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 860 }}>
          Stay updated with the latest product improvements and announcements across the myChron ecosystem.
        </Typography>

        {/* Search & Utility Toolbar (Matches design) */}
        <Card
          sx={{
            mt: 3,
            p: 1.5,
            bgcolor: '#ffffff',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            border: '1px solid rgba(189, 200, 205, 0.4)',
          }}
        >
          {/* Inner Search Field */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: '#ffffff',
              border: '1px solid rgba(189, 200, 205, 0.6)',
              borderRadius: '4px',
              px: 2,
              py: 0.5,
              width: { xs: '100%', md: 380 },
            }}
          >
            <Search sx={{ color: '#6d797d', fontSize: 18, mr: 1 }} />
            <InputBase
              placeholder="Search releases"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ fontSize: '0.9rem', width: '100%', color: '#0b1c30' }}
            />
          </Box>

          {/* Core Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: { xs: '100%', md: 'auto' }, justifyContent: 'flex-end' }}>
            <Button
              onClick={handleExpandAll}
              startIcon={<UnfoldMore />}
              variant="text"
              sx={{
                color: '#3d494c',
                fontSize: '0.85rem',
                fontWeight: 600,
                '&:hover': { color: '#006578', bgcolor: 'rgba(0,101,120,0.04)' }
              }}
            >
              Expand All
            </Button>
            <Button
              onClick={handleCollapseAll}
              startIcon={<UnfoldLess />}
              variant="text"
              sx={{
                color: '#3d494c',
                fontSize: '0.85rem',
                fontWeight: 600,
                '&:hover': { color: '#006578', bgcolor: 'rgba(0,101,120,0.04)' }
              }}
            >
              Collapse All
            </Button>

            <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 0.5, display: { xs: 'none', sm: 'block' } }} />

            <Button
              onClick={handleJumpToLatest}
              startIcon={<ArrowUpward />}
              variant="outlined"
              sx={{
                borderColor: 'rgba(189, 200, 205, 0.8)',
                color: '#3d494c',
                fontSize: '0.85rem',
                bgcolor: '#ffffff',
                fontWeight: 600,
                '&:hover': { borderColor: '#006578', color: '#006578', bgcolor: 'rgba(0,101,120,0.02)' }
              }}
            >
              Jump to Latest
            </Button>
          </Box>
        </Card>

        {/* Showing indicators */}
        <Box sx={{ mt: 1.5, px: 0.5 }}>
          <Typography variant="caption" sx={{ color: 'rgba(11, 28, 48, 0.55)', letterSpacing: '1px', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.725rem' }}>
            {searchQuery ? `Search Results: ${filteredReleases.length} match(es)` : `Showing ${filteredReleases.length} releases`}
          </Typography>
        </Box>
      </Box>

      {/* Main Release Stream Feed */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 6 }}>
        {filteredReleases.map((rel) => {
          const isExpanded = !!expandedMap[rel.id];
          const isLatest = rel.id === '1';

          return (
            <motion.div
              key={rel.id}
              ref={isLatest ? latestReleaseRef : null}
              layout
              transition={{ duration: 0.25 }}
            >
              <Card
                sx={{
                  borderLeft: isLatest ? '4px solid #006578' : '1px solid rgba(189, 200, 205, 0.4)',
                  borderColor: isLatest ? 'rgba(189, 200, 205, 0.4)' : undefined,
                  overflow: 'hidden',
                  bgcolor: '#ffffff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.01)',
                  transition: 'border-color 0.2s',
                  '&:hover': {
                    borderColor: isLatest ? 'rgba(189,200,205, 0.8)' : 'rgba(0,101,120, 0.3)',
                  }
                }}
              >
                {/* Header Strip */}
                <Box
                  onClick={() => toggleExpanded(rel.id)}
                  sx={{
                    p: 2.5,
                    bgcolor: isLatest ? 'rgba(0, 101, 120, 0.03)' : 'transparent',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {/* NEW badge standard matching mockup */}
                    {rel.isNew && (
                      <Chip
                        label="NEW"
                        size="small"
                        sx={{
                          bgcolor: '#0097B2',
                          color: '#ffffff',
                          fontWeight: 700,
                          fontSize: '10px',
                          letterSpacing: '0.5px',
                          borderRadius: '2px',
                          height: '20px',
                        }}
                      />
                    )}
                    {!rel.isNew && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: isExpanded ? '#006578' : 'rgba(189, 200, 205, 0.8)',
                        }}
                      />
                    )}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: isExpanded ? 700 : 500,
                        fontSize: { xs: '0.95rem', md: '1.1rem' },
                        color: isExpanded ? '#0b1c30' : 'text.primary',
                        fontFamily: '"Space Grotesk", sans-serif',
                      }}
                    >
                      {rel.isNew ? `Release - ${rel.version} - ${rel.title}` : `${rel.version} - ${rel.title}`}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#3d494c' }}>
                    <Typography variant="body2" sx={{ fontSize: '0.825rem', display: { xs: 'none', sm: 'inline-block' } }}>
                      {rel.date} &bull; {rel.readTime}
                    </Typography>
                    {isExpanded ? <ExpandLess /> : <ExpandMore />}
                  </Box>
                </Box>

                {/* Smooth detail slide */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Divider />
                      <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                        {/* Summary / Sub-title italic introduction */}
                        <Typography
                          variant="body1"
                          sx={{
                            fontStyle: 'italic',
                            color: 'text.secondary',
                            mb: 3,
                            fontSize: '1rem',
                            lineHeight: 1.6,
                            borderLeft: '2px solid rgba(0, 101, 120, 0.2)',
                            pl: 2
                          }}
                        >
                          {rel.summary}
                        </Typography>

                        <Divider sx={{ my: 3 }} />

                        {/* Detailed Bullet Section */}
                        <Box sx={{ mb: 4 }}>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              color: '#006578',
                              fontWeight: 700,
                              fontFamily: '"Space Grotesk", sans-serif',
                              mb: 2,
                            }}
                          >
                            Detailed Notes
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {rel.detailedNotes.map((note, noteIdx) => (
                              <Box key={noteIdx} sx={{ display: 'flex', alignItems: 'start', gap: 1.5 }}>
                                <CheckCircle sx={{ color: '#006578', fontSize: 18, mt: '3px' }} />
                                <Typography variant="body2" sx={{ color: '#3d494c', fontSize: '0.95rem', lineHeight: 1.5 }}>
                                  {note}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </Box>

                        <Typography variant="body2" sx={{ mb: 4, color: 'text.secondary', fontSize: '0.9rem' }}>
                          Learn more about our{' '}
                          <Typography
                            component="span"
                            onClick={() => {
                              setSnackbarMessage('Forwarding to structural code reference guides...');
                              setSnackbarSeverity('info');
                              setSnackbarOpen(true);
                            }}
                            sx={{
                              color: '#006578',
                              fontWeight: 600,
                              textDecoration: 'underline',
                              cursor: 'pointer',
                              '&:hover': { color: '#008097' },
                              fontSize: 'inheritance'
                            }}
                          >
                            extensible architecture
                          </Typography>{' '}
                          and API endpoints metadata configurations.
                        </Typography>

                        {/* Attribute Table status values */}
                        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid rgba(189, 200, 205, 0.3)', overflow: 'hidden' }}>
                          <Table size="small">
                            <TableHead sx={{ bgcolor: '#eff4ff' }}>
                              <TableRow>
                                <TableCell sx={{ fontWeight: 700, color: '#3d494c', fontSize: '11px', textTransform: 'uppercase', py: 1.2 }}>Feature Module</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#3d494c', fontSize: '11px', textTransform: 'uppercase', py: 1.2 }}>Release Status</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {rel.features.map((feat) => {
                                const isStable = feat.status === 'STABLE';
                                const isBeta = feat.status === 'BETA';
                                return (
                                  <TableRow key={feat.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell sx={{ fontSize: '0.9rem', py: 1.5 }}>{feat.name}</TableCell>
                                    <TableCell sx={{ py: 1.5 }}>
                                      <Chip
                                        label={feat.status}
                                        size="small"
                                        sx={{
                                          fontWeight: 800,
                                          fontSize: '10px',
                                          borderRadius: '3px',
                                          height: '20px',
                                          bgcolor: isStable ? '#e2f7ed' : isBeta ? '#fff4e5' : '#fdeded',
                                          color: isStable ? '#1b4d3e' : isBeta ? '#8a4d00' : '#ba1a1a',
                                        }}
                                      />
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          );
        })}
      </Box>

      {/* Pagination Load older items trigger */}
      {filteredReleases.length > 0 && !searchQuery && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 6, gap: 2 }}>
          <Button
            onClick={handleLoadOlder}
            variant="outlined"
            sx={{
              borderRadius: '24px',
              px: 6,
              py: 1,
              borderColor: 'rgba(189, 200, 205, 0.6)',
              color: '#0b1c30',
              fontWeight: 600,
              bgcolor: '#ffffff',
              '&:hover': {
                borderColor: '#006578',
                color: '#006578',
                bgcolor: 'rgba(0,101,120,0.02)'
              }
            }}
          >
            Load Older Releases
          </Button>

          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <Typography
              onClick={() => {
                setSnackbarMessage('Navigating to standard PDF Archive reports (Historical Release records)...');
                setSnackbarSeverity('info');
                setSnackbarOpen(true);
              }}
              variant="caption"
              sx={{ color: 'text.secondary', cursor: 'pointer', textDecoration: 'underline', '&:hover': { color: '#006578' } }}
            >
              Archived Notes 2025
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(11,28,48,0.2)' }}>&bull;</Typography>
            <Typography
              onClick={() => navigate('/help-center')}
              variant="caption"
              sx={{ color: 'text.secondary', cursor: 'pointer', textDecoration: 'underline', '&:hover': { color: '#006578' } }}
            >
              API Reference Docs
            </Typography>
          </Box>
        </Box>
      )}

      {/* Bento Aesthetic bottom cards section (Newsletter & Help Widgets) */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2.5fr 1.2fr' }, gap: 3 }}>
        {/* Newsletter Signup (Dark container matching screen layout) */}
        <Box>
          <Card
            sx={{
              bgcolor: '#213145', // dark deep slate
              color: '#ffffff',
              borderRadius: '8px',
              p: { xs: 3, md: 4 },
              position: 'relative',
              overflow: 'hidden',
              minHeight: 180,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            {/* Background absolute envelope stamp layout */}
            <Mail
              sx={{
                position: 'absolute',
                right: -30,
                bottom: -30,
                opacity: 0.05,
                transform: 'scale(8)',
                color: '#ffffff'
              }}
            />

            <Box sx={{ position: 'relative', zIndex: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif', color: '#eaf1ff', mb: 1 }}>
                Never miss an update
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, maxWidth: 480, mb: 3 }}>
                Subscribe to our weekly release digest to get technical notes delivered directly to your inbox.
              </Typography>

              <form onSubmit={handleSubscribe}>
                <Box sx={{ display: 'flex', gap: 1.5, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <TextField
                    placeholder="email@company.com"
                    size="small"
                    variant="outlined"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    sx={{
                      flexGrow: 1,
                      bgcolor: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '4px',
                      '& .MuiOutlinedInput-root': {
                        color: '#ffffff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
                        '&.Mui-focused fieldset': { borderColor: '#ffffff' },
                      },
                      input: {
                        '&::placeholder': { color: 'rgba(255, 255, 255, 0.4)', opacity: 1 }
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      bgcolor: '#008097',
                      color: '#ffffff',
                      fontWeight: 700,
                      px: 3,
                      '&:hover': { bgcolor: '#006578' }
                    }}
                  >
                    Subscribe
                  </Button>
                </Box>
              </form>
            </Box>
          </Card>
        </Box>

        {/* Support Help Block (Soft light container) */}
        <Box>
          <Card
            onClick={() => navigate('/help-center')}
            sx={{
              bgcolor: '#e5eeff', // surface-container mockup blue-ish grey
              border: '1px solid rgba(189, 200, 205, 0.4)',
              borderRadius: '8px',
              p: { xs: 3, md: 4 },
              textAlign: 'center',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              transition: '0.2s',
              minHeight: 180,
              '&:hover': {
                bgcolor: '#dce9ff',
                transform: 'translateY(-2px)'
              }
            }}
          >
            {/* Help circle logo icon */}
            <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
              <Help sx={{ color: '#006578', fontSize: 28 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif', color: '#0b1c30', mb: 0.5 }}>
              Need Help?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
              Contact our engineering support team for integration questions.
            </Typography>
          </Card>
        </Box>
      </Box>

      {/* Action triggers notifications messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
