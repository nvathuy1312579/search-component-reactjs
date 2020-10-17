import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { searchApi } from '../../api';
import { mappingData } from '../../utils';
import SearchBox from '../../components/SearchBox/SearchBox';
import ListItemResult from '../../components/ListItemResult/ListItemResult';

const useStyles = makeStyles((theme) => ({
  mainSection: {
    height: '100%',
    background: '#eeeeee',
    padding: theme.spacing(3),
  },
}));
export default function HomePage() {
  const classes = useStyles();
  const [datas, setDatas] = useState([]);

  const fetchData = async () => {
    const res = await searchApi('aaaa');
    if (res.status === 200) {
      const newDataFetched = res.data.hits.length > 0 ? mappingData(res.data.hits) : [];
      setDatas(newDataFetched);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Frontend Skill Test
        </Typography>
        <div className={classes.mainSection}>
          <SearchBox />
          <ListItemResult data={datas} />
        </div>
      </Box>
    </Container>
  );
}
