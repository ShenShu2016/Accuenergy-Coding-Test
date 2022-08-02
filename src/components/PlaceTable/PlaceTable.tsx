/*
 * @Author: Leo
 * @Date: 2022-08-02 16:07:06
 * @LastEditors: Leo
 * @LastEditTime: 2022-08-02 16:53:24
 * @FilePath: \Accuenergy-Coding-Test\src\components\PlaceTable\PlaceTable.tsx
 * @Description:
 */
import { Table, Button } from 'antd';
import type { TableRowSelection } from 'antd/es/table/interface';
import React, { SetStateAction, useState } from 'react';
import { SearchedPlaces } from '../../views/Home/Home';
import { Center } from '../../views/Home/Home';

const { Column } = Table;

interface SearchedPlacesProps {
    setMapCenter: React.Dispatch<SetStateAction<Center>>;
    searchedPlaces: Array<SearchedPlaces>;
    setSearchedPlaces: React.Dispatch<SetStateAction<Array<SearchedPlaces>>>
}

interface DataType {
    position: Center;
    name: string;
    key: string;
  }


const PlaceTable: React.FC<SearchedPlacesProps> = ({ searchedPlaces, setMapCenter, setSearchedPlaces }) => {

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection: TableRowSelection<DataType> = {
      selectedRowKeys,
      onChange: onSelectChange,
      selections: [
        Table.SELECTION_ALL,
        Table.SELECTION_INVERT,
        Table.SELECTION_NONE,
        {
          key: 'odd',
          text: 'Select Odd Row',
          onSelect: changableRowKeys => {
            let newSelectedRowKeys = [];
            newSelectedRowKeys = changableRowKeys.filter((_, index) => {
              if (index % 2 !== 0) {
                return false;
              }
              return true;
            });
            setSelectedRowKeys(newSelectedRowKeys);
          },
        },
        {
          key: 'even',
          text: 'Select Even Row',
          onSelect: changableRowKeys => {
            let newSelectedRowKeys = [];
            newSelectedRowKeys = changableRowKeys.filter((_, index) => {
              if (index % 2 !== 0) {
                return true;
              }
              return false;
            });
            setSelectedRowKeys(newSelectedRowKeys);
          },
        },
      ],
    };

    const handleLocatePlace = (data: DataType) => {
        setMapCenter(data.position);
    }

    const handleDeleteSelected = () => {
        setSearchedPlaces((prev) => {
            const changed = prev.filter((item) => selectedRowKeys.findIndex((key) => key === item.key) === -1);
            return changed;
        })
    }

    return (
        <>
            <Button onClick={handleDeleteSelected}>Delete</Button>
            <Table
                style={{marginTop: '12px'}}
                rowSelection={rowSelection}
                dataSource={searchedPlaces}
            >
                <Column
                    title="Searched Places"
                    key="name"
                    render={(_: any, record: DataType) => (
                        <span>{record.name}</span>
                    )}
                />
                <Column
                    title="Action"
                    key="action"
                    render={(_: any, record: DataType) => (
                        <Button onClick={() => handleLocatePlace(record)}>Locate</Button>
                    )}
                />
            </Table>
        </>
    )
};

export default PlaceTable;