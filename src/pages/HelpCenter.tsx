import React, { useState, useMemo, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  InputBase,
  Button,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Search,
  ExpandMore,
  CheckCircle,
  UnfoldMore,
  UnfoldLess,
  ArrowUpward
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { mockReleases } from '../mockData';

export default function HelpCenter() {
  const latestReleaseRef = useRef<HTMLDivElement>(null);

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({
    '1': true, // The latest release (id='1') is expanded by default
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'info'>('success');

  // Expand / Collapse single accordion
  const handleAccordionChange = (id: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedMap((prev) => ({
      ...prev,
      [id]: isExpanded,
    }));
  };

  // Expand all visible releases
  const handleExpandAll = () => {
    const nextMap: Record<string, boolean> = {};
    mockReleases.forEach((rel) => {
      nextMap[rel.id] = true;
    });
    setExpandedMap(nextMap);
    setSnackbarMessage('All releases expanded');
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
  };

  // Collapse all visible releases
  const handleCollapseAll = () => {
    setExpandedMap({});
    setSnackbarMessage('All releases collapsed');
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
  };

  // Jump to latest (Scroll target & expand)
  const handleJumpToLatest = () => {
    latestReleaseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setExpandedMap((prev) => ({ ...prev, '1': true }));
    setSnackbarMessage('Navigated to latest release note');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  // Filter releases based on search query
  const filteredReleases = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      return mockReleases;
    }
    return mockReleases.filter((rel) => {
      const matchTitle = rel.title.toLowerCase().includes(query);
      const matchVersion = rel.version.toLowerCase().includes(query);
      const matchSummary = rel.summary.toLowerCase().includes(query);
      const matchNotes = rel.detailedNotes.some((note) => note.toLowerCase().includes(query));
      const matchCategory = rel.category.toLowerCase().includes(query);
      return matchTitle || matchVersion || matchSummary || matchNotes || matchCategory;
    });
  }, [searchQuery]);

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
          Stay updated with latest product improvements.
        </Typography>

        {/* Toolbar Section */}
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
            boxShadow: '0 4px 12px rgba(11,28,48,0.02)',
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: { xs: '100%', md: 'auto' }, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <Button
              onClick={handleExpandAll}
              startIcon={<UnfoldMore />}
              variant="text"
              sx={{
                color: '#3d494c',
                fontSize: '0.85rem',
                fontWeight: 600,
                textTransform: 'none',
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
                textTransform: 'none',
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
                textTransform: 'none',
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

      {/* Main Release Accordion Stream List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 6 }}>
        {filteredReleases.map((rel) => {
          const isExpanded = !!expandedMap[rel.id];
          const isLatest = rel.id === '1';

          return (
            <motion.div
              key={rel.id}
              ref={isLatest ? latestReleaseRef : null}
              layout
              transition={{ duration: 0.2 }}
            >
              <Accordion
                expanded={isExpanded}
                onChange={handleAccordionChange(rel.id)}
                sx={{
                  border: '1px solid rgba(189, 200, 205, 0.4)',
                  borderLeft: isLatest ? '4px solid #006578' : '1px solid rgba(189, 200, 205, 0.4)',
                  boxShadow: 'none',
                  '&:before': {
                    display: 'none',
                  },
                  mb: 2,
                  borderRadius: '6px !important',
                  overflow: 'hidden',
                  bgcolor: '#ffffff',
                }}
              >
                {/* Accordion Summary/Header */}
                <AccordionSummary
                  expandIcon={<ExpandMore sx={{ color: isLatest ? '#006578' : '#6d797d' }} />}
                  sx={{
                    px: 3,
                    py: 1,
                    bgcolor: isLatest ? 'rgba(0, 101, 120, 0.03)' : 'transparent',
                    '& .MuiAccordionSummary-content': {
                      alignItems: 'center',
                      gap: 2,
                    },
                  }}
                >
                  {/* Latest release gets NEW badge */}
                  {isLatest && rel.isNew && (
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

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: isExpanded ? 700 : 500,
                      fontSize: { xs: '0.95rem', md: '1.05rem' },
                      color: isExpanded ? '#0b1c30' : 'text.primary',
                      fontFamily: '"Space Grotesk", sans-serif',
                      flexGrow: 1,
                    }}
                  >
                    {isLatest ? `Release - ${rel.version} - ${rel.title}` : `${rel.version} - ${rel.title}`}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.8rem',
                      display: { xs: 'none', sm: 'inline-block' },
                      mr: 1
                    }}
                  >
                    {rel.date} &bull; {rel.readTime}
                  </Typography>
                </AccordionSummary>

                {/* Accordion Content Details */}
                <AccordionDetails sx={{ p: { xs: 2.5, md: 4 }, bgcolor: '#ffffff' }}>
                  {/* Summary Overview */}
                  <Typography
                    variant="body1"
                    sx={{
                      fontStyle: 'italic',
                      color: 'text.secondary',
                      mb: 3,
                      fontSize: '0.95rem',
                      lineHeight: 1.6,
                      borderLeft: '2px solid rgba(0, 101, 120, 0.2)',
                      pl: 2
                    }}
                  >
                    {rel.summary}
                  </Typography>

                  <Divider sx={{ my: 3 }} />

                  {/* Bulleted Change lists */}
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
                      Detailed Changes
                    </Typography>
                    <Stack spacing={1.5}>
                      {rel.detailedNotes.map((note, noteIdx) => (
                        <Box key={noteIdx} sx={{ display: 'flex', alignItems: 'start', gap: 1.5 }}>
                          <CheckCircle sx={{ color: '#006578', fontSize: 18, mt: '3px' }} />
                          <Typography variant="body2" sx={{ color: '#3d494c', fontSize: '0.95rem', lineHeight: 1.5 }}>
                            {note}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>

                  {/* Feature status table */}
                  {rel.features && rel.features.length > 0 && (
                    <Box>
                      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid rgba(189, 200, 205, 0.3)', overflow: 'hidden' }}>
                        <Table size="small">
                          <TableHead sx={{ bgcolor: '#f8fafc' }}>
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
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            </motion.div>
          );
        })}
      </Box>

      {/* Snackbar alerts */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%', borderRadius: '4px' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
