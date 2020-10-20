import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { TreeContext } from './TreeContext';
import TreeNode from './TreeNode';
import {
  toArray,
  convertTreeToEntities,
  getDataAndAria,
  getPosition,
  parseCheckedKeys,
  conductExpandParent,
  calcSelectedKeys,
  arrAdd,
  arrDel,
  mapChildren,
  conductCheck,
} from './TreeUtil';
import './index.css';

function convertDataToTree(treeData, processor) {
  if (!treeData) return [];

  const { processProps } = processor || {};
  const list = Array.isArray(treeData) ? treeData : [treeData];
  return list.map(({ children, ...props }) => {
    const childrenNodes = convertDataToTree(children, processor);

    return <TreeNode {...processProps(props)}>{childrenNodes}</TreeNode>;
  });
}

class Tree extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      keyEntities: {},
      selectedKeys: [],
      checkedKeys: [],
      halfCheckedKeys: [],
      loadedKeys: [],
      loadingKeys: [],
      expandedKeys: [],

      treeNode: [],
      prevProps: null,
    };
  }

  static getDerivedStateFromProps(props, prevState) {
    const { prevProps } = prevState;
    const newState = {
      prevProps: props,
    };

    function needSync(name) {
      return (!prevProps && name in props) || (prevProps && prevProps[name] !== props[name]);
    }

    // ================== Tree Node ==================
    let treeNode = null;

    if (needSync('treeData')) {
      treeNode = convertDataToTree(props.treeData);
    } else if (needSync('children')) {
      treeNode = toArray(props.children);
    }

    if (treeNode) {
      newState.treeNode = treeNode;
      const entitiesMap = convertTreeToEntities(treeNode);
      newState.keyEntities = entitiesMap.keyEntities;
    }

    const keyEntities = newState.keyEntities || prevState.keyEntities;

    // ================ expandedKeys =================
    if (needSync('expandedKeys') || (prevProps && needSync('autoExpandParent'))) {
      newState.expandedKeys =
        props.autoExpandParent || (!prevProps && props.defaultExpandParent)
          ? conductExpandParent(props.expandedKeys, keyEntities)
          : props.expandedKeys;
    } else if (!prevProps && props.defaultExpandAll) {
      newState.expandedKeys = Object.keys(keyEntities);
    } else if (!prevProps && props.defaultExpandedKeys) {
      newState.expandedKeys =
        props.autoExpandParent || props.defaultExpandParent
          ? conductExpandParent(props.defaultExpandedKeys, keyEntities)
          : props.defaultExpandedKeys;
    }

    // ================ selectedKeys =================
    if (props.selectable) {
      if (needSync('selectedKeys')) {
        newState.selectedKeys = calcSelectedKeys(props.selectedKeys, props);
      } else if (!prevProps && props.defaultSelectedKeys) {
        newState.selectedKeys = calcSelectedKeys(props.defaultSelectedKeys, props);
      }
    }

    // ================= checkedKeys =================
    if (props.checkable) {
      let checkedKeyEntity;

      if (needSync('checkedKeys')) {
        checkedKeyEntity = parseCheckedKeys(props.checkedKeys) || {};
      } else if (!prevProps && props.defaultCheckedKeys) {
        checkedKeyEntity = parseCheckedKeys(props.defaultCheckedKeys) || {};
      } else if (treeNode) {
        checkedKeyEntity = parseCheckedKeys(props.checkedKeys) || {
          checkedKeys: prevState.checkedKeys,
          halfCheckedKeys: prevState.halfCheckedKeys,
        };
      }

      if (checkedKeyEntity) {
        let { checkedKeys = [], halfCheckedKeys = [] } = checkedKeyEntity;

        if (!props.checkStrictly) {
          const conductKeys = conductCheck(checkedKeys, true, keyEntities);
          ({ checkedKeys, halfCheckedKeys } = conductKeys);
        }

        newState.checkedKeys = checkedKeys;
        newState.halfCheckedKeys = halfCheckedKeys;
      }
    }
    // ================= loadedKeys ==================
    if (needSync('loadedKeys')) {
      newState.loadedKeys = props.loadedKeys;
    }

    return newState;
  }

  onNodeClick = (e, treeNode) => {
    const { onClick } = this.props;
    if (onClick) {
      onClick(e, treeNode);
    }
  };

  onNodeSelect = (e, treeNode) => {
    let { selectedKeys } = this.state;
    const { keyEntities } = this.state;
    const { onSelect, multiple } = this.props;
    const { selected, eventKey } = treeNode.props;
    const targetSelected = !selected;

    // Update selected keys
    if (!targetSelected) {
      selectedKeys = arrDel(selectedKeys, eventKey);
    } else if (!multiple) {
      selectedKeys = [eventKey];
    } else {
      selectedKeys = arrAdd(selectedKeys, eventKey);
    }

    const selectedNodes = selectedKeys
      .map((key) => {
        const entity = keyEntities[key];
        if (!entity) return null;

        return entity.node;
      })
      .filter((node) => node);

    this.setUncontrolledState({ selectedKeys });

    if (onSelect) {
      onSelect(selectedKeys, {
        event: 'select',
        selected: targetSelected,
        node: treeNode,
        selectedNodes,
        nativeEvent: e.nativeEvent,
      });
    }
  };

  onNodeCheck = (e, treeNode, checked) => {
    const {
      keyEntities,
      checkedKeys: oriCheckedKeys,
      halfCheckedKeys: oriHalfCheckedKeys,
    } = this.state;
    const { checkStrictly, onCheck } = this.props;
    const {
      props: { eventKey },
    } = treeNode;

    // Prepare trigger arguments
    let checkedObj;
    const eventObj = {
      event: 'check',
      node: treeNode,
      checked,
      nativeEvent: e.nativeEvent,
    };

    if (checkStrictly) {
      const checkedKeys = checked
        ? arrAdd(oriCheckedKeys, eventKey)
        : arrDel(oriCheckedKeys, eventKey);
      const halfCheckedKeys = arrDel(oriHalfCheckedKeys, eventKey);
      checkedObj = { checked: checkedKeys, halfChecked: halfCheckedKeys };

      eventObj.checkedNodes = checkedKeys
        .map((key) => keyEntities[key])
        .filter((entity) => entity)
        .map((entity) => entity.node);

      this.setUncontrolledState({ checkedKeys });
    } else {
      const { checkedKeys, halfCheckedKeys } = conductCheck([eventKey], checked, keyEntities, {
        checkedKeys: oriCheckedKeys,
        halfCheckedKeys: oriHalfCheckedKeys,
      });

      checkedObj = checkedKeys;

      // [Legacy] This is used for `rc-tree-select`
      eventObj.checkedNodes = [];
      eventObj.checkedNodesPositions = [];
      eventObj.halfCheckedKeys = halfCheckedKeys;

      checkedKeys.forEach((key) => {
        const entity = keyEntities[key];
        if (!entity) return;

        const { node, pos } = entity;

        eventObj.checkedNodes.push(node);
        eventObj.checkedNodesPositions.push({ node, pos });
      });

      this.setUncontrolledState({
        checkedKeys,
        halfCheckedKeys,
      });
    }

    if (onCheck) {
      onCheck(checkedObj, eventObj);
    }
  };

  onNodeLoad = (treeNode) =>
    new Promise((resolve) => {
      // We need to get the latest state of loading/loaded keys
      this.setState(({ loadedKeys = [], loadingKeys = [] }) => {
        const { loadData, onLoad } = this.props;
        const { eventKey } = treeNode.props;

        if (
          !loadData ||
          loadedKeys.indexOf(eventKey) !== -1 ||
          loadingKeys.indexOf(eventKey) !== -1
        ) {
          // react 15 will warn if return null
          return {};
        }

        // Process load data
        const promise = loadData(treeNode);
        promise.then(() => {
          const { loadedKeys: currentLoadedKeys, loadingKeys: currentLoadingKeys } = this.state;
          const newLoadedKeys = arrAdd(currentLoadedKeys, eventKey);
          const newLoadingKeys = arrDel(currentLoadingKeys, eventKey);

          if (onLoad) {
            onLoad(newLoadedKeys, {
              event: 'load',
              node: treeNode,
            });
          }

          this.setUncontrolledState({
            loadedKeys: newLoadedKeys,
          });
          this.setState({
            loadingKeys: newLoadingKeys,
          });

          resolve();
        });

        return {
          loadingKeys: arrAdd(loadingKeys, eventKey),
        };
      });
    });

  onNodeExpand = (e, treeNode) => {
    let { expandedKeys } = this.state;
    const { onExpand, loadData } = this.props;
    const { eventKey, expanded } = treeNode.props;

    // Update selected keys
    const index = expandedKeys.indexOf(eventKey);
    const targetExpanded = !expanded;

    if ((expanded && index !== -1) || (!expanded && index === -1)) {
      console.warn('Expand state not sync with index check');
    }

    if (targetExpanded) {
      expandedKeys = arrAdd(expandedKeys, eventKey);
    } else {
      expandedKeys = arrDel(expandedKeys, eventKey);
    }

    this.setUncontrolledState({ expandedKeys });

    if (onExpand) {
      onExpand(expandedKeys, {
        node: treeNode,
        expanded: targetExpanded,
        nativeEvent: e.nativeEvent,
      });
    }

    // Async Load data
    if (targetExpanded && loadData) {
      const loadPromise = this.onNodeLoad(treeNode);
      return loadPromise
        ? loadPromise.then(() => {
            // [Legacy] Refresh logic
            this.setUncontrolledState({ expandedKeys });
          })
        : null;
    }

    return null;
  };

  /**
   * Only update the value which is not in props
   */
  setUncontrolledState = (state) => {
    let needSync = false;
    const newState = {};

    Object.keys(state).forEach((name) => {
      if (name in this.props) return;

      needSync = true;
      newState[name] = state[name];
    });

    if (needSync) {
      this.setState(newState);
    }
  };

  isKeyChecked = (key) => {
    const { checkedKeys = [] } = this.state;
    return checkedKeys.indexOf(key) !== -1;
  };

  renderTreeNode = (child, index, level = 0) => {
    const {
      keyEntities,
      expandedKeys = [],
      selectedKeys = [],
      halfCheckedKeys = [],
      loadedKeys = [],
      loadingKeys = [],
    } = this.state;
    const pos = getPosition(level, index);
    const key = child.key || pos;

    if (!keyEntities[key]) {
      return null;
    }

    return React.cloneElement(child, {
      key,
      eventKey: key,
      expanded: expandedKeys.indexOf(key) !== -1,
      selected: selectedKeys.indexOf(key) !== -1,
      loaded: loadedKeys.indexOf(key) !== -1,
      loading: loadingKeys.indexOf(key) !== -1,
      checked: this.isKeyChecked(key),
      halfChecked: halfCheckedKeys.indexOf(key) !== -1,
      pos,
    });
  };

  render() {
    const { treeNode } = this.state;
    const {
      prefixCls,
      className,
      focusable,
      style,
      tabIndex = 0,
      selectable,
      showIcon,
      icon,
      switcherIcon,
      checkboxIcon,
      checkable,
      checkStrictly,
      disabled,
      loadData,
    } = this.props;
    const domProps = getDataAndAria(this.props);

    if (focusable) {
      domProps.tabIndex = tabIndex;
    }

    return (
      <TreeContext.Provider
        value={{
          prefixCls,
          selectable,
          showIcon,
          icon,
          switcherIcon,
          checkboxIcon,
          checkable,
          checkStrictly,
          disabled,

          loadData,
          renderTreeNode: this.renderTreeNode,
          isKeyChecked: this.isKeyChecked,

          onNodeClick: this.onNodeClick,
          onNodeExpand: this.onNodeExpand,
          onNodeSelect: this.onNodeSelect,
          onNodeCheck: this.onNodeCheck,
          onNodeLoad: this.onNodeLoad,
        }}
      >
        <div
          {...domProps}
          className={clsx('tree-view', prefixCls, className)}
          style={style}
          role="tree"
          unselectable="on"
        >
          {mapChildren(treeNode, (node, index) => this.renderTreeNode(node, index))}
        </div>
      </TreeContext.Provider>
    );
  }
}

Tree.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  tabIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.any,
  treeData: PropTypes.array, // Generate treeNode by children
  showIcon: PropTypes.bool,
  icon: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  focusable: PropTypes.bool,
  selectable: PropTypes.bool,
  disabled: PropTypes.bool,
  multiple: PropTypes.bool,
  checkable: PropTypes.oneOfType([PropTypes.bool, PropTypes.node]),
  checkStrictly: PropTypes.bool,
  defaultExpandParent: PropTypes.bool,
  autoExpandParent: PropTypes.bool,
  defaultExpandAll: PropTypes.bool,
  defaultExpandedKeys: PropTypes.arrayOf(PropTypes.string),
  expandedKeys: PropTypes.arrayOf(PropTypes.string),
  defaultCheckedKeys: PropTypes.arrayOf(PropTypes.string),
  checkedKeys: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    PropTypes.object,
  ]),
  defaultSelectedKeys: PropTypes.arrayOf(PropTypes.string),
  selectedKeys: PropTypes.arrayOf(PropTypes.string),
  onClick: PropTypes.func,
  onExpand: PropTypes.func,
  onCheck: PropTypes.func,
  onSelect: PropTypes.func,
  onLoad: PropTypes.func,
  loadData: PropTypes.func,
  loadedKeys: PropTypes.arrayOf(PropTypes.string),
  switcherIcon: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

Tree.defaultProps = {
  prefixCls: 'rc-tree',
  showIcon: true,
  selectable: false,
  multiple: false,
  checkable: false,
  disabled: false,
  checkStrictly: false,

  defaultExpandParent: false,
  autoExpandParent: false,
  defaultExpandAll: true,
  defaultExpandedKeys: [],
  defaultCheckedKeys: [],
  defaultSelectedKeys: [],
};

export default Tree;
