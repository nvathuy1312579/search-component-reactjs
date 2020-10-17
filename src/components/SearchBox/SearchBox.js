import React, { useState } from 'react';

import { makeStyles } from '@material-ui/styles';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
  wrapperSearch: {
    flex: '1 1 auto',
  },
  search: {
    paddingLeft: theme.spacing(2),
    flexGrow: 1,
    height: 40,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    border: '1px solid rgba(0, 0, 0, 0.23)',
    background: '#fff',
  },
  searchInput: {
    flexGrow: 1,
  },
  searchButton: {
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
    textTransform: 'capitalize',
    height: 40,
  },
}));

export default function SearchBox({ value, placeholder, onChange }) {
  const classes = useStyles();
  const [searchKey, setSearchKey] = useState('');

  return (
    <div className={classes.wrapperSearch}>
      <form className={classes.search}>
        <Input
          disableUnderline
          value={searchKey}
          name="searchKey"
          placeholder="Search..."
          className={classes.searchInput}
          onChange={(e) => setSearchKey(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          className={classes.searchButton}
          onClick={() => {}}
        >
          <SearchIcon fontSize="small" />
        </Button>
      </form>
    </div>
  );
}
