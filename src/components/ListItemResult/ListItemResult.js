import React from 'react';

import { makeStyles } from '@material-ui/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    padding: theme.spacing(2, 0),
    maxHeight: 250,
    overflow: 'auto'
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
    paddingRight: theme.spacing(13),
  },
  itemName: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    paddingRight: 4,
  },
}));

export default function ListItemResult({ data }) {
  const classes = useStyles();

  return (
    <Paper>
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
                  <Typography title={item.title} noWrap className={classes.itemName}>
                    {item.title}
                  </Typography>
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
    </Paper>
  );
}
