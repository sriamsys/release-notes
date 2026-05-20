import React, { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
  Drawer,
  TextField,
  Divider,
  MenuItem,
  Stack,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Search,
  ExpandMore,
  RocketLaunch,
  Code,
  Settings,
  Palette,
  ArrowBack,
  QuestionAnswer,
  ContactSupport,
  Send,
  Help
} from '@mui/icons-material';
import { motion } from 'framer-motion';

import { mockHelpCategories } from '../mockData';
import { HelpArticle } from '../types';

interface TicketFormInput {
  name: string;
  email: string;
  subject: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

export default function HelpCenter() {
  // Navigation drill-down
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [supportDrawerOpen, setSupportDrawerOpen] = useState(false);
  const [successSnackbar, setSuccessSnackbar] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<any>(null);

  // react-hook-form initiation
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<TicketFormInput>({
    defaultValues: {
      name: 'Contractor - Dev',
      email: 'svishwamitra@gmail.com',
      subject: '',
      urgency: 'medium',
      description: '',
    }
  });

  // Ticket submissions mock handler
  const onTicketSubmit = (data: TicketFormInput) => {
    setSubmittedTicket(data);
    setSuccessSnackbar(true);
    setSupportDrawerOpen(false);
    reset({
      name: 'Contractor - Dev',
      email: 'svishwamitra@gmail.com',
      subject: '',
      urgency: 'medium',
      description: '',
    });
  };

  // Icon mapping helper
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'rocket':
        return <RocketLaunch sx={{ color: '#006578', fontSize: 32 }} />;
      case 'code':
        return <Code sx={{ color: '#8a4d00', fontSize: 32 }} />;
      default:
        return <Palette sx={{ color: '#008097', fontSize: 32 }} />;
    }
  };

  // Combined search computation across all nested articles
  const searchedArticles = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return null;

    const results: HelpArticle[] = [];
    mockHelpCategories.forEach((cat) => {
      cat.articles.forEach((art) => {
        if (
          art.title.toLowerCase().includes(query) ||
          art.summary.toLowerCase().includes(query) ||
          art.content.toLowerCase().includes(query)
        ) {
          results.push(art);
        }
      });
    });
    return results;
  }, [searchQuery]);

  return (
    <Box sx={{ py: 1 }}>
      {/* Upper header */}
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
          Help Center
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 865 }}>
          Search technical manuals, API webhooks specifications, and white-label theme customizer configurations.
        </Typography>

        {/* Big search portal bar */}
        <Card
          sx={{
            mt: 3.5,
            p: 2,
            bgcolor: '#ffffff',
            border: '1px solid rgba(189, 200, 205, 0.4)',
            boxShadow: '0 4px 12px rgba(11,28,48,0.02)',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 2 }}>
            <Box sx={{ flexGrow: 1, width: { xs: '100%', md: 'auto' } }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: '#f1f5f9',
                  border: '1px solid rgba(189, 200, 205, 0.5)',
                  borderRadius: '24px',
                  px: 2.5,
                  py: 0.75,
                }}
              >
                <Search sx={{ color: '#6d797d', fontSize: 20, mr: 1.5 }} />
                <InputBase
                  placeholder="Ask a question or search for resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ fontSize: '0.95rem', width: '100%', color: '#0b1c30' }}
                />
              </Box>
            </Box>
            <Box sx={{ width: { xs: '100%', md: 'auto' }, textAlign: { md: 'right' } }}>
              <Button
                variant="contained"
                startIcon={<ContactSupport />}
                onClick={() => setSupportDrawerOpen(true)}
                sx={{
                  bgcolor: '#006578',
                  color: '#ffffff',
                  fontWeight: 600,
                  borderRadius: '4px',
                  width: { xs: '100%', md: 'auto' },
                  px: 3,
                  py: 1,
                  '&:hover': { bgcolor: '#008097' },
                }}
              >
                Create Support Ticket
              </Button>
            </Box>
          </Box>
        </Card>
      </Box>

      {/* Ticket form output feedback */}
      {submittedTicket && (
        <Alert
          severity="success"
          onClose={() => setSubmittedTicket(null)}
          sx={{ mb: 3, border: '1px solid rgba(27,77,62,0.2)' }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Ticket Successfully Registered! Ticket ID: RH-2026-{(Math.random() * 9000 + 1000).toFixed(0)}</Typography>
          <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
            Our engineering desk has received your ticket "<strong>{submittedTicket.subject}</strong>" under {submittedTicket.urgency.toUpperCase()} urgency.
          </Typography>
        </Alert>
      )}

      {/* Dynamic View Logic */}
      {selectedArticle ? (
        /* Drilling down into reading particular Article */
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
          <Box sx={{ mb: 3 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => setSelectedArticle(null)}
              sx={{ color: '#006578', fontWeight: 600, mb: 2 }}
            >
              Back to Help Directories
            </Button>

            <Card sx={{ bgcolor: '#ffffff', p: { xs: 3, md: 5 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                <Chip label={selectedArticle.category} size="small" sx={{ bgcolor: '#eff4ff', color: '#006578', fontWeight: 700 }} />
                <Typography variant="caption" color="text.secondary">
                  {selectedArticle.readTime} &bull; Published May 2026
                </Typography>
              </Box>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  fontFamily: '"Space Grotesk", sans-serif',
                  color: '#0b1c30',
                  mb: 1.5,
                  fontSize: { xs: '1.5rem', md: '2.1rem' }
                }}
              >
                {selectedArticle.title}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '1.05rem', mb: 4 }}>
                {selectedArticle.summary}
              </Typography>
              <Divider sx={{ mb: 4 }} />

              <Box sx={{ color: '#3d494c', whiteSpace: 'pre-line', lineHeight: 1.7, '& h3': { color: '#0b1c30', mt: 4, mb: 1, fontWeight: 700 }, '& ul': { pl: 3, mt: 1 }, '& li': { mb: 1 } }}>
                <Typography variant="body1" component="div">
                  {selectedArticle.content}
                </Typography>
              </Box>
            </Card>
          </Box>
        </motion.div>
      ) : searchQuery ? (
        /* If user is active typing in search query */
        <Box sx={{ mb: 5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#0b1c30' }}>
            Search Results for "{searchQuery}"
          </Typography>

          {searchedArticles && searchedArticles.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {searchedArticles.map((art) => (
                <Card
                  key={art.id}
                  onClick={() => setSelectedArticle(art)}
                  sx={{
                    bgcolor: '#ffffff',
                    cursor: 'pointer',
                    '&:hover': { borderColor: '#006578', bgcolor: 'rgba(0,101,120,0.01)' }
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Chip label={art.category} size="small" variant="outlined" sx={{ color: '#006578', borderColor: '#006578' }} />
                      <Typography variant="caption" color="text.secondary">{art.readTime}</Typography>
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0b1c30' }}>{art.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{art.summary}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            <Card sx={{ bgcolor: '#ffffff', p: 5, textAlign: 'center' }}>
              <QuestionAnswer sx={{ fontSize: 48, color: 'text.secondary', mb: 1.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>No results matched your search phrase</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Try searching standard tags like "webhook", "overview", "theme", or explore folders below.
              </Typography>
              <Button onClick={() => setSearchQuery('')} variant="text" sx={{ mt: 2, color: '#006578' }}>
                Clear Search Query
              </Button>
            </Card>
          )}
        </Box>
      ) : (
        /* Main Category lists blocks */
        <Box sx={{ mb: 5 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
            {mockHelpCategories.map((category) => (
              <Box key={category.id}>
                <Card sx={{ height: '100%', bgcolor: '#ffffff' }}>
                  <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ mb: 2 }}>
                      {getCategoryIcon(category.icon)}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: '#0b1c30',
                        fontSize: '1.15rem',
                        fontFamily: '"Space Grotesk", sans-serif',
                        mb: 1
                      }}
                    >
                      {category.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      {category.description}
                    </Typography>

                    {/* Article Index Accordions inside Category Card */}
                    <Box sx={{ mt: 'auto', borderTop: '1px solid rgba(0,0,0,0.04)', pt: 2 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#3d494c', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.5px', mb: 1.5, display: 'block' }}>
                        Guides Directory:
                      </Typography>
                      {category.articles.map((art) => (
                        <Box
                          key={art.id}
                          onClick={() => setSelectedArticle(art)}
                          sx={{
                            py: 1,
                            px: 1.5,
                            mb: 1,
                            borderRadius: '4px',
                            cursor: 'pointer',
                            bgcolor: '#f8f9ff',
                            border: '1px solid transparent',
                            '&:hover': {
                              bgcolor: 'rgba(0,101,120,0.03)',
                              borderColor: 'rgba(0,101,120,0.15)',
                            }
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#0b1c30', fontSize: '0.85rem' }}>
                            {art.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {art.readTime}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Support Ticket Side Drawer using React Hook Form */}
      <Drawer
        anchor="right"
        open={supportDrawerOpen}
        onClose={() => setSupportDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 460 },
            p: 4,
            bgcolor: '#ffffff'
          }
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            fontFamily: '"Space Grotesk", sans-serif',
            color: '#0b1c30',
            mb: 1
          }}
        >
          Contact Engineering Support
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Fill out this form to file an official support ticket. Validated dynamically under compliance constraints.
        </Typography>

        <form onSubmit={handleSubmit(onTicketSubmit)}>
          <Stack spacing={3}>
            {/* Requester Name */}
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Please enter your name.' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Contact Name"
                  size="small"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  fullWidth
                />
              )}
            />

            {/* Email Address */}
            <Controller
              name="email"
              control={control}
              rules={{
                required: 'Please provide email.',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address.' }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Alert Email"
                  size="small"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  fullWidth
                />
              )}
            />

            {/* Subject */}
            <Controller
              name="subject"
              control={control}
              rules={{ required: 'Subject heading is required.' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Ticket Subject"
                  size="small"
                  placeholder="e.g. Problems uploading custom brand logo assets"
                  error={!!errors.subject}
                  helperText={errors.subject?.message}
                  fullWidth
                />
              )}
            />

            {/* Severity selection */}
            <Controller
              name="urgency"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Priority Level"
                  size="small"
                  fullWidth
                >
                  <MenuItem value="low">Low (Standard improvement discussions)</MenuItem>
                  <MenuItem value="medium">Medium (Deployment issues or metadata bugs)</MenuItem>
                  <MenuItem value="high">High (Production note publishing errors)</MenuItem>
                  <MenuItem value="critical">Critical (Webhook disruption or sync failure)</MenuItem>
                </TextField>
              )}
            />

            {/* Detail description */}
            <Controller
              name="description"
              control={control}
              rules={{ required: 'Detail information description is required.' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Troubleshoot Details"
                  multiline
                  rows={4}
                  placeholder="Describe your error logs, steps leading to issue, or requested features..."
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  fullWidth
                />
              )}
            />

            {/* Action buttons */}
            <Box sx={{ display: 'flex', gap: 2, pt: 1 }}>
              <Button
                variant="outlined"
                onClick={() => setSupportDrawerOpen(false)}
                sx={{
                  color: 'text.secondary',
                  borderColor: 'rgba(189, 200, 205, 0.6)',
                  flexGrow: 1
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                endIcon={<Send />}
                sx={{
                  bgcolor: '#006578',
                  '&:hover': { bgcolor: '#008097' },
                  flexGrow: 1
                }}
              >
                Submit Ticket
              </Button>
            </Box>
          </Stack>
        </form>
      </Drawer>

      <Snackbar
        open={successSnackbar}
        autoHideDuration={4000}
        onClose={() => setSuccessSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccessSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          Support Ticket successfully dispatched to myChron engineering.
        </Alert>
      </Snackbar>
    </Box>
  );
}
