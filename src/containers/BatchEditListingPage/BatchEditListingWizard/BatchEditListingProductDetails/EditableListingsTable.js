import imagePlaceholder from '../../../../assets/image-placeholder.jpg';
import { Switch, Table } from 'antd';
import { imageDimensions } from '../../BatchEditListingPage.duck';
import css from './EditListingBatchProductDetails.module.css';
import React, { useState } from 'react';
import { EditableCellComponents } from './EditableCellComponents';

function stringSorter(strA, strB) {
  return strA.name.localeCompare(strB.name, 'en', { sensitivity: 'base' });
}

export const EditableListingsTable = props => {
  const { onSave, dataSource, listingFieldsOptions } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const {
    categories: imageryCategoryOptions,
    usages: usageOptions,
    releases: releaseOptions,
  } = listingFieldsOptions;

  const handleSave = updatedData => {
    onSave(updatedData);
  };

  const columns = [
    {
      title: 'Thumbnail',
      dataIndex: 'preview',
      render: previewUrl => <img alt="Thumbnail" src={previewUrl || imagePlaceholder} />,
      fixed: 'left',
    },
    {
      title: 'File Name',
      dataIndex: 'name',
      width: 300,
      sorter: stringSorter,
    },
    {
      title: 'Title',
      width: 400,
      dataIndex: 'title',
      editable: true,
      editControlType: 'text',
      sorter: stringSorter,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      editable: true,
      editControlType: 'text',
      sorter: stringSorter,
    },
    {
      title: 'Is AI',
      dataIndex: 'isAi',
      render: (_, record) => {
        const { isAi } = record;
        return (
          <Switch
            value={isAi}
            checkedChildren="Yes"
            unCheckedChildren="No"
            onChange={value =>
              handleSave({
                ...record,
                isAi: value,
                isIllustration: value ? false : record.isIllustration,
              })
            }
          />
        );
      },
    },
    {
      title: 'Is Illustration',
      dataIndex: 'isIllustration',
      render: (_, record) => {
        const { isIllustration } = record;
        return (
          <Switch
            value={isIllustration}
            checkedChildren="Yes"
            unCheckedChildren="No"
            onChange={value =>
              handleSave({
                ...record,
                isAi: value ? false : record.isAi,
                isIllustration: value,
              })
            }
          />
        );
      },
    },
    {
      title: 'Category',
      width: 300,
      dataIndex: 'category',
      editable: true,
      editControlType: 'selectMultiple',
      options: imageryCategoryOptions,
    },
    {
      title: 'Usage',
      width: 200,
      dataIndex: 'usage',
      editable: true,
      editControlType: 'select',
      options: usageOptions,
    },
    {
      title: 'Do you have releases on file / can you obtain them?',
      dataIndex: 'releases',
      width: 300,
      editable: true,
      editControlType: 'select',
      options: releaseOptions,
    },
    {
      title: 'Keywords',
      width: 400,
      dataIndex: 'keywords',
      editable: true,
      editControlType: 'tags',
    },
    {
      title: 'Dimensions',
      dataIndex: 'dimensions',
      render: dimensionsKey => {
        return imageDimensions[dimensionsKey].label;
      },
      sorter: stringSorter,
    },
    {
      title: 'Size',
      dataIndex: 'size',
      render: size => `${(size / 1024).toFixed(2)} KB`,
      sorter: (a, b) => a.size - b.size,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      editable: true,
      editControlType: 'text',
    },
  ];

  const editableColumns = columns.map(col => {
    if (!col.editable) return col;

    return {
      ...col,
      onCell: record => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
        editControlType: col.editControlType,
        options: col.options,
        cellClassName: css.editableCellValueWrap,
      }),
    };
  });

  const onSelectChange = newSelectedRowKeys => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <Table
      columns={editableColumns}
      components={EditableCellComponents}
      dataSource={dataSource}
      rowClassName={() => css.editableRow}
      rowKey="id"
      pagination={false}
      scroll={{
        x: 'max-content',
      }}
      rowSelection={rowSelection}
    />
  );
};
