import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  IconButton
} from '@mui/material';
import {
  Speed,
  VerifiedUser,
  BugReport,
  Layers,
  ArrowForward,
  TrendingUp,
  OpenInNew,
  Book,
  Bolt,
  CheckCircleOutlined
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';

import { mockReleases } from '../mockData';

export default function Dashboard() {
  const navigate = useNavigate();

  // Aggregate stats
  const stats = useMemo(() => {
    let totalFeatures = 0;
    let stableFeatures = 0;
    let betaFeatures = 0;
    let alphaFeatures = 0;

    mockReleases.forEach((rel) => {
      totalFeatures += rel.features.length;
      rel.features.forEach((feat) => {
        if (feat.status === 'STABLE') stableFeatures++;
        else if (feat.status === 'BETA') betaFeatures++;
        else if (feat.status === 'ALPHA') alphaFeatures++;
      });
    });

    return {
      releasesCount: mockReleases.length,
      totalFeatures,
      stableFeatures,
      betaFeatures,
      alphaFeatures,
    };
  }, []);

  // Formulate data rows for AG Grid
  const gridRows = useMemo(() => {
    const rows: { name: string; version: string; date: string; category: string; status: string; author: string }[] = [];
    mockReleases.forEach((rel) => {
      rel.features.forEach((feat) => {
        rows.push({
          name: feat.name,
          version: rel.version,
          date: rel.date,
          category: rel.category,
          status: feat.status,
          author: rel.author,
        });
      });
    });
    return rows;
  }, []);

  // AG Grid columns configuration
  const columnDefs: ColDef[] = [
    {
      field: 'name',
      headerName: 'Feature Module',
      sortable: true,
      filter: true,
      minWidth: 180,
      flex: 2,
      cellStyle: { fontWeight: 600, color: '#0b1c30' }
    },
    {
      field: 'version',
      headerName: 'Target Release',
      sortable: true,
      filter: true,
      minWidth: 130,
      flex: 1.2,
      cellRenderer: (params: any) => `v${params.value}`
    },
    {
      field: 'category',
      headerName: 'Project Domain',
      sortable: true,
      filter: true,
      minWidth: 140,
      flex: 1.2
    },
    {
      field: 'status',
      headerName: 'Stability',
      sortable: true,
      filter: true,
      minWidth: 120,
      flex: 1,
      cellRenderer: (params: any) => {
        const val = params.value;
        const color =
          val === 'STABLE'
            ? '#e2f7ed'
            : val === 'BETA'
            ? '#fff4e5'
            : '#fdeded';
        const txtColor =
          val === 'STABLE'
            ? '#1b4d3e'
            : val === 'BETA'
            ? '#8a4d00'
            : '#ba1a1a';
        return (
          <span
            style={{
              backgroundColor: color,
              color: txtColor,
              padding: '2px 8px',
              borderRadius: '3px',
              fontSize: '11px',
              fontWeight: 700,
              display: 'inline-block',
              lineHeight: '1.5'
            }}
          >
            {val}
          </span>
        );
      }
    },
    {
      field: 'author',
      headerName: 'Lead Engineer',
      sortable: true,
      filter: true,
      minWidth: 140,
      flex: 1.5
    }
  ];

  return (
    <Box sx={{ py: 1 }}>
      {/* Welcome Banner */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#0b1c30',
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: { xs: '1.75rem', md: '2.25rem' },
            mb: 1
          }}
        >
          ReleaseHub Workspace
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 800 }}>
          Internal coordination dashboard tracking feature status, deployment logs, stability parameters, and technical announcements for project team members.
        </Typography>
      </Box>

      {/* KPI Cards section */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
        {[
          { label: 'Published Releases', val: stats.releasesCount, icon: <Layers color="primary" />, desc: 'Current active milestones' },
          { label: 'Stable Features', val: stats.stableFeatures, icon: <VerifiedUser color="success" />, desc: 'Validated core features' },
          { label: 'Underactive Beta', val: stats.betaFeatures, icon: <Speed sx={{ color: '#ffdcc0' }} />, desc: 'Early adoption tests' },
          { label: 'Alpha Trials', val: stats.alphaFeatures, icon: <BugReport sx={{ color: '#ba1a1a' }} />, desc: 'Experimental builds' },
        ].map((kpi, idx) => (
          <Box key={kpi.label}>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
            >
              <Card sx={{ bgcolor: '#ffffff', minHeight: 110, position: 'relative', overflow: 'hidden' }}>
                <Box
                  sx={{
                    position: 'absolute',
                    right: -10,
                    top: -10,
                    opacity: 0.04,
                    transform: 'scale(2)'
                  }}
                >
                  {kpi.icon}
                </Box>
                <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                      {kpi.label}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, bgcolor: '#f4f6f8', borderRadius: '50%' }}>
                      {kpi.icon}
                    </Box>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#0b1c30', mb: 0.5 }}>
                    {kpi.val}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {kpi.desc}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Box>
        ))}
      </Box>

      {/* Center Layout split */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2.5fr 1.2fr' }, gap: 3, mb: 4 }}>
        {/* Core Stability Matrix with AG Grid */}
        <Box>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card sx={{ bgcolor: '#ffffff', p: 2.5, minHeight: 460 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#0b1c30', fontSize: '1.1rem' }}>
                    Interactive Feature Matrix
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Granular telemetry on each released change using AG-Grid. Filter and sort below.
                  </Typography>
                </Box>
                <Chip icon={<TrendingUp />} label="Telemetry" size="small" variant="outlined" sx={{ color: '#006578' }} />
              </Box>

              {/* AG GRID CONTAINER */}
              <Box className="ag-theme-alpine" sx={{ height: 350, width: '100%', borderRadius: '4px', overflow: 'hidden' }}>
                <AgGridReact
                  rowData={gridRows}
                  columnDefs={columnDefs}
                  pagination={true}
                  paginationPageSize={10}
                  domLayout="normal"
                />
              </Box>
            </Card>
          </motion.div>
        </Box>

        {/* Secondary Info Stream (Recent Bulletins & Resources) */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Recent Publications */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
          >
            <Card sx={{ bgcolor: '#ffffff', p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0b1c30', fontSize: '1.05rem' }}>
                  Recent Publications
                </Typography>
                <Button
                  onClick={() => navigate('/release-notes')}
                  size="small"
                  variant="text"
                  endIcon={<ArrowForward />}
                  sx={{ color: '#006578' }}
                >
                  View All
                </Button>
              </Box>
              <List sx={{ p: 0 }}>
                {mockReleases.slice(0, 3).map((rel, idx) => (
                  <ListItem key={rel.id} sx={{ px: 0, py: 1, borderBottom: idx < 2 ? '1px solid rgba(0, 0, 0, 0.05)' : 'none' }}>
                    <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                      <CheckCircleOutlined sx={{ color: '#008097', fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>v{rel.version}</Typography>
                          <Typography variant="caption" color="text.secondary">{rel.date}</Typography>
                        </Box>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                          {rel.title} &bull; {rel.readTime}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Card>
          </motion.div>

          {/* Quick Links / Guide cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.32 }}
          >
            <Card sx={{ bgcolor: '#ffffff', p: 2.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                Developer Integration Hub
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {[
                  { label: 'Release API Credentials', desc: 'Secure keys for webhooks', icon: <Bolt color="primary" /> },
                  { label: 'Developer Quickstart Guide', desc: 'Step-by-step connection tutorials', icon: <Book sx={{ color: '#8a4d00' }} /> },
                ].map((elem) => (
                  <Box
                    key={elem.label}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 1.5,
                      borderRadius: '6px',
                      border: '1px solid rgba(0,0,0,0.05)',
                      bgcolor: 'rgba(240, 244, 248, 0.4)',
                      cursor: 'pointer',
                      transition: '0.2s',
                      '&:hover': {
                        bgcolor: 'rgba(0, 101, 120, 0.03)',
                        borderColor: '#006578'
                      }
                    }}
                    onClick={() => {
                      navigate('/help-center');
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                      {elem.icon}
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{elem.label}</Typography>
                        <Typography variant="caption" color="text.secondary">{elem.desc}</Typography>
                      </Box>
                    </Box>
                    <IconButton size="small">
                      <OpenInNew sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Card>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
}
