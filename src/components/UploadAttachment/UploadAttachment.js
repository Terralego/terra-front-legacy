import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Upload, Icon } from 'antd';

import { addAttachment, removeAttachment } from 'modules/userrequestComment';

const UploadAttachment = props => {
  const onRemove = file => {
    props.removeAttachment(file.uid);
  };

  const beforeUpload = file => {
    props.addAttachment(file);
    return false;
  };

  return (
    <Upload
      multiple={false}
      onRemove={onRemove}
      beforeUpload={beforeUpload}
      fileList={props.file && [props.file]}
    >
      <Button size="small">
        <Icon type="upload" /> Joindre un fichier
      </Button>
    </Upload>
  );
};

const mapStateToProps = state => ({
  file: state.userrequestComment.attachment,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  addAttachment,
  removeAttachment,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UploadAttachment);
