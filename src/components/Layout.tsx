import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  AppBar,
  Toolbar,
  Button,
  IconButton,
  InputBase,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  Tooltip,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Dashboard,
  AutoStories,
  Description,
  Group,
  Settings,
  Search,
  Notifications,
  Help,
  Campaign,
  FiberManualRecord,
  Menu as MenuIcon
} from '@mui/icons-material';

const SIDEBAR_WIDTH = 260;

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const currentPath = location.pathname;

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSnackbarMessage(`Search triggered for: "${searchQuery}"`);
      setSnackbarOpen(true);
    }
  };

  const handleManageContent = () => {
    navigate('/release-notes-management');
  };

  // Nav items from application layout guidelines
  const primaryNav = [
    { text: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
    { text: 'Release Notes', path: '/release-notes', icon: <AutoStories /> },
    { text: 'Help Center', path: '/help-center', icon: <Help /> },
  ];

  const contentManagementNav = [
    { text: 'Manage Releases', path: '/release-notes-management', icon: <Campaign /> },
  ];

  const systemNav = [
    { text: 'Documentation', path: '/documentation', icon: <Description />, isMock: true },
    { text: 'Team Members', path: '/team-members', icon: <Group />, isMock: true },
    { text: 'Configuration', path: '/configuration', icon: <Settings />, isMock: true },
  ];

  const handleMockNavClick = (text: string) => {
    setSnackbarMessage(`${text} is a placeholder for future iterations. (Build foundation only, strictly respecting scope)`);
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8f9ff' }}>
      {/* Sidebar Navigation */}
      <Box
        component="nav"
        sx={{ width: { md: SIDEBAR_WIDTH }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: SIDEBAR_WIDTH,
              borderRight: '1px solid rgba(189, 200, 205, 0.4)',
              bgcolor: '#f8f9ff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'between',
            },
          }}
          open
        >
          {/* Sidebar Header */}
          <Box sx={{ p: 3, pb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Campaign sx={{ color: '#006578', fontSize: 28 }} />
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  letterSpacing: '-0.3px',
                  color: '#006578',
                }}
              >
                ReleaseHub
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, fontSize: '0.825rem' }}>
              myChron pr-65
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(11, 28, 48, 0.6)' }}>
              Role: Contractor - Dev
            </Typography>
          </Box>

          {/* Navigation links */}
          <Box sx={{ flexGrow: 1, px: 1.5 }}>
            <List sx={{ p: 0, gap: '4px', display: 'flex', flexDirection: 'column' }}>
              <Typography
                variant="caption"
                sx={{
                  px: 2,
                  py: 1,
                  display: 'block',
                  fontWeight: 700,
                  color: 'text.secondary',
                  letterSpacing: '0.8px',
                  fontSize: '0.675rem',
                  textTransform: 'uppercase'
                }}
              >
                Core Feeds
              </Typography>
              {primaryNav.map((item) => {
                const isActive = currentPath === item.path;
                return (
                  <ListItem key={item.text} disablePadding>
                    <ListItemButton
                      onClick={() => navigate(item.path)}
                      sx={{
                        borderRadius: '6px',
                        py: 0.75,
                        px: 2,
                        mb: 0.5,
                        position: 'relative',
                        backgroundColor: isActive ? 'rgba(0, 101, 120, 0.08)' : 'transparent',
                        color: isActive ? '#006578' : '#3d494c',
                        fontWeight: isActive ? 600 : 500,
                        '&:hover': {
                          backgroundColor: 'rgba(0, 101, 120, 0.04)',
                        },
                        '&::after': isActive ? {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: '3.5px',
                          backgroundColor: '#006578',
                          borderRadius: '0 4px 4px 0',
                        } : {},
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 36,
                          color: isActive ? '#006578' : '#6d797d',
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography sx={{ fontSize: '0.9rem', fontWeight: isActive ? 600 : 500 }}>
                            {item.text}
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}

              <Typography
                variant="caption"
                sx={{
                  mt: 2.5,
                  px: 2,
                  py: 1,
                  display: 'block',
                  fontWeight: 700,
                  color: 'text.secondary',
                  letterSpacing: '0.8px',
                  fontSize: '0.675rem',
                  textTransform: 'uppercase'
                }}
              >
                Content Management
              </Typography>
              {contentManagementNav.map((item) => {
                const isActive = currentPath === item.path;
                return (
                  <ListItem key={item.text} disablePadding>
                    <ListItemButton
                      onClick={() => navigate(item.path)}
                      sx={{
                        borderRadius: '6px',
                        py: 0.75,
                        px: 2,
                        mb: 0.5,
                        position: 'relative',
                        backgroundColor: isActive ? 'rgba(0, 101, 120, 0.08)' : 'transparent',
                        color: isActive ? '#006578' : '#3d494c',
                        fontWeight: isActive ? 600 : 500,
                        '&:hover': {
                          backgroundColor: 'rgba(0, 101, 120, 0.04)',
                        },
                        '&::after': isActive ? {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: '3.5px',
                          backgroundColor: '#006578',
                          borderRadius: '0 4px 4px 0',
                        } : {},
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 36,
                          color: isActive ? '#006578' : '#6d797d',
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography sx={{ fontSize: '0.9rem', fontWeight: isActive ? 600 : 500 }}>
                            {item.text}
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}

              <Typography
                variant="caption"
                sx={{
                  mt: 2.5,
                  px: 2,
                  py: 1,
                  display: 'block',
                  fontWeight: 700,
                  color: 'text.secondary',
                  letterSpacing: '0.8px',
                  fontSize: '0.675rem',
                  textTransform: 'uppercase'
                }}
              >
                System Utilities
              </Typography>
              {systemNav.map((item) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    onClick={() => handleMockNavClick(item.text)}
                    sx={{
                      borderRadius: '6px',
                      py: 0.75,
                      px: 2,
                      color: '#3d494c',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 101, 120, 0.04)',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36, color: '#6d797d' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
                          {item.text}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>

          {/* System Online Indicator in sidebar footer */}
          <Box sx={{ p: 2, mt: 'auto', borderTop: '1px solid rgba(189, 200, 205, 0.3)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FiberManualRecord sx={{ color: '#008097', fontSize: 12, animation: 'pulse 2s infinite' }} />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  color: '#3d494c',
                  fontSize: '0.7rem'
                }}
              >
                System Online
              </Typography>
            </Box>
          </Box>
        </Drawer>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: '#ffffff',
            borderBottom: '1px solid rgba(189, 200, 205, 0.4)',
            color: '#0b1c30',
            zIndex: 1100,
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 3 }, minHeight: 64 }}>
            {/* Left Portion of Header (Navigation Tabs mock) */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {/* Logo / Drawer controller for smaller widths */}
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                sx={{ mr: 1, display: { md: 'none' } }}
              >
                <MenuIcon />
              </IconButton>

              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: '#006578',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                ReleaseHub Enterprise Management
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: { sm: 2 } }}>
                <Button
                  onClick={() => navigate('/help-center')}
                  variant="text"
                  sx={{
                    color: currentPath === '/help-center' ? '#006578' : '#3d494c',
                    fontWeight: currentPath === '/help-center' ? 700 : 500,
                    fontSize: '0.875rem',
                    borderBottom: currentPath === '/help-center' ? '2.5px solid #006578' : 'none',
                    borderRadius: 0,
                    pb: 1,
                    pt: 1,
                    minWidth: 'auto'
                  }}
                >
                  Help Docs
                </Button>
                <Button
                  onClick={() => navigate('/release-notes')}
                  variant="text"
                  sx={{
                    color: currentPath === '/release-notes' ? '#006578' : '#3d494c',
                    fontWeight: currentPath === '/release-notes' ? 700 : 500,
                    fontSize: '0.875rem',
                    borderBottom: currentPath === '/release-notes' ? '2.5px solid #006578' : 'none',
                    borderRadius: 0,
                    pb: 1,
                    pt: 1,
                    minWidth: 'auto'
                  }}
                >
                  Release Notes
                </Button>
              </Box>
            </Box>

            {/* Right Portion of Header (Search, Action, Profile, etc.) */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
              {/* Search resources desktop bar */}
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: '20px',
                  bgcolor: '#f1f5f9',
                  display: { xs: 'none', lg: 'flex' },
                  alignItems: 'center',
                  px: 2,
                  py: 0.5,
                  width: 240,
                }}
              >
                <Search sx={{ color: '#6d797d', fontSize: 18, mr: 1 }} />
                <InputBase
                  placeholder="Search resources..."
                  inputProps={{ 'aria-label': 'search resources' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  sx={{ fontSize: '0.85rem', width: '100%', color: '#0b1c30' }}
                />
              </Box>

              {/* Action Button */}
              <Button
                variant="contained"
                onClick={handleManageContent}
                sx={{
                  bgcolor: '#006578',
                  color: '#ffffff',
                  fontSize: '0.825rem',
                  px: 2,
                  py: 0.75,
                  borderRadius: '4px',
                  fontWeight: 600,
                  display: { xs: 'none', sm: 'inline-flex' }
                }}
              >
                Manage Content
              </Button>

              {/* Notifications */}
              <IconButton
                onClick={(e) => setNotifAnchor(e.currentTarget)}
                sx={{ color: '#6d797d' }}
              >
                <Badge badgeContent={1} color="error" variant="dot">
                  <Notifications />
                </Badge>
              </IconButton>
              <Menu
                id="notification-menu"
                anchorEl={notifAnchor}
                open={Boolean(notifAnchor)}
                onClose={() => setNotifAnchor(null)}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <Box sx={{ p: 2, width: 260 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Notifications</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Stay tuned! Release notifications & live updates are scheduled for Phase 2.
                  </Typography>
                </Box>
              </Menu>

              {/* Help Circle */}
              <IconButton
                onClick={() => navigate('/help-center')}
                sx={{ color: '#6d797d' }}
              >
                <Help />
              </IconButton>

              {/* User Avatar */}
              <Tooltip title="Account Panel">
                <IconButton
                  onClick={(e) => setProfileAnchor(e.currentTarget)}
                  size="small"
                  sx={{ ml: 0.5 }}
                >
                  <Avatar
                    alt="User Profile"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&crop=face"
                    sx={{ width: 32, height: 32, border: '1.5px solid #006578' }}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                id="profile-menu"
                anchorEl={profileAnchor}
                open={Boolean(profileAnchor)}
                onClose={() => setProfileAnchor(null)}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <Box sx={{ px: 2, py: 1.5, minWidth: 160 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Contractor - Dev Account</Typography>
                  <Typography variant="caption" color="text.secondary">svishwamitra@gmail.com</Typography>
                </Box>
                <MenuItem onClick={() => setProfileAnchor(null)} sx={{ fontSize: '0.85rem' }}>View Profile</MenuItem>
                <MenuItem onClick={() => setProfileAnchor(null)} sx={{ fontSize: '0.85rem' }}>API Configuration</MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Dynamic Nested Screen Canvas */}
        <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, maxWidth: 1200, w: '100%', mx: 'auto', width: '100%' }}>
          <Outlet />
        </Box>

        {/* Global Footer */}
        <Box
          component="footer"
          sx={{
            py: 4,
            px: { xs: 2, md: 4 },
            borderTop: '1px solid rgba(189, 200, 205, 0.4)',
            bgcolor: '#ffffff',
            mt: 'auto',
          }}
        >
          <Box
            sx={{
              maxWidth: 1200,
              mx: 'auto',
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="h6" sx={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: '1rem', color: '#006578' }}>
                myChron
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>|</Typography>
              <Typography variant="body2" color="text.secondary">
                © 2026 Enterprise Solutions Inc.
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Button onClick={() => handleMockNavClick('Privacy Policy')} variant="text" size="small" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                Privacy Policy
              </Button>
              <Button onClick={() => handleMockNavClick('Terms of Service')} variant="text" size="small" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                Terms of Service
              </Button>
              <Button onClick={() => handleMockNavClick('Status Page')} variant="text" size="small" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                Status Page
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Status Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="info" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
