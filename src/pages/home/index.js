import React from 'react';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import SearchDefault from './components/SearchDefault';
import SearchDebounce from './components/SearchDebounce';

export default function HomePage() {
  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Frontend Skill Test - Thuy Nguyen
        </Typography>
        <Box textAlign="center">
          <Button
            color="primary"
            variant="outlined"
            onClick={() => {
              window.location.href = '/nested-list';
            }}
          >
            Go to nested List
          </Button>
        </Box>
        <Typography variant="h5" gutterBottom>
          Default
        </Typography>
        <SearchDefault />
        <Typography variant="h5" gutterBottom>
          Debounce Search Input
        </Typography>
        <SearchDebounce />
      </Box>
    </Container>
  );
}
