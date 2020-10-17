import React from 'react';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/styles';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import CircularProgress from '@material-ui/core/CircularProgress';

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
  loadingBtn: {
    padding: theme.spacing(1),
  }
}));

export default function SearchBox({ loading, value, onChange, variant, onSubmit, classNameSearch }) {
  const classes = useStyles();
  
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className={classes.wrapperSearch}>
      <form className={clsx(classes.search, classNameSearch)} onSubmit={onSubmit}>
        <Input
          disableUnderline
          value={value}
          name="searchKey"
          placeholder="Search..."
          className={classes.searchInput}
          onChange={handleChange}
        />
        {variant === 'debounce' ? (
          loading ? (
            <CircularProgress className={classes.loadingBtn} size={18} fontSize="small" />
          ) : (
            <SearchIcon fontSize="small" style={{ fill: '#ff5722' }} />
          )
        ) : (
          <Button
            variant="contained"
            color="primary"
            className={classes.searchButton}
            onClick={onSubmit}
          >
            {loading ? (
              <CircularProgress size={18} color="#fff" fontSize="small" />
            ) : (
              <SearchIcon fontSize="small" />
            )}
          </Button>
        )}
      </form>
    </div>
  );
}
