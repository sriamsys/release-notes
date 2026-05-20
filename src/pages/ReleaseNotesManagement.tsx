import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Snackbar,
  Alert,
  Tooltip,
  Drawer,
  Checkbox,
  FormControlLabel,
  Popover,
  CircularProgress,
  List,
  ListItem,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  FormControl,
  InputLabel,
  TextField,
} from '@mui/material';
import {
  Search,
  FilterList,
  ViewColumn,
  Refresh,
  Add,
  MoreVert,
  Visibility,
  Edit,
  Delete,
  CheckCircle,
  Close,
  Fullscreen,
  FullscreenExit,
  Campaign,
  Check,
  ContentCopy,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { ReleaseStorageService, StoreRelease } from '../lib/ReleaseStorageService';

const PRESET_COLORS = [
  '#006578', // Deep Teal
  '#0b1c30', // Navy slate
  '#1b4d3e', // Forest Green
  '#7b1fa2', // Royal Purple
  '#8a4d00', // Amber Glow
  '#ba1a1a', // Crimson
];

const PRESET_IMAGES = [
  { label: 'Wave Gradient', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80' },
  { label: 'Tech Mesh', url: 'https://images.unsplash.com/photo-1618005198143-e5283464303b?auto=format&fit=crop&w=600&q=80' },
  { label: 'Abstract 3D', url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80' },
  { label: 'Neon Cyber', url: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=600&q=80' }
];

export default function ReleaseNotesManagement() {
  const navigate = useNavigate();

  // Primary data state
  const [releases, setReleases] = useState<StoreRelease[]>([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Published' | 'Draft' | 'Scheduled'>('All');
  const [audienceFilter, setAudienceFilter] = useState<'All' | 'All Users' | 'Internal' | 'Partners' | 'External'>('All');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load and refresh handler
  const loadData = () => {
    setReleases(ReleaseStorageService.getAll());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Column Visibility States
  const [visibleColumns, setVisibleColumns] = useState({
    version: true,
    title: true,
    author: true,
    publishedDate: true,
    status: true,
    updatedAt: true,
    actions: true,
  });

  // Action Menu States
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRelease, setSelectedRelease] = useState<null | StoreRelease>(null);

  // Popovers & Drawers
  const [columnAnchorEl, setColumnAnchorEl] = useState<null | HTMLElement>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [previewRelease, setPreviewRelease] = useState<null | StoreRelease>(null);

  // Delete Confirm Dialog states
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [releaseToDelete, setReleaseToDelete] = useState<null | StoreRelease>(null);

  // Modal and Fullscreen states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  // Form state fields
  const [formVersion, setFormVersion] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formAudience, setFormAudience] = useState<'All Users' | 'Internal' | 'Partners' | 'External'>('All Users');
  const [formStatus, setFormStatus] = useState<'Published' | 'Draft' | 'Scheduled'>('Draft');
  const [formSummary, setFormSummary] = useState('');
  const [contentEditorText, setContentEditorText] = useState('');

  // Appearance - Hero style
  const [heroColor, setHeroColor] = useState('#006578');
  const [customColor, setCustomColor] = useState('');
  const [heroImageUrl, setHeroImageUrl] = useState(PRESET_IMAGES[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');

  // Toasters
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastSeverity, setToastSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('success');

  // AG Grid API Reference
  const gridApiRef = useRef<GridApi | null>(null);

  const handleOpenActionMenu = (event: React.MouseEvent<HTMLButtonElement>, release: StoreRelease) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedRelease(release);
  };

  const handleCloseActionMenu = () => {
    setMenuAnchorEl(null);
    setSelectedRelease(null);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      loadData();
      setIsRefreshing(false);
      showToast('Datagrid refreshed successfully!', 'success');
    }, 500);
  };

  const showToast = (msg: string, severity: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastSeverity(severity);
  };

  // Filter application
  const filteredRows = useMemo(() => {
    return releases.filter((rel) => {
      const matchesSearch =
        (rel.title || '').toLowerCase().includes(searchText.toLowerCase()) ||
        (rel.version || '').toLowerCase().includes(searchText.toLowerCase()) ||
        (rel.summary || '').toLowerCase().includes(searchText.toLowerCase()) ||
        (rel.author || '').toLowerCase().includes(searchText.toLowerCase());

      const matchesStatus = statusFilter === 'All' || rel.status === statusFilter;
      const matchesAudience = audienceFilter === 'All' || rel.audience === audienceFilter;

      return matchesSearch && matchesStatus && matchesAudience;
    });
  }, [releases, searchText, statusFilter, audienceFilter]);

  // Actions click handlers
  const handleView = () => {
    if (selectedRelease) {
      setPreviewRelease(selectedRelease);
    }
    handleCloseActionMenu();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateRelease = () => {
    setModalMode('create');
    setFormVersion('');
    setFormTitle('');
    setFormAudience('All Users');
    setFormStatus('Draft');
    setFormSummary('');
    setContentEditorText('');
    setHeroColor('#006578');
    setCustomColor('');
    setHeroImageUrl(PRESET_IMAGES[0].url);
    setCustomImageUrl('');
    setIsMaximized(false);
    setIsModalOpen(true);
  };

  const handleEdit = () => {
    if (selectedRelease) {
      setModalMode('edit');
      setFormVersion(selectedRelease.version || '');
      setFormTitle(selectedRelease.title || '');
      setFormAudience(selectedRelease.audience || 'All Users');
      setFormStatus(selectedRelease.status || 'Draft');
      setFormSummary(selectedRelease.summary || '');
      setContentEditorText(selectedRelease.content || '');
      setHeroColor(selectedRelease.heroColor || '#006578');
      
      const isPresetColor = PRESET_COLORS.includes(selectedRelease.heroColor || '');
      setCustomColor(selectedRelease.heroColor && !isPresetColor ? selectedRelease.heroColor : '');
      
      const isPresetImage = PRESET_IMAGES.some(img => img.url === selectedRelease.heroImage);
      setHeroImageUrl(selectedRelease.heroImage || PRESET_IMAGES[0].url);
      setCustomImageUrl(selectedRelease.heroImage && !isPresetImage ? selectedRelease.heroImage : '');
      
      setIsMaximized(false);
      setIsModalOpen(true);
    }
    handleCloseActionMenu();
  };

  const handleDuplicate = () => {
    if (selectedRelease) {
      const original = selectedRelease;
      const duplicateData: Omit<StoreRelease, 'id' | 'createdAt' | 'updatedAt'> = {
        version: `${original.version}-copy`,
        title: `${original.title} (Copy)`,
        audience: original.audience || 'All Users',
        summary: original.summary || '',
        content: original.content || '',
        status: 'Draft', // duplicated initially as copy draft
        author: original.author || 'Sarah Jenkins',
        publishedDate: new Date().toISOString().split('T')[0],
        heroStyle: original.heroStyle || 'preset',
        heroColor: original.heroColor || '#006578',
        heroImage: original.heroImage || PRESET_IMAGES[0].url,
      };

      ReleaseStorageService.create(duplicateData);
      loadData();
      showToast(`Duplicated release v${original.version} as Draft!`, 'success');
    }
    handleCloseActionMenu();
  };

  const handleDeleteRequest = () => {
    if (selectedRelease) {
      setReleaseToDelete(selectedRelease);
      setIsDeleteConfirmOpen(true);
    }
    handleCloseActionMenu();
  };

  const handleConfirmDelete = () => {
    if (releaseToDelete) {
      ReleaseStorageService.delete(releaseToDelete.id);
      showToast(`Release communication v${releaseToDelete.version} deleted from log.`, 'warning');
      loadData();
    }
    setIsDeleteConfirmOpen(false);
    setReleaseToDelete(null);
  };

  const handleSaveRelease = () => {
    if (!formVersion.trim()) {
      showToast('Version code is required', 'error');
      return;
    }
    if (!formTitle.trim()) {
      showToast('Release Title is required', 'error');
      return;
    }

    const finalColor = customColor ? customColor : heroColor;
    const finalImageUrl = customImageUrl ? customImageUrl : heroImageUrl;

    const payload = {
      version: formVersion.trim(),
      title: formTitle.trim(),
      audience: formAudience,
      publishedDate: new Date().toISOString().split('T')[0],
      status: formStatus,
      author: selectedRelease && modalMode === 'edit' ? selectedRelease.author : 'Sarah Jenkins',
      summary: formSummary.trim(),
      content: contentEditorText,
      heroStyle: customColor || customImageUrl ? 'custom' : 'preset',
      heroColor: finalColor,
      heroImage: finalImageUrl,
    };

    if (modalMode === 'create') {
      ReleaseStorageService.create(payload);
      showToast(`Successfully created release v${formVersion}!`, 'success');
    } else {
      if (!selectedRelease) return;
      ReleaseStorageService.update(selectedRelease.id, payload);
      showToast(`Successfully updated release v${formVersion}!`, 'success');
    }

    loadData();
    setIsModalOpen(false);
  };

  // AG Grid column definitions
  const columnDefs = useMemo<ColDef[]>(() => {
    return [
      {
        field: 'version',
        headerName: 'Version',
        sortable: true,
        filter: true,
        minWidth: 120,
        flex: 1,
        hide: !visibleColumns.version,
        cellRenderer: (params: any) => (
          <span
            style={{ fontWeight: 700, color: '#006578', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={(e) => {
              e.stopPropagation();
              navigate('/release-notes');
            }}
          >
            v{params.value}
          </span>
        ),
      },
      {
        field: 'title',
        headerName: 'Title',
        sortable: true,
        filter: true,
        minWidth: 200,
        flex: 2,
        hide: !visibleColumns.title,
        cellStyle: { fontWeight: 600, color: '#0b1c30' },
      },
      {
        field: 'author',
        headerName: 'Author',
        sortable: true,
        filter: true,
        minWidth: 120,
        flex: 1,
        hide: !visibleColumns.author,
        cellStyle: { color: '#6d797d' },
      },
      {
        field: 'publishedDate',
        headerName: 'Published Date',
        sortable: true,
        filter: true,
        minWidth: 140,
        flex: 1.2,
        hide: !visibleColumns.publishedDate,
      },
      {
        field: 'status',
        headerName: 'Status',
        sortable: true,
        filter: true,
        minWidth: 120,
        flex: 1,
        hide: !visibleColumns.status,
        cellRenderer: (params: any) => {
          const val = params.value;
          const bg =
            val === 'Published'
              ? '#e2f7ed'
              : val === 'Draft'
              ? '#fff4e5'
              : '#e8f0fe';
          const fg =
            val === 'Published'
              ? '#1b4d3e'
              : val === 'Draft'
              ? '#8a4d00'
              : '#1a73e8';
          return (
            <span
              style={{
                backgroundColor: bg,
                color: fg,
                padding: '3px 9px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 700,
                display: 'inline-block',
                lineHeight: '1.4'
              }}
            >
              {val}
            </span>
          );
        },
      },
      {
        field: 'updatedAt',
        headerName: 'Updated Date',
        sortable: true,
        filter: true,
        minWidth: 150,
        flex: 1.2,
        hide: !visibleColumns.updatedAt,
        cellRenderer: (params: any) => {
          if (!params.value) return '-';
          try {
            return new Date(params.value).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });
          } catch (e) {
            return params.value;
          }
        }
      },
      {
        headerName: 'Actions',
        field: 'actions',
        sortable: false,
        filter: false,
        minWidth: 80,
        flex: 0.8,
        hide: !visibleColumns.actions,
        cellRenderer: (params: any) => {
          return (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenActionMenu(e, params.data);
              }}
              sx={{ p: 0.5 }}
            >
              <MoreVert fontSize="small" />
            </IconButton>
          );
        },
      },
    ];
  }, [visibleColumns, navigate]);

  const onGridReady = (params: GridReadyEvent) => {
    gridApiRef.current = params.api;
  };

  const handleToggleColumn = (col: keyof typeof visibleColumns) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [col]: !prev[col],
    }));
  };

  return (
    <Box sx={{ py: 1 }}>
      {/* HEADER SECTION */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          mb: 4,
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#0b1c30',
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              mb: 0.5,
            }}
          >
            Release Notes Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create, edit, and organize product release bulletins in real-time.
          </Typography>
        </Box>
        {releases.length > 0 && (
          <Button
            variant="contained"
            onClick={handleCreateRelease}
            startIcon={<Add />}
            sx={{
              py: 1.2,
              px: 2.5,
              fontWeight: 600,
              borderRadius: '6px',
              textTransform: 'none',
              bgcolor: '#006578',
              '&:hover': { bgcolor: '#008097' },
            }}
          >
            Create Release
          </Button>
        )}
      </Box>

      {releases.length > 0 && (
        <>
          {/* TOOLBAR */}
          <Card
            sx={{
              bgcolor: '#ffffff',
              p: 2,
              mb: 3,
              boxShadow: '0 4px 12px rgba(11,28,48,0.02)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'stretch', md: 'center' },
                gap: 2,
              }}
            >
              {/* Left search */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: '#ffffff',
                  border: '1px solid rgba(189, 200, 205, 0.6)',
                  borderRadius: '6px',
                  px: 2,
                  py: 0.5,
                  width: '100%',
                  maxWidth: { md: 500 },
                }}
              >
                <Search sx={{ color: '#6d797d', fontSize: 18, mr: 1 }} />
                <InputBase
                  placeholder="Search by version, title, author, or category summary..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  sx={{ fontSize: '0.9rem', width: '100%', color: '#0b1c30' }}
                />
              </Box>

              {/* Toolbar Buttons: Filters, Columns, Refresh */}
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                {/* Filter Trigger */}
                <Button
                  variant="outlined"
                  onClick={(e) => setFilterAnchorEl(e.currentTarget)}
                  startIcon={<FilterList />}
                  sx={{
                    textTransform: 'none',
                    borderColor: 'rgba(0,0,0,0.12)',
                    color: '#213145',
                    '&:hover': {
                      borderColor: '#006578',
                      bgcolor: 'rgba(0,101,120,0.04)',
                    },
                  }}
                >
                  Filters
                  {(statusFilter !== 'All' || audienceFilter !== 'All') && (
                    <Chip
                      label="Active"
                      size="small"
                      color="warning"
                      sx={{ ml: 1, height: 18, fontSize: '10px', fontWeight: 700 }}
                    />
                  )}
                </Button>

                {/* Column Trigger */}
                <Button
                  variant="outlined"
                  onClick={(e) => setColumnAnchorEl(e.currentTarget)}
                  startIcon={<ViewColumn />}
                  sx={{
                    textTransform: 'none',
                    borderColor: 'rgba(0,0,0,0.12)',
                    color: '#213145',
                    '&:hover': {
                      borderColor: '#006578',
                      bgcolor: 'rgba(0,101,120,0.04)',
                    },
                  }}
                >
                  Columns
                </Button>

                {/* Refresh Grid */}
                <Tooltip title="Reset View & Refresh grid row data">
                  <Button
                    variant="outlined"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    sx={{
                      minWidth: 44,
                      width: 44,
                      p: 0,
                      borderColor: 'rgba(0,0,0,0.12)',
                      color: '#213145',
                      '&:hover': {
                        borderColor: '#006578',
                        bgcolor: 'rgba(0,101,120,0.04)',
                      },
                    }}
                  >
                    {isRefreshing ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <Refresh />
                    )}
                  </Button>
                </Tooltip>
              </Box>
            </Box>
          </Card>

          {/* FILTER POPOVER */}
          <Popover
            open={Boolean(filterAnchorEl)}
            anchorEl={filterAnchorEl}
            onClose={() => setFilterAnchorEl(null)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            slotProps={{
              paper: {
                sx: { p: 2.5, width: 280, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' },
              },
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
              Filter Release Records
            </Typography>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 600 }}>
              STATUS
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              {['All', 'Published', 'Draft', 'Scheduled'].map((st) => (
                <Chip
                  key={st}
                  label={st}
                  onClick={() => setStatusFilter(st as any)}
                  color={statusFilter === st ? 'primary' : 'default'}
                  variant={statusFilter === st ? 'filled' : 'outlined'}
                  size="small"
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 600 }}>
              AUDIENCE
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              {['All', 'All Users', 'Internal', 'Partners', 'External'].map((aud) => (
                <Chip
                  key={aud}
                  label={aud}
                  onClick={() => setAudienceFilter(aud as any)}
                  color={audienceFilter === aud ? 'primary' : 'default'}
                  variant={audienceFilter === aud ? 'filled' : 'outlined'}
                  size="small"
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>

            <Divider sx={{ my: 1.5 }} />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                size="small"
                onClick={() => {
                  setStatusFilter('All');
                  setAudienceFilter('All');
                  setFilterAnchorEl(null);
                }}
                sx={{ textTransform: 'none', color: '#ba1a1a' }}
              >
                Clear Filters
              </Button>
            </Box>
          </Popover>

          {/* COLUMNS POPOVER */}
          <Popover
            open={Boolean(columnAnchorEl)}
            anchorEl={columnAnchorEl}
            onClose={() => setColumnAnchorEl(null)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            slotProps={{
              paper: {
                sx: { p: 2, width: 220, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' },
              },
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
              Show / Hide Columns
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {Object.keys(visibleColumns).map((col) => (
                <FormControlLabel
                  key={col}
                  control={
                    <Checkbox
                      checked={visibleColumns[col as keyof typeof visibleColumns]}
                      onChange={() => handleToggleColumn(col as keyof typeof visibleColumns)}
                      color="primary"
                      size="small"
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {col === 'publishedDate' ? 'Published Date' : col === 'updatedAt' ? 'Updated Date' : col}
                    </Typography>
                  }
                />
              ))}
            </Box>
          </Popover>
        </>
      )}

      {/* CORE DATAGRID AREA OR EMPTY STATE */}
      {releases.length === 0 ? (
        <Card
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 8,
            textAlign: 'center',
            bgcolor: '#ffffff',
            boxShadow: '0 4px 12px rgba(11,28,48,0.02)',
            border: '1px solid rgba(0,0, 0, 0.05)',
            borderRadius: '8px',
          }}
        >
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              bgcolor: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
            }}
          >
            <Campaign sx={{ fontSize: 60, color: '#94a3b8' }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#0b1c30', mb: 1, fontFamily: '"Space Grotesk", sans-serif' }}>
            No releases found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 440, mb: 3 }}>
            All project schemas have been reset. Click below to draft and persist your first release note.
          </Typography>
          <Button
            variant="contained"
            onClick={handleCreateRelease}
            startIcon={<Add />}
            sx={{
              py: 1.2,
              px: 4,
              fontWeight: 600,
              borderRadius: '6px',
              textTransform: 'none',
              bgcolor: '#006578',
              '&:hover': { bgcolor: '#008097' },
            }}
          >
            Create Release
          </Button>
        </Card>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card
            sx={{
              bgcolor: '#ffffff',
              boxShadow: '0 4px 12px rgba(11,28,48,0.02)',
              border: '1px solid rgba(0,0, 0, 0.05)',
              p: 1,
              mb: 4,
            }}
          >
            {/* AG Grid element wrapper */}
            <Box className="ag-theme-alpine" sx={{ height: 480, width: '100%', overflow: 'hidden' }}>
              <AgGridReact
                rowData={filteredRows}
                columnDefs={columnDefs}
                pagination={true}
                paginationPageSize={10}
                onGridReady={onGridReady}
                domLayout="normal"
                overlayNoRowsTemplate="<span style='padding: 10px; font-weight: 500; font-size: 14px; color: #6d797d;'>No matching releases found matching filters.</span>"
              />
            </Box>
          </Card>
        </motion.div>
      )}

      {/* THREE DOT ACTIONS MENU */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseActionMenu}
        elevation={3}
        slotProps={{
          paper: {
            sx: { minWidth: 160, borderRadius: '6px' },
          },
        }}
      >
        <MenuItem onClick={handleView}>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <Visibility fontSize="small" sx={{ color: '#006578' }} />
          </ListItemIcon>
          <ListItemText primary="View Details" />
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <Edit fontSize="small" sx={{ color: '#8a4d00' }} />
          </ListItemIcon>
          <ListItemText primary="Edit Release" />
        </MenuItem>
        <MenuItem onClick={handleDuplicate}>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <ContentCopy fontSize="small" sx={{ color: '#1b4d3e' }} />
          </ListItemIcon>
          <ListItemText primary="Duplicate" />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDeleteRequest} sx={{ color: '#ba1a1a' }}>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <Delete fontSize="small" sx={{ color: '#ba1a1a' }} />
          </ListItemIcon>
          <ListItemText primary="Delete" />
        </MenuItem>
      </Menu>

      {/* CREATE / EDIT POPUP FULL BANNER DIALOG */}
      <Dialog
        open={isModalOpen}
        onClose={(_e, reason) => {
          // Modal closes ONLY using X or Cancel (ignored backdrop/escape clicks)
          if (reason === 'escapeKeyDown' || reason === 'backdropClick') return;
        }}
        fullWidth
        maxWidth={isMaximized ? 'xl' : 'md'}
        slotProps={{
          paper: {
            sx: {
              borderRadius: isMaximized ? 0 : '8px',
              m: isMaximized ? 0 : 2,
              transition: 'all 0.3s ease',
              height: isMaximized ? '100vh' : 'auto',
              maxHeight: isMaximized ? '100vh' : '90vh',
              display: 'flex',
              flexDirection: 'column',
            }
          }
        }}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 2.5,
            bgcolor: '#0b1c30',
            color: '#ffffff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Campaign sx={{ color: '#0097B2' }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff', fontFamily: '"Space Grotesk", sans-serif' }}>
              {modalMode === 'create' ? 'Create Release Communication' : 'Edit Release Communication'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Tooltip title={isMaximized ? "Restore Layout" : "Maximize view"}>
              <IconButton onClick={() => setIsMaximized(!isMaximized)} size="small" sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#ffffff' } }}>
                {isMaximized ? <FullscreenExit fontSize="medium" /> : <Fullscreen fontSize="medium" />}
              </IconButton>
            </Tooltip>
            <IconButton onClick={handleCloseModal} size="small" sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#ffffff' } }}>
              <Close fontSize="medium" />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3, flexGrow: 1, overflowY: 'auto', bgcolor: '#f8f9ff' }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            {/* LEFT SIDE (Content & Details) */}
            <Box sx={{ flex: { xs: '1', md: '2' }, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                label="Release Title"
                placeholder="e.g. Navigation Drawer Optimizations"
                variant="outlined"
                fullWidth
                size="small"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                sx={{ bgcolor: '#ffffff' }}
              />

              <TextField
                label="Overview Summary"
                placeholder="Brief summary explaining what this release represents..."
                variant="outlined"
                fullWidth
                multiline
                rows={2}
                size="small"
                value={formSummary}
                onChange={(e) => setFormSummary(e.target.value)}
                sx={{ bgcolor: '#ffffff' }}
              />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0b1c30' }}>
                  Detailed Release Notes Content (Rich Text WYSIWYG)
                </Typography>
                <ReactQuill
                  theme="snow"
                  value={contentEditorText}
                  onChange={setContentEditorText}
                  placeholder="Draft release elements, bullet summaries under this deployment..."
                  style={{
                    backgroundColor: '#ffffff',
                    minHeight: isMaximized ? '420px' : '220px',
                    borderRadius: '8px',
                    marginBottom: '50px' // accounts for Quill status bar heights
                  }}
                />
              </Box>
            </Box>

            {/* RIGHT SIDE (Settings & Theme Metadata) */}
            <Box sx={{ flex: { xs: '1', md: '1.2' }, display: 'flex', flexDirection: 'column', gap: 2.5, borderLeft: { md: '1px dashed rgba(0,0,0,0.1)' }, pl: { md: 3 } }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#006578', mb: -1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Distribution Meta
              </Typography>

              <TextField
                label="Version Code"
                placeholder="e.g. 2026.05.20"
                variant="outlined"
                fullWidth
                size="small"
                value={formVersion}
                onChange={(e) => setFormVersion(e.target.value)}
                sx={{ bgcolor: '#ffffff' }}
              />

              <FormControl fullWidth size="small">
                <InputLabel id="audience-select-label">Target Audience</InputLabel>
                <Select
                  labelId="audience-select-label"
                  label="Target Audience"
                  value={formAudience}
                  onChange={(e) => setFormAudience(e.target.value as any)}
                  sx={{ bgcolor: '#ffffff' }}
                >
                  <MenuItem value="All Users">All Users (Public)</MenuItem>
                  <MenuItem value="Internal">Internal Team Only</MenuItem>
                  <MenuItem value="Partners">Enterprise Partners</MenuItem>
                  <MenuItem value="External">External Sandbox clients</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel id="status-select-label">Deployment Status</InputLabel>
                <Select
                  labelId="status-select-label"
                  label="Deployment Status"
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as any)}
                  sx={{ bgcolor: '#ffffff' }}
                >
                  <MenuItem value="Published">Published (Active Live)</MenuItem>
                  <MenuItem value="Draft">Draft (In-review)</MenuItem>
                  <MenuItem value="Scheduled">Scheduled (Ready)</MenuItem>
                </Select>
              </FormControl>

              <Divider sx={{ my: 1 }} />

              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#006578', mb: -1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Appearance Settings
              </Typography>

              {/* Color pickers */}
              <Box>
                <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 600, color: 'text.secondary' }}>
                  Hero Theme Background Color
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1.5 }}>
                  {PRESET_COLORS.map((col) => (
                    <Box
                      key={col}
                      onClick={() => {
                        setHeroColor(col);
                        setCustomColor('');
                      }}
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        bgcolor: col,
                        cursor: 'pointer',
                        border: heroColor === col && !customColor ? '3px solid #000' : '1px solid rgba(0,0,0,0.15)',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {heroColor === col && !customColor && <Check sx={{ color: '#fff', fontSize: 13 }} />}
                    </Box>
                  ))}
                </Box>
                <TextField
                  label="Custom Hex Color"
                  placeholder="e.g. #ff4d4d"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={customColor}
                  onChange={(e) => {
                    setCustomColor(e.target.value);
                    setHeroColor(e.target.value);
                  }}
                  sx={{ bgcolor: '#ffffff' }}
                />
              </Box>

              {/* Cover background */}
              <Box>
                <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 600, color: 'text.secondary' }}>
                  Hero Cover Illustration Image
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
                    {PRESET_IMAGES.map((img) => (
                      <Box
                        key={img.label}
                        onClick={() => {
                          setHeroImageUrl(img.url);
                          setCustomImageUrl('');
                        }}
                        sx={{
                          height: 52,
                          borderRadius: '4px',
                          backgroundImage: `url(${img.url})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          cursor: 'pointer',
                          border: heroImageUrl === img.url && !customImageUrl ? '3px solid #006578' : '1px solid rgba(0,0,0,0.1)',
                          display: 'flex',
                          alignItems: 'flex-end',
                          p: 0.5,
                        }}
                      >
                        <Typography variant="caption" sx={{ color: '#fff', bgcolor: 'rgba(0,0,0,0.6)', px: 0.5, py: 0.1, borderRadius: '2px', fontSize: '9px', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {img.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  <TextField
                    label="Custom Image URL"
                    placeholder="https://..."
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={customImageUrl}
                    onChange={(e) => {
                      setCustomImageUrl(e.target.value);
                      setHeroImageUrl(e.target.value);
                    }}
                    sx={{ bgcolor: '#ffffff' }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, bgcolor: '#f1f5f9', gap: 1.5 }}>
          <Button
            onClick={handleCloseModal}
            variant="text"
            sx={{ textTransform: 'none', fontWeight: 600, color: '#3d494c' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveRelease}
            variant="contained"
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              bgcolor: '#006578',
              '&:hover': { bgcolor: '#008097' },
              px: 4
            }}
          >
            {modalMode === 'create' ? 'Publish Release' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* CONFIRM DELETE MODICAL */}
      <Dialog
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#ba1a1a', color: '#ffffff' }}>
          <Delete /> Confirm Deletion
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 4 }}>
          {releaseToDelete && (
            <Typography variant="body1" sx={{ color: '#0s1c30', mt: 2 }}>
              Are you sure you want to permanently delete Release Note <strong>v{releaseToDelete.version} - {releaseToDelete.title}</strong>? This action is irreversible.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: '#f1f5f9' }}>
          <Button onClick={() => setIsDeleteConfirmOpen(false)} sx={{ textTransform: 'none', color: '#3d494c', fontWeight: 600 }}>
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error" sx={{ textTransform: 'none', fontWeight: 600 }}>
            Yes, Delete Note
          </Button>
        </DialogActions>
      </Dialog>

      {/* EXTRA DRAWER: VIEW DETAILS PANEL */}
      <Drawer
        anchor="right"
        open={Boolean(previewRelease)}
        onClose={() => setPreviewRelease(null)}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 480 },
            p: 4,
            bgcolor: '#ffffff',
          },
        }}
      >
        {previewRelease && (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Chip
                label={`Version ${previewRelease.version}`}
                color="primary"
                size="small"
                sx={{ fontWeight: 700, bgcolor: '#006578' }}
              />
              <IconButton onClick={() => setPreviewRelease(null)} size="small">
                <Close />
              </IconButton>
            </Box>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: '#0b1c30',
                fontFamily: '"Space Grotesk", sans-serif',
                mb: 1.5,
              }}
            >
              {previewRelease.title}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
              <Chip
                label={previewRelease.audience || 'All Users'}
                size="small"
                sx={{ bgcolor: '#e8f0fe', color: '#1a73e8', fontWeight: 600, fontSize: '11px' }}
              />
              <Chip
                label={previewRelease.status}
                size="small"
                color={
                  previewRelease.status === 'Published'
                    ? 'success'
                    : previewRelease.status === 'Draft'
                    ? 'warning'
                    : 'info'
                }
                variant="outlined"
                sx={{ fontWeight: 700, fontSize: '11px', height: 24 }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
                {previewRelease.publishedDate}
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0b1c30', mb: 1 }}>
                Overview Summary
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6, fontStyle: 'italic' }}>
                {previewRelease.summary}
              </Typography>

              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0b1c30', mb: 1.5 }}>
                Key Technical Changes
              </Typography>
              
              {previewRelease.content ? (
                <Box
                  sx={{
                    fontSize: '14px',
                    lineHeight: '1.6',
                    color: '#3d494c',
                    '& h3': { fontSize: '1.1rem', fontWeight: 700, mt: 1.5, mb: 1, color: '#0b1c30' },
                    '& p': { mb: 1.5 },
                    '& ul': { pl: 3, listStyleType: 'disc', mb: 1.5 },
                    '& li': { mb: 0.5 }
                  }}
                  dangerouslySetInnerHTML={{ __html: previewRelease.content }}
                />
              ) : (
                <Typography variant="body2" color="text.secondary">No detailed changes compiled yet.</Typography>
              )}

              <Box
                sx={{
                  bgcolor: '#f4f6f8',
                  p: 2.5,
                  borderRadius: '6px',
                  border: '1px solid rgba(0,0,0,0.04)',
                  mt: 4
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 700 }}>
                  META DETAILS
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  <strong>Author:</strong> {previewRelease.author}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Created:</strong> {previewRelease.createdAt ? new Date(previewRelease.createdAt).toLocaleDateString() : previewRelease.publishedDate}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Button
              variant="outlined"
              fullWidth
              onClick={() => {
                const target = previewRelease;
                setPreviewRelease(null);
                setSelectedRelease(target);
                
                setModalMode('edit');
                setFormVersion(target.version);
                setFormTitle(target.title);
                setFormAudience(target.audience || 'All Users');
                setFormStatus(target.status);
                setFormSummary(target.summary || '');
                setContentEditorText(target.content || '');
                setHeroColor(target.heroColor || '#006578');
                
                const isPresetColor = PRESET_COLORS.includes(target.heroColor || '');
                setCustomColor(target.heroColor && !isPresetColor ? target.heroColor : '');
                
                const isPresetImage = PRESET_IMAGES.some(img => img.url === target.heroImage);
                setHeroImageUrl(target.heroImage || PRESET_IMAGES[0].url);
                setCustomImageUrl(target.heroImage && !isPresetImage ? target.heroImage : '');
                
                setIsMaximized(false);
                setIsModalOpen(true);
              }}
              startIcon={<Edit />}
              sx={{ py: 1, textTransform: 'none', borderColor: '#006578', color: '#006578' }}
            >
              Configure or Edit Release
            </Button>
          </Box>
        )}
      </Drawer>

      {/* SNACKBAR NOTIFICATIONS */}
      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={4000}
        onClose={() => setToastMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={() => setToastMessage(null)}
          severity={toastSeverity}
          variant="filled"
          sx={{ width: '100%', borderRadius: '4px' }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
