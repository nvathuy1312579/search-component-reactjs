import React, { useState } from 'react';

import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import TreeView from '../../components/TreeView';
import TreeNode from '../../components/TreeView/TreeNode';

export default function ProjectPage() {
  const [checkedKeys, setCheckedKeys] = useState([]);

  const treeData = [
    {
      key: 1,
      type: 'country',
      name: 'Viet Nam',
      items: [
        {
          key: 2,
          name: 'Ha Noi',
          type: 'province',
          items: [
            {
              key: 3,
              name: 'Ba vi',
              type: 'district',
              items: [
                {
                  key: 6,
                  name: 'Bien Hoa',
                  type: 'ward',
                },
                {
                  key: 7,
                  name: 'Hoa An',
                  type: 'ward',
                },
              ],
            },
            {
              key: 4,
              name: 'Ha Nam',
              type: 'district',
            },
            {
              key: 5,
              name: 'Ap Bac',
              type: 'district',
            },
          ],
        },
        {
          key: 8,
          name: 'Ho Chi Minh',
          type: 'province',
          items: [
            {
              key: 9,
              name: 'Q1',
              type: 'district',
              items: [
                {
                  key: 10,
                  name: 'P.Tan Dinh',
                  type: 'ward',
                },
                {
                  key: 11,
                  name: 'P.2',
                  type: 'ward',
                },
                {
                  key: 12,
                  name: 'P.3',
                  type: 'ward',
                },
                {
                  key: 13,
                  name: 'P.4',
                  type: 'ward',
                },
              ],
            },
            {
              key: 14,
              name: 'Binh Thanh',
              type: 'district',
              items: [
                {
                  key: 15,
                  name: 'P. 26',
                  type: 'ward',
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  const renderTree = (data) =>
    data.map((item) => {
      if (item.items) {
        return (
          <TreeNode key={item.key} title={<strong>{item.name}</strong>}>
            {renderTree(item.items)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} title={item.name} />;
    });

  return (
    <Container maxWidth="sm">
      <Box pt={4} textAlign="center">
        <Button
          color="primary"
          variant="outlined"
          onClick={() => {
            window.location.href = '/';
          }}
        >
          Back to Search Components
        </Button>
      </Box>
      <TreeView
        checkable
        autoExpandParent
        showIcon={false}
        onCheck={setCheckedKeys}
        checkedKeys={checkedKeys}
      >
        {renderTree(treeData)}
      </TreeView>
    </Container>
  );
}
