import React, { useCallback, useEffect, useState } from 'react';
import { EyeOutlined, EditOutlined, DeleteOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Dropdown, Table, Button, Card, Select, Input, DatePicker, Modal } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { LiaRupeeSignSolid } from "react-icons/lia";
import { selectListItems } from '@/redux/crud/selectors';
import useLanguage from '@/locale/useLanguage';
import useResponsiveTable from '@/hooks/useResponsiveTable';
import { GrHistory } from "react-icons/gr";
import { useCrudContext } from '@/context/crud';
import * as XLSX from 'xlsx';
import { request } from '@/request';
import { BiReset } from 'react-icons/bi';
import { LiaFileDownloadSolid } from "react-icons/lia";
import { debounce } from 'lodash';

const { Search } = Input;
const { RangePicker } = DatePicker;

function AddNewItem({ config }) {
  const { crudContextAction } = useCrudContext();
  const { collapsedBox, panel } = crudContextAction;
  const { ADD_NEW_ENTITY } = config;

  const handelClick = () => {
    panel.open();
    collapsedBox.close();
  };

  return (
    <Button onClick={handelClick} type="primary">
      {ADD_NEW_ENTITY}
    </Button>
  );
}

export default function DataTable({ config, extra = [], setActiveForm }) {
  let { entity, dataTableColumns } = config;
  const dispatch = useDispatch();
  const { crudContextAction } = useCrudContext();
  const { panel, collapsedBox, modal, readBox, editBox, addBox, advancedBox } = crudContextAction;
  const translate = useLanguage();
  const [selectedInstitute, setSelectedInstitute] = useState(null);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [session, setSession] = useState([]);
  const [userNames, setUserNames] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [historyData, setHistoryData] = useState(null); // State to hold history data
  const [showHistoryModal, setShowHistoryModal] = useState(false); // State to control the visibility of the history modal

  useEffect(() => {
    const fetchData = async () => {
      const { success, result } = await request.filter({ entity: 'payment' });
      if (success) {
        const uniqueStatuses = [...new Set(result.map(item => item.status))];
        const uniqueInstitutes = [...new Set(result.map(item => item.institute_name))];
        const uniqueSession = [...new Set(result.map(item => item.session))];
        const uniqueUniversities = [...new Set(result.map(item => item.university_name))];
        const uniqueUserNames = [...new Set(result.map(item => item.userId?.fullname))];

        setStatuses(uniqueStatuses);
        setInstitutes(uniqueInstitutes);
        setSession(uniqueSession);
        setUniversities(uniqueUniversities);
        setUserNames(uniqueUserNames);
      }
    };

    fetchData();
  }, []);

  const resetValues = () => {
    setSelectedInstitute(null);
    setSelectedUniversity(null);
    setSelectedSession(null);
    setSelectedStatus(null);
    setSelectedUserId(null);
    setSearchQuery('');
    setStartDate(null);
    setEndDate(null);
  };

  const handleDateRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      setStartDate(dates[0]);
      setEndDate(dates[1]);
    }
  };

  const items = [
    {
      label: translate('Show'),
      key: 'read',
      icon: <EyeOutlined />,
    },
    {
      label: translate('Edit'),
      key: 'edit',
      icon: <EditOutlined />,
    },
    {
      label: translate('History'),
      key: 'history',
      icon: <GrHistory />,
    },
    {
      label: translate('Add_payment'),
      key: 'add',
      icon: <LiaRupeeSignSolid className='text-base' />,
    },
    ...extra,
    {
      type: 'divider',
    },
    {
      label: translate('Delete'),
      key: 'delete',
      icon: <DeleteOutlined />,
    },
  ];

  const handleRead = (record) => {
    dispatch(crud.currentItem({ data: record }));
    panel.open();
    collapsedBox.open();
    readBox.open();
  };

  const handleHistory = async (record) => {
    try {
      const historyData = await request.history({ entity: 'lead', id: record._id });
      // Sort the history data in descending order based on the time it was changed
      if (historyData && historyData.history) {
        historyData.history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      }
      setHistoryData(historyData);
      setShowHistoryModal(true);
    } catch (error) {
      console.error("Error fetching history data:", error);
    }
  };
  const handleEdit = (record) => {
    dispatch(crud.currentItem({ data: record }));
    dispatch(crud.currentAction({ actionType: 'update', data: record }));
    editBox.open();
    panel.open();
    collapsedBox.open();
    setActiveForm('updateForm');
  };

  const handleAddpayment = (record) => {
    dispatch(crud.currentItem({ data: record }));
    dispatch(crud.currentAction({ actionType: 'update', data: record }));
    addBox.open();
    panel.open();
    collapsedBox.open();
    setActiveForm('addForm');
  };

  const handleDelete = (record) => {
    dispatch(crud.currentAction({ actionType: 'delete', data: record }));
    modal.open();
  };

  const handleUpdatePassword = (record) => {
    dispatch(crud.currentItem({ data: record }));
    dispatch(crud.currentAction({ actionType: 'update', data: record }));
    advancedBox.open();
    panel.open();
    collapsedBox.open();
  };

  dataTableColumns = [
    ...dataTableColumns,
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      render: (_, record) => (
        <Dropdown
          menu={{
            items,
            onClick: ({ key }) => {
              switch (key) {
                case 'read':
                  handleRead(record);
                  break;
                case 'edit':
                  handleEdit(record);
                  break;
                case 'add':
                  handleAddpayment(record);
                  break;
                case 'history':
                  handleHistory(record);
                  break;
                case 'delete':
                  handleDelete(record);
                  break;
                case 'updatePassword':
                  handleUpdatePassword(record);
                  break;
                default:
                  break;
              }
            },
          }}
          trigger={['click']}
        >
          <EllipsisOutlined
            style={{ cursor: 'pointer', fontSize: '24px' }}
            onClick={(e) => e.preventDefault()}
          />
        </Dropdown>
      ),
    },
  ];

  const { result: listResult } = useSelector(selectListItems);
  const { items: dataSource } = listResult;
  const renderHistoryModal = () => {
    return (
      <Modal
        title="History"
        visible={showHistoryModal}
        onCancel={() => setShowHistoryModal(false)}
        footer={null}
        width={800}
        className="history-modal"
      >
        {/* Check if historyData exists */}
        {historyData && historyData.history && historyData.history.length > 0 ? (
          // Render each history item
          <div className="history-tree">
            {historyData.history.map((historyItem, index) => (
              <React.Fragment key={index}>
                <h3 className="fullname capitalize">{historyItem.updatedBy.fullname}</h3>
                <div className="history-node">
                  <div className="node-header">
                    <h3 className="timestamp">{new Date(historyItem.updatedAt).toLocaleString()}</h3>
                  </div>
                  <div className="node-content capitalize">
                    <table className="change-table">
                      <tbody>
                        {historyItem.updatedFields.full_name && (
                          <tr>
                            <td className="change-key">Full Name:</td>
                            <td className="old-value">{historyItem.updatedFields.full_name.oldValue}</td>
                            <td className="new-value">{historyItem.updatedFields.full_name.newValue}</td>
                          </tr>
                        )}

                        {historyItem.updatedFields.lead_id && (
                          <tr>
                            <td className="change-key">Lead ID:</td>
                            <td className="old-value">{historyItem.updatedFields.lead_id.oldValue}</td>
                            <td className="new-value">{historyItem.updatedFields.lead_id.newValue}</td>
                          </tr>
                        )}
                        {historyItem.updatedFields.contact && (
                          Object.entries(historyItem.updatedFields.contact.newValue).map(([key, newValue]) => (
                            <tr key={key}>
                              <td className="change-key">{key}:</td>
                              <td className="old-value"> {historyItem.updatedFields.contact.oldValue[key]}</td>
                              <td className="new-value">{newValue}</td>
                            </tr>
                          ))
                        )}
                        {/* Render changes for education */}
                        {historyItem.updatedFields.education && (
                          Object.entries(historyItem.updatedFields.education.newValue).map(([key, newValue]) => (
                            <tr key={key}>
                              <td className="change-key">{key}:</td>
                              <td className="old-value"> {historyItem.updatedFields.education.oldValue[key]}</td>
                              <td className="new-value">{newValue}</td>
                            </tr>
                          ))
                        )}
                        {/* Render changes for customfields */}
                        {Object.entries(historyItem.updatedFields.customfields.newValue).map(([key, newValue]) => (
                          <tr key={key}>
                            <td className="change-key">{key}:</td>
                            <td className="old-value"> {historyItem.updatedFields.customfields.oldValue[key]}</td>
                            <td className="new-value">{newValue}</td>
                          </tr>
                        ))}


                      </tbody>
                    </table>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        ) : (
          <p>No history available.</p>
        )}
      </Modal>
    );
  };
  const handelDataTableLoad = useCallback(
    async (pagination, newSearchQuery = '') => {
      const options = {
        page: pagination.current || 1,
        items: pagination.pageSize || 10,
        total: pagination.total || 0,
        filter: {
          q: newSearchQuery,
          institute: selectedInstitute,
          university: selectedUniversity,
          session: selectedSession,
          status: selectedStatus,
          userId: selectedUserId,
          startDate,
          endDate,
        },
      };

      const { success, result } = await dispatch(crud.list({ entity, options }));
      if (success) {
        const filteredData = filterDataSource(result);
      }
    },
    [entity, selectedInstitute, selectedUniversity, selectedStatus, selectedUserId, selectedSession, startDate, endDate]
  );

  const handleSearch = debounce((value) => {
    setSearchQuery(value);
    handelDataTableLoad({}, value);
  }, 500);

  const dispatcher = () => {
    dispatch(crud.list({ entity }));
  };

  useEffect(() => {
    const controller = new AbortController();
    dispatcher();
    return () => {
      controller.abort();
    };
  }, [entity]);

  const { tableColumns } = useResponsiveTable(dataTableColumns, items);

  const filterDataSource = (data) => {
    return data.filter(item => {
      const customfields = item.customfields || {};
      const instituteMatch = !selectedInstitute || customfields.institute_name === selectedInstitute;
      const universityMatch = !selectedUniversity || customfields.university_name === selectedUniversity;
      const sessionMatch = !selectedSession || customfields.session === selectedSession;
      const statusMatch = !selectedStatus || customfields.status === selectedStatus;
      const userMatch = !selectedUserId || item.userId?.fullname === selectedUserId;

      const createdDate = new Date(item.created);
      const startDateMatch = !startDate || createdDate >= startDate;
      const endDateMatch = !endDate || createdDate <= endDate;

      const phoneAsString = item.contact?.phone?.toString();
      const emailLowerCase = item.contact?.email?.toLowerCase();

      const searchMatch = !searchQuery || (
        item.lead_id.includes(searchQuery) ||
        (emailLowerCase && emailLowerCase.includes(searchQuery.toLowerCase())) ||
        (typeof phoneAsString === 'string' && phoneAsString.includes(searchQuery)) ||
        item.full_name.includes(searchQuery)
      );
      return instituteMatch && universityMatch && sessionMatch && searchMatch && statusMatch && userMatch && startDateMatch && endDateMatch;
    });
  };

  const handleExportToExcel = () => {
    if (dataSource.length === 0) {
      return;
    }
    const fileName = 'data.xlsx';

    const exportData = [
      dataTableColumns.map(column => column.title),
      ...dataSource.map(item => dataTableColumns.map(column => {
        let value = item;
        const dataIndex = column.dataIndex;
        const keys = dataIndex ? (Array.isArray(dataIndex) ? dataIndex : dataIndex.split('.')) : [];
        keys.forEach(key => {
          value = value?.[key];
        });
        return value;
      })),
    ];

    const ws = XLSX.utils.aoa_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Lead Data');

    try {
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error('Error exporting data to Excel:', error);
    }
  };

  const renderTable = () => {
    const filteredData = filterDataSource(dataSource);
    return (
      <>
        <Card className='mt-8'>
          <div className='flex justify-between items-center mb-3'>
            {entity === 'lead' && (
              <div className='flex items-center gap-2'>
                <div className="flex justify-center items-center text-red-500">
                  <span className='font-thin text-sm'>Total:</span> <span className='font-thin text-sm'> {filteredData.length}</span>
                </div>
                <Search
                  placeholder="Search by email"
                  onSearch={handleSearch}
                  onChange={(e) => handleSearch(e.target.value)}
                  className='w-full'
                />
              </div>
            )}
            {entity === 'admin' && (
              <div className='flex items-center gap-2'>
                <div className="flex justify-center items-center text-red-500">
                  <span className='font-thin text-sm'>Total:</span> <span className='font-thin text-sm'> {filteredData.length}</span>
                </div>
              </div>
            )}
            <div className='space-x-2 flex items-center'>
              <AddNewItem key="addNewItem" config={config} />
              <div className='font-thin'>
                <LiaFileDownloadSolid title='Export excel' onClick={handleExportToExcel} className='text-3xl text-blue-500 hover:text-blue-700 cursor-pointer' />
              </div>
            </div>
          </div>
          <Table
            columns={tableColumns}
            rowKey={(item) => item._id}
            dataSource={filteredData}
            pagination={true}
            onChange={handelDataTableLoad}
          />
        </Card>
      </>
    );
  };

  const renderFilters = () => {
    if (entity === 'lead') {
      return (
        <Card className="custom-card">
          <div className='flex items-center justify-start mb-10 gap-3'>
            <div className='grid grid-cols-5 gap-3'>
              <div>
                <Select showSearch optionFilterProp="children" filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                  placeholder="Select institute"
                  className='w-60 h-10 capitalize'
                  value={selectedInstitute}
                  onChange={(value) => setSelectedInstitute(value)}
                >
                  {institutes.map(institute => (
                    <Select.Option key={institute}>{institute}</Select.Option>
                  ))}
                </Select>
              </div>
              <div>
                <Select showSearch optionFilterProp="children" filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                  placeholder="Select university"
                  className='w-60 h-10 capitalize'
                  value={selectedUniversity}
                  onChange={(value) => setSelectedUniversity(value)}
                >
                  {universities.map(university => (
                    <Select.Option key={university}>{university}</Select.Option>
                  ))}
                </Select>
              </div>
              <div>
                <Select showSearch optionFilterProp="children" filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                  placeholder="Select status"
                  className='w-60 h-10 capitalize'
                  value={selectedStatus}
                  onChange={(value) => setSelectedStatus(value)}
                >
                  {statuses.map(status => (
                    <Select.Option key={status}>{status}</Select.Option>
                  ))}
                </Select>
              </div>
              <div>
                <Select showSearch optionFilterProp="children" filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                  placeholder="Select user full name"
                  className='w-60 h-10 capitalize'
                  value={selectedUserId}
                  onChange={(value) => setSelectedUserId(value)}
                >
                  {userNames.map((userName) => (
                    <Select.Option className="capitalize font-thin font-mono" key={userName}>
                      {userName}
                    </Select.Option>
                  ))}
                </Select>
              </div>
              <div>
                <Select showSearch optionFilterProp="children" filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                  placeholder="Select session"
                  className='w-60 h-10 capitalize'
                  value={selectedSession}
                  onChange={(value) => setSelectedSession(value)}
                >
                  {session.map((session) => (
                    <Select.Option className="capitalize font-thin font-mono" key={session}>
                      {session}
                    </Select.Option>
                  ))}
                </Select>
              </div>
              <div>
                <RangePicker
                  className='w-60 h-10 capitalize'
                  onChange={handleDateRangeChange}
                  style={{ width: '100%' }}
                  placeholder={['Start Date', 'End Date']}
                />
              </div>
              <div>
                <Button title='Reset All Filters' onClick={resetValues} className='bg-transparent text-red-500 font-thin text-lg h-10 hover:text-red-600'>
                  <BiReset />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      );
    }

    return null;
  };



  return (
    <>
      <div>
        {renderFilters()}
      </div>
      <div className="table-container">
        {renderTable()}
      </div>
      {renderHistoryModal()}
    </>
  );
}
