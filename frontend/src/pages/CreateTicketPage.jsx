import React from 'react';
import TicketForm from '../components/ticket/TicketForm';

const CreateTicketPage = ({ onSuccess, onCancel }) => {
  return <TicketForm isEdit={false} onSuccess={onSuccess} onCancel={onCancel} />;
};

export default CreateTicketPage;
