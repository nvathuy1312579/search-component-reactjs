/* eslint-disable react/require-default-props */
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

import { TreeContext } from './TreeContext';
import {
  toArray,
  getNodeChildren,
  getDataAndAria,
  mapChildren,
} from './TreeUtil';

const ICON_OPEN = 'open';
const ICON_CLOSE = 'close';

const defaultTitle = '---';

class TreeNode extends React.Component {
  onSelectorClick = (e) => {
    // Click trigger before select/check operation
    const {
      context: { onNodeClick },
    } = this.props;
    onNodeClick(e, this);

    if (this.isSelectable()) {
      this.onSelect(e);
    } else {
      this.onCheck(e);
    }
  };

  onSelect = (e) => {
    if (this.isDisabled()) return;

    const {
      context: { onNodeSelect },
    } = this.props;
    e.preventDefault();
    onNodeSelect(e, this);
  };

  onCheck = (e) => {
    if (this.isDisabled()) return;

    const { disableCheckbox, checked } = this.props;
    const {
      context: { onNodeCheck },
    } = this.props;

    if (!this.isCheckable() || disableCheckbox) return;

    e.preventDefault();
    const targetChecked = !checked;
    onNodeCheck(e, this, targetChecked);
  };

  // Disabled item still can be switch
  onExpand = (e) => {
    const {
      context: { onNodeExpand },
    } = this.props;
    onNodeExpand(e, this);
  };

  getNodeChildren = () => {
    const { children } = this.props;
    const originList = toArray(children).filter((node) => node);
    const targetList = getNodeChildren(originList);

    return targetList;
  };

  getNodeState = () => {
    const { expanded } = this.props;

    if (this.isLeaf()) {
      return null;
    }

    return expanded ? ICON_OPEN : ICON_CLOSE;
  };

  isLeaf = () => {
    const { isLeaf, loaded } = this.props;
    const {
      context: { loadData },
    } = this.props;

    const hasChildren = this.getNodeChildren().length !== 0;

    if (isLeaf === false) {
      return false;
    }

    return isLeaf || (!loadData && !hasChildren) || (loadData && loaded && !hasChildren);
  };

  isDisabled = () => {
    const { disabled } = this.props;
    const {
      context: { disabled: treeDisabled },
    } = this.props;

    // Follow the logic of Selectable
    if (disabled === false) {
      return false;
    }

    return !!(treeDisabled || disabled);
  };

  isCheckable = () => {
    const { checkable } = this.props;
    const {
      context: { checkable: treeCheckable },
    } = this.props;

    // Return false if tree or treeNode is not checkable
    if (!treeCheckable || checkable === false) return false;
    return treeCheckable;
  };

  isSelectable() {
    const { selectable } = this.props;
    const {
      context: { selectable: treeSelectable },
    } = this.props;

    // Ignore when selectable is undefined or null
    if (typeof selectable === 'boolean') {
      return selectable;
    }

    return treeSelectable;
  }

  // Switcher
  renderSwitcher = () => {
    const { expanded, switcherIcon: switcherIconFromProps } = this.props;
    const {
      context: { switcherIcon: switcherIconFromCtx },
    } = this.props;

    const switcherIcon = switcherIconFromProps || switcherIconFromCtx;

    if (this.isLeaf()) {
      return typeof switcherIcon === 'function' ? (
        switcherIcon({ ...this.props, isLeaf: true })
      ) : (
        <span className="switcher-noop" />
      );
    }

    return typeof switcherIcon === 'function' ? (
      switcherIcon({ ...this.props, onClick: this.onExpand, isLeaf: false })
    ) : (
      <IconButton size="small" onClick={this.onExpand}>
        {expanded ? <ArrowDropDownIcon size="small" /> : <ArrowRightIcon size="small" />}
      </IconButton>
    );
  };

  // Checkbox
  renderCheckbox = () => {
    const { checked, halfChecked, disableCheckbox } = this.props;
    const {
      context: { checkboxIcon },
    } = this.props;
    const disabled = this.isDisabled();
    const checkable = this.isCheckable();

    if (!checkable) return null;

    return typeof checkboxIcon === 'function' ? (
      checkboxIcon({
        ...this.props,
        disabled: disabled || disableCheckbox,
        checked: halfChecked ? true : checked,
        indeterminate: !checked && halfChecked,
        onClick: this.onCheck,
      })
    ) : (
      <Checkbox
        color="primary"
        disabled={disabled || disableCheckbox}
        checked={halfChecked ? true : checked}
        indeterminate={!checked && halfChecked}
        onClick={this.onCheck}
        style={{ padding: 0 }}
      />
    );
  };

  // Icon + Title
  renderSelector = () => {
    const { title, selected } = this.props;
    const {
      context: { prefixCls },
    } = this.props;
    const disabled = this.isDisabled();

    const wrapClass = `tree-node-content`;

    // Title
    const $title = <span className={`${prefixCls}-title`}>{title}</span>;

    return (
      <span
        title={typeof title === 'string' ? title : ''}
        className={clsx(
          `${wrapClass}`,
          `${wrapClass}-${this.getNodeState() || 'normal'}`,
          !disabled && selected && `${prefixCls}-node-selected`,
        )}
        onClick={this.onSelectorClick}
      >
        {$title}
      </span>
    );
  };

  // Children list wrapped with `Animation`
  renderChildren = () => {
    const { expanded, pos } = this.props;
    const {
      context: { renderTreeNode },
    } = this.props;

    // Children TreeNode
    const nodeList = this.getNodeChildren();

    if (nodeList.length === 0) {
      return null;
    }
    return (
      <div
        className={clsx('child-tree', expanded && `child-tree-open`)}
        data-expanded={expanded}
        role="group"
      >
        {mapChildren(nodeList, (node, index) => renderTreeNode(node, index, pos))}
      </div>
    );
  };

  render() {
    const {
      className,
      style,
      isLeaf,
      expanded,
      selected,
      checked,
      halfChecked,
      ...otherProps
    } = this.props;
    
    const disabled = this.isDisabled();
    const dataOrAriaAttributeProps = getDataAndAria(otherProps);

    return (
      <div
        className={clsx(className, 'treenode', {
          'treenode-disabled': disabled,
        })}
        style={style}
        role="treeitem"
        {...dataOrAriaAttributeProps}
      >
        <div className="tree-node-content-wrapper">
          {this.renderSwitcher()}
          {this.renderCheckbox()}
          {this.renderSelector()}
        </div>
        {this.renderChildren()}
      </div>
    );
  }
}

TreeNode.propTypes = {
  eventKey: PropTypes.string, // Pass by parent `cloneElement`
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  onSelect: PropTypes.func,

  // By parent
  expanded: PropTypes.bool,
  selected: PropTypes.bool,
  checked: PropTypes.bool,
  loaded: PropTypes.bool,
  halfChecked: PropTypes.bool,
  children: PropTypes.node,
  title: PropTypes.node,
  pos: PropTypes.string,

  // By user
  isLeaf: PropTypes.bool,
  checkable: PropTypes.bool,
  selectable: PropTypes.bool,
  disabled: PropTypes.bool,
  disableCheckbox: PropTypes.bool,
  icon: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  switcherIcon: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

const ContextTreeNode = (props) => (
  <TreeContext.Consumer>
    {(context) => <TreeNode {...props} context={context} />}
  </TreeContext.Consumer>
);

ContextTreeNode.defaultProps = {
  title: defaultTitle,
};

ContextTreeNode.isTreeNode = 1;

export default ContextTreeNode;
