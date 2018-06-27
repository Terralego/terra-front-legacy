import FormWhere from 'components/Form/FormWhere';
import FormProject from 'components/Form/FormProject';

const FormConfig = {
  steps: [
    { title: 'Projet', component: FormProject },
    { title: 'Where', component: FormWhere },
  ],
  title: {
    edit: 'Nouvelle demande d\'autorisation',
    preview: 'Récapitulatif de la demande d\'autorisation',
  },
  confirmation: {
    dratButton: 'Save as draft',
    previewButton: 'Preview your request',
    editButton: 'Edit my request',
    submitButton: 'Send my request',
    errorText: 'Error message',
    modal: {
      title: 'Request sent',
      action: 'Go to requests list',
      text: 'Submit successed!',
    },
  },
  status: [
    { id: 0, title: 'Approved' },
    { id: 1, title: 'Refused' },
  ],
};

export default FormConfig;
