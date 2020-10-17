import React from 'react';

import { makeStyles } from '@material-ui/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    maxHeight: 200,
    overflow: 'auto',
  },
  listItem: {
    padding: theme.spacing(0, 2),
    borderBottom: '1px solid #eee',
  },
  author: {
    fontWeight: 600,
  },
  itemContent: {
    overflow: 'hidden',
    alignItems: 'center',
  },
}));

function EmptyItem() {
  const classes = useStyles();

  return (
    <ListItem>
      <ListItemText>
        <div className={classes.itemContent}>
          <Typography noWrap className={classes.author}>
            No results
          </Typography>
          <Typography>Your search returned no results</Typography>
        </div>
      </ListItemText>
    </ListItem>
  );
}

export default function ListItemResult({ loading, data }) {
  const classes = useStyles();

  return (
    <Paper>
      {loading ? (
        <Box height={40} display="flex" justifyContent="center" alignItems="center">
          <CircularProgress size={18} color="primary" />
        </Box>
      ) : (
        <List disablePadding className={classes.wrapper}>
          {data.length > 0 ? (
            data.map((item) => (
              <ListItem button key={item.id} className={classes.listItem}>
                <ListItemText>
                  <div className={classes.itemContent}>
                    <Typography
                      dangerouslySetInnerHTML={{ __html: `${item.author}` }}
                      noWrap
                      weight="bold"
                      className={classes.author}
                    />
                    {item.title && (
                      <Typography dangerouslySetInnerHTML={{ __html: `${item.title}` }} />
                    )}
                  </div>
                </ListItemText>
              </ListItem>
            ))
          ) : (
            <EmptyItem />
          )}
        </List>
      )}
    </Paper>
  );
}
