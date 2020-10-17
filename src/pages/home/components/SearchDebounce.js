import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core';

import useDebounce from '../../../utils/useDebounce';
import { searchApi } from '../../../api';
import { mappingData } from '../../../utils';
import SearchBox from '../../../components/SearchBox/SearchBox';
import ListItemResult from '../../../components/ListItemResult/ListItemResult';

const useStyles = makeStyles((theme) => ({
  container: {
    height: '100%',
    background: '#eeeeee',
    padding: theme.spacing(3),
  },
  search: {
    borderRadius: theme.spacing(3),
    padding: theme.spacing(0, 2),
  },
}));
export default function SearchDebounce() {
  const classes = useStyles();
  const [datas, setDatas] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const [loading, setLoading] = useState(false);

  const debouncedSearchTerm = useDebounce(searchKey, 1000);

  const fetchData = async (searchKey) => {
    setLoading(true);
    const res = await searchApi(searchKey);
    if (res.status === 200) {
      const newDataFetched = res.data.hits.length > 0 ? mappingData(res.data.hits) : [];
      setDatas(newDataFetched);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(searchKey);
  }, [debouncedSearchTerm, searchKey]);

  return (
    <div className={classes.container}>
      <SearchBox
        loading={loading}
        variant="debounce"
        value={searchKey}
        onChange={(value) => setSearchKey(value)}
        classNameSearch={classes.search}
      />
      <ListItemResult loading={loading} data={datas} />
    </div>
  );
}
