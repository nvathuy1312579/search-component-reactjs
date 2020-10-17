import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core';

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
  wrapperResult: {
      maxHeight: 200,
  }
}));
export default function SearchDefault() {
  const classes = useStyles();
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchKey, setSearchKey] = useState('');

  const fetchData = async (searchValue = '') => {
    const res = await searchApi(searchValue);
    if (res.status === 200) {
      const newDataFetched = res.data.hits.length > 0 ? mappingData(res.data.hits) : [];
      setDatas(newDataFetched);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    fetchData(searchKey);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <div className={classes.container}>
      <SearchBox loading={loading} value={searchKey} onChange={setSearchKey} onSubmit={handleSearch}/>
      <ListItemResult loading={loading} data={datas}/>
    </div>
  );
}
