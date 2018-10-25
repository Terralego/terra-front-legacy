const getColumns = () => [{
  title: 'Nom',
  dataIndex: 'properties.title',
  key: 'properties.title',
  width: 250,
  render: title => title,
  sorter: (a, b) =>
    a.properties.title.toLowerCase().localeCompare(b.properties.title.toLowerCase()),
}, {
  title: 'Id',
  dataIndex: 'id',
  key: 'id',
  width: 80,
  render: id => id,
  sorter: (a, b) => a.state - b.state,
}];

export default getColumns;
