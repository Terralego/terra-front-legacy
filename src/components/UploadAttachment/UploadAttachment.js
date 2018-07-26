import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Upload, Icon } from 'antd';

import { addAttachment, removeAttachment } from 'modules/userrequestComments';

const UploadAttachment = props => {
  const onRemove = file => {
    props.removeAttachment(file.uid);
  };

  const beforeUpload = file => {
    props.addAttachment(file);
    return false;
  };

  return (
    <div>
      <Upload
        multiple={false}
        onRemove={onRemove}
        beforeUpload={beforeUpload}
      >
        <Button>
          <Icon type="upload" /> Joindre un fichier
        </Button>
      </Upload>
    </div>
  );
};

const mapStateToProps = state => ({
  form: state.forms.userrequestComments.$form,
  comment: state.userrequestComments,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  addAttachment,
  removeAttachment,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UploadAttachment);
