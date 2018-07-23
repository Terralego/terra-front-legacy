import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Upload, Icon } from 'antd';

import { addAttachment, removeAttachment } from 'modules/userrequestComments';

class UploadAttachment extends Component {
  state = {

  };

  render () {
    const props = {
      onRemove: file => {
        this.props.removeAttachment(file.uid);
      },
      beforeUpload: file => {
        console.log(file);
        this.props.addAttachment(file);
        return false;
      },
    };
    return (
      <div>
        <Upload {...props}>
          <Button>
            <Icon type="upload" /> Pièce jointe
          </Button>
        </Upload>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  form: state.forms.userrequestComments.$form,
  comment: state.userrequestComments,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  addAttachment,
  removeAttachment,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UploadAttachment);
