import React from 'react';
import { Button, Upload, Icon } from 'antd';

import upload from 'helpers/uploadHelpers';

class UploadFile extends React.Component {
  state = {
    file: '',
    uploading: false,
  }

  componentWillUnmount () { this.isCancelled = true; }

  handleChange = ({ file }) => this.setState({ file });

  handleSubmit = async () => {
    const { endpoint, fileType } = this.props;
    const { file } = this.state;

    this.setState({ uploading: true });
    await upload(endpoint, file, fileType);
    if (this.isCancelled) return;
    this.setState({ uploading: false });
  }

  handleUploadRemoved = () => {
    this.setState({ file: '' });
  }

  uploadWillStart = () => false;

  render () {
    const {
      uploadWillStart,
      handleUploadRemoved,
      handleChange,
      handleSubmit,
    } = this;
    const { uploading } = this.state;

    return (
      <React.Fragment>
        <Upload
          beforeUpload={uploadWillStart}
          onRemove={handleUploadRemoved}
          multiple={false}
          onChange={handleChange}
        >
          <Button>
            <Icon type="upload" /> Ajouter un fichier
          </Button>
        </Upload>

        <Button
          loading={uploading}
          style={{ marginTop: 10 }}
          onClick={handleSubmit}
          size="large"
        >
          Envoyer
        </Button>
      </React.Fragment>
    );
  }
}

export default UploadFile;
