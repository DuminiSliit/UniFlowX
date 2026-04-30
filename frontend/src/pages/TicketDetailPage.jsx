import React from 'react';
import TicketDetail from '../components/ticket/TicketDetail';

const TicketDetailPage = ({ id, onBack }) => {
  return <TicketDetail id={id} onBack={onBack} />;
};

export default TicketDetailPage;
