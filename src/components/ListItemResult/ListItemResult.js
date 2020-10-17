import React from 'react';

import { makeStyles } from '@material-ui/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    padding: theme.spacing(2, 0),
    maxHeight: 200,
    overflow: 'auto',
  },
  listItemContainer: {
    '&:hover $moreIcon': {
      visibility: 'visible',
    },
  },
  listItem: {
    padding: theme.spacing(0, 2),
  },
  author: {
    fontWeight: 600,
  },
  itemContent: {
    overflow: 'hidden',
    alignItems: 'center',
  },
  itemName: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    paddingRight: 4,
  },
}));

export default function ListItemResult({ loading, data }) {
  const classes = useStyles();

  return (
    <Paper>
      {loading ? (
        <CircularProgress size={18} color="primary" />
      ) : (
        <List disablePadding className={classes.wrapper}>
          {data.length > 0 ? (
            data.map((item) => (
              <ListItem
                key={item.id}
                className={classes.listItem}
                classes={{ container: classes.listItemContainer }}
              >
                <ListItemText>
                  <div className={classes.itemContent}>
                    <Typography noWrap weight="bold" className={classes.author}>
                      {item.author}
                    </Typography>
                    {item.title && (
                      <Typography
                        dangerouslySetInnerHTML={{ __html: `${item.title}` }}
                        title={item.title}
                        noWrap
                      />
                    )}
                  </div>
                </ListItemText>
              </ListItem>
            ))
          ) : (
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
          )}
        </List>
      )}
    </Paper>
  );
}
