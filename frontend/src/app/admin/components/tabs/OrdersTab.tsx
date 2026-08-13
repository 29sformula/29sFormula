import React from 'react';
import styles from '../../page.module.css';
import ActiveOrdersSubTab from './orders/ActiveOrdersSubTab';
import ReturnsSubTab from './orders/ReturnsSubTab';
import CancelledSubTab from './orders/CancelledSubTab';
import CompletedSubTab from './orders/CompletedSubTab';

export default function OrdersTab(props: any) {
  const { activeSubTab } = props;
  
  return (
    <>
      {activeSubTab === "all" && <ActiveOrdersSubTab {...props} />}
      {activeSubTab === "returns" && <ReturnsSubTab {...props} />}
      {activeSubTab === "cancelled" && <CancelledSubTab {...props} />}
      {activeSubTab === "completed" && <CompletedSubTab {...props} />}
    </>
  );
}
